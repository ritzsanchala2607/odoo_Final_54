const { Payment, Booking } = require('../helper/db.helper');

async function createPayment(payload) {
  return Payment.create(payload);
}

async function getPaymentByBooking(booking_id) {
  return Payment.findOne({ where: { booking_id } });
}

// Create booking record
async function createBooking(payload) {
  try {
    return await Booking.create(payload);
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Update payment status
async function updatePaymentStatus(orderId, status) {
  try {
    return await Payment.update(
      { status: status },
      { where: { razorpay_order_id: orderId } }
    );
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

module.exports = { 
  createPayment, 
  getPaymentByBooking, 
  createBooking, 
  updatePaymentStatus 
};

