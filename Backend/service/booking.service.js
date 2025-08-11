const { Booking, Payment, Court, Venue, User } = require('../helper/db.helper');
const { v4: uuidv4 } = require('uuid');

async function createBooking(payload) {
  const booking_ref = `BK-${uuidv4().slice(0, 8).toUpperCase()}`;
  const booking = await Booking.create({ ...payload, booking_ref });
  return booking;
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

module.exports = { createBooking, listMyBookings, cancelBooking };

