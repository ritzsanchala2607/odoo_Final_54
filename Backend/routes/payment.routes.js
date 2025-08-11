const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/booking/:booking_id', requireAuth, paymentController.getByBooking);
router.post('/', requireAuth, paymentController.create);

module.exports = router;

