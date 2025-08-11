const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, bookingController.myBookings);
router.post('/', requireAuth, bookingController.create);
router.post('/:id/cancel', requireAuth, bookingController.cancel);

module.exports = router;

