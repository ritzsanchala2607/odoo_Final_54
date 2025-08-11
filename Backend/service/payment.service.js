const { Payment } = require('../helper/db.helper');

async function createPayment(payload) {
  return Payment.create(payload);
}

async function getPaymentByBooking(booking_id) {
  return Payment.findOne({ where: { booking_id } });
}

module.exports = { createPayment, getPaymentByBooking };

