const express = require('express');
const router = express.Router();
const bookingController = require('../controller/booking.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, bookingController.myBookings);
router.post('/', requireAuth, bookingController.create);
router.post('/:id/cancel', requireAuth, bookingController.cancel);
router.post('/:id/join', requireAuth, bookingController.join);
router.post('/:id/participants/:user_id/approve', requireAuth, bookingController.approve);
router.post('/:id/participants/:user_id/reject', requireAuth, bookingController.reject);
router.post('/:id/leave', requireAuth, bookingController.leave);

module.exports = router;

