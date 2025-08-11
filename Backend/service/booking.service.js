const { Booking, Payment, Court, Venue, User, BookingParticipant } = require('../helper/db.helper');
const { v4: uuidv4 } = require('uuid');

async function createBooking(payload) {
  const booking_ref = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
  let player_capacity = payload.player_capacity;
  if (!player_capacity) {
    const court = await Court.findByPk(payload.court_id);
    if (court) player_capacity = court.capacity || 1;
  }
  // compute unit_price by pricing_mode
  const court = await Court.findByPk(payload.court_id);
  const pricing_mode = payload.pricing_mode || 'per_hour';
  let unit_price = 0;
  if (pricing_mode === 'per_person') {
    unit_price = court?.price_per_person || 0;
  } else {
    unit_price = court?.price_per_hour || 0;
  }
  const effective_refund_ratio = court?.refund_ratio_override ?? null;
  const booking = await Booking.create({ ...payload, booking_ref, player_capacity, pricing_mode, unit_price, effective_refund_ratio });
  // host auto-joins as 'host'
  await BookingParticipant.create({ booking_id: booking.id, user_id: payload.user_id, role: 'host', status: 'joined' });
  return booking;
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

