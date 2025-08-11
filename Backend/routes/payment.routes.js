const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const { requireAuth } = require('../middleware/auth');
const creditController = require('../controller/credit.controller');

// Existing routes
router.get('/booking/:booking_id', requireAuth, paymentController.getByBooking);
router.post('/', requireAuth, paymentController.create);

// Razorpay integration routes for bookings
router.post('/create-order', paymentController.createRazorpayOrder);
router.post('/verify', paymentController.verifyRazorpayPayment);
router.post('/webhook', paymentController.handleRazorpayWebhook);

// Razorpay integration routes for credit top-up
router.post('/credits/create-order', requireAuth, creditController.createOrder);
router.post('/credits/verify', requireAuth, creditController.verify);

module.exports = router;

