const { Booking, Payment, Court, Venue, User, BookingParticipant, CreditTransaction } = require('../helper/db.helper');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

async function createBooking(payload) {
  const booking_ref = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;

  if (!payload.court_id) throw new Error('court_id is required');
  if (!payload.start_at || !payload.end_at) throw new Error('start_at and end_at are required');

  const startAt = new Date(payload.start_at);
  const endAt = new Date(payload.end_at);
  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new Error('Invalid start_at or end_at');
  }
  if (startAt >= endAt) throw new Error('start_at must be before end_at');

  // Load court and validate venue linkage
  const court = await Court.findByPk(payload.court_id);
  if (!court) throw new Error('Court not found');

  const venueId = payload.venue_id ? payload.venue_id : court.venue_id;
  if (payload.venue_id && payload.venue_id !== court.venue_id) {
    throw new Error('Court does not belong to the provided venue');
  }

  // Prevent overlapping bookings for the same court
  const overlapping = await Booking.findOne({
    where: {
      court_id: court.id,
      status: { [Op.ne]: 'cancelled' },
      [Op.and]: [
        { start_at: { [Op.lt]: endAt } },
        { end_at: { [Op.gt]: startAt } },
      ],
    },
  });
  if (overlapping) {
    throw new Error('This court is already booked for the selected time');
  }

  // Determine capacity default from court
  let player_capacity = payload.player_capacity;
  if (!player_capacity) player_capacity = court.capacity || 1;

  // compute unit_price by pricing_mode and total based on duration
  const pricing_mode = payload.pricing_mode || 'per_hour';
  let unit_price = 0;
  if (pricing_mode === 'per_person') {
    unit_price = court.price_per_person || 0;
  } else {
    unit_price = court.price_per_hour || 0;
  }
  const effective_refund_ratio = court.refund_ratio_override ?? null;

  const durationHours = (endAt.getTime() - startAt.getTime()) / (1000 * 60 * 60);
  if (durationHours <= 0) throw new Error('Invalid booking duration');

  const computedTotal = pricing_mode === 'per_person'
    ? (Number(unit_price) * Number(player_capacity) * durationHours)
    : (Number(unit_price) * durationHours);

  const creditsNeeded = Math.ceil(computedTotal);

  // Ensure user has enough credits, deduct and record transaction atomically with booking
  const db = require('../helper/db.helper');
  return await db.sequelize.transaction(async (t) => {
    // Re-check overlap within transaction window (best-effort)
    const overlappingInTx = await Booking.findOne({
      where: {
        court_id: court.id,
        status: { [Op.ne]: 'cancelled' },
        [Op.and]: [
          { start_at: { [Op.lt]: endAt } },
          { end_at: { [Op.gt]: startAt } },
        ],
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (overlappingInTx) throw new Error('This court is already booked for the selected time');

    const user = await User.findByPk(payload.user_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) throw new Error('User not found');
    if ((user.credit_balance || 0) < creditsNeeded) {
      throw new Error('Insufficient credits');
    }

    const booking = await Booking.create({
      user_id: payload.user_id,
      court_id: court.id,
      venue_id: venueId,
      start_at: startAt,
      end_at: endAt,
      booking_ref,
      player_capacity,
      pricing_mode,
      unit_price,
      effective_refund_ratio,
      total_amount: Number(computedTotal.toFixed(2)),
      status: 'confirmed',
      visibility: payload.visibility || 'private',
    }, { transaction: t });

    await BookingParticipant.create({ booking_id: booking.id, user_id: payload.user_id, role: 'host', status: 'joined' }, { transaction: t });

    // Deduct credits
    user.credit_balance = (user.credit_balance || 0) - creditsNeeded;
    await user.save({ transaction: t });

    await CreditTransaction.create({
      user_id: payload.user_id,
      booking_id: booking.id,
      amount: -creditsNeeded, // spend
      type: 'spend',
      reason: 'Court booking',
      created_at: new Date(),
    }, { transaction: t });

    // Record payment row for audit
    await Payment.create({
      booking_id: booking.id,
      method: 'credits',
      amount: Number(computedTotal.toFixed(2)),
      credits_used: creditsNeeded,
      currency: 'INR',
      status: 'completed',
      created_at: new Date(),
    }, { transaction: t });

    return booking;
  });
}

async function getBookings(query = {}) {
  const where = {};
  
  if (query.user_id) where.user_id = query.user_id;
  if (query.status) where.status = query.status;
  if (query.venue_id) where.venue_id = query.venue_id;
  
  return Booking.findAll({ 
    where,
    include: [
      { model: User, attributes: ['id', 'full_name', 'email'] },
      { model: Court, attributes: ['id', 'name'] },
      { model: Venue, attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']] 
  });
}

async function getBookingById(id) {
  return Booking.findByPk(id, {
    include: [
      { model: User, attributes: ['id', 'full_name', 'email'] },
      { model: Court, attributes: ['id', 'name'] },
      { model: Venue, attributes: ['id', 'name'] }
    ]
  });
}

async function updateBooking(id, updates) {
  const booking = await Booking.findByPk(id);
  if (!booking) throw new Error('Booking not found');
  
  await booking.update(updates);
  return booking;
}

async function deleteBooking(id) {
  const booking = await Booking.findByPk(id);
  if (!booking) throw new Error('Booking not found');
  
  await booking.destroy();
  return { message: 'Booking deleted successfully' };
}

async function listMyBookings(user_id) {
  return Booking.findAll({ where: { user_id }, order: [['created_at', 'DESC']] });
}

async function cancelBooking(id, user_id) {
  const booking = await Booking.findOne({ where: { id, user_id } });
  if (!booking) throw new Error('Booking not found');
  booking.status = 'cancelled';
  booking.cancelled_at = new Date();
  await booking.save();
  return booking;
}

async function joinBooking(booking_id, user_id) {
  const booking = await Booking.findByPk(booking_id);
  if (!booking) throw new Error('Booking not found');
  if (booking.visibility === 'private') throw new Error('Private booking');

  const count = await BookingParticipant.count({ where: { booking_id, status: 'joined' } });
  if (booking.player_capacity && count >= booking.player_capacity) throw new Error('Booking full');

  const existing = await BookingParticipant.findOne({ where: { booking_id, user_id } });
  if (existing) return existing;

  const status = booking.allow_auto_join ? 'joined' : 'requested';
  return BookingParticipant.create({ booking_id, user_id, role: 'player', status });
}

async function approveParticipant(booking_id, user_id, host_id) {
  const booking = await Booking.findByPk(booking_id);
  if (!booking) throw new Error('Booking not found');
  const host = await BookingParticipant.findOne({ where: { booking_id, user_id: host_id, role: 'host', status: 'joined' } });
  if (!host) throw new Error('Only host can approve');
  const participant = await BookingParticipant.findOne({ where: { booking_id, user_id } });
  if (!participant) throw new Error('Participant not found');
  participant.status = 'joined';
  await participant.save();
  return participant;
}

async function rejectParticipant(booking_id, user_id, host_id) {
  const booking = await Booking.findByPk(booking_id);
  if (!booking) throw new Error('Booking not found');
  const host = await BookingParticipant.findOne({ where: { booking_id, user_id: host_id, role: 'host', status: 'joined' } });
  if (!host) throw new Error('Only host can reject');
  const participant = await BookingParticipant.findOne({ where: { booking_id, user_id } });
  if (!participant) throw new Error('Participant not found');
  participant.status = 'rejected';
  await participant.save();
  return participant;
}

async function leaveBooking(booking_id, user_id) {
  const participant = await BookingParticipant.findOne({ where: { booking_id, user_id } });
  if (!participant) return;
  if (participant.role === 'host') throw new Error('Host cannot leave');
  participant.status = 'cancelled';
  await participant.save();
  return participant;
}

module.exports = { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBooking, 
  deleteBooking,
  listMyBookings, 
  cancelBooking, 
  joinBooking, 
  approveParticipant, 
  rejectParticipant, 
  leaveBooking 
};

