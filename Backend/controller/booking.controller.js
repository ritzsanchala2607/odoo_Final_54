const { validationResult } = require('express-validator');
const bookingService = require('../service/booking.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const booking = await bookingService.createBooking({ ...req.body, user_id: req.user.id });
    return res.status(201).json({ booking });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function myBookings(req, res) {
  try {
    const bookings = await bookingService.listMyBookings(req.user.id);
    return res.json({ bookings });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function cancel(req, res) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    return res.json({ booking });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, myBookings, cancel };
async function join(req, res) {
  try {
    const record = await bookingService.joinBooking(req.params.id, req.user.id);
    return res.status(201).json({ participant: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function approve(req, res) {
  try {
    const record = await bookingService.approveParticipant(req.params.id, req.params.user_id, req.user.id);
    return res.json({ participant: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function reject(req, res) {
  try {
    const record = await bookingService.rejectParticipant(req.params.id, req.params.user_id, req.user.id);
    return res.json({ participant: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function leave(req, res) {
  try {
    const record = await bookingService.leaveBooking(req.params.id, req.user.id);
    return res.json({ participant: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, myBookings, cancel, join, approve, reject, leave };

