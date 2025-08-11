const paymentService = require('../service/payment.service');

async function create(req, res) {
  try {
    const payment = await paymentService.createPayment(req.body);
    return res.status(201).json({ payment });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getByBooking(req, res) {
  try {
    const payment = await paymentService.getPaymentByBooking(req.params.booking_id);
    return res.json({ payment });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, getByBooking };

