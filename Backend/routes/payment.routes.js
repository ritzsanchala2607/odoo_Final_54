const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const { requireAuth } = require('../middleware/auth');

// Existing routes
router.get('/booking/:booking_id', requireAuth, paymentController.getByBooking);
router.post('/', requireAuth, paymentController.create);

// Razorpay integration routes
router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyRazorpayPayment);
router.post('/webhook', paymentController.handleRazorpayWebhook);

module.exports = router;

