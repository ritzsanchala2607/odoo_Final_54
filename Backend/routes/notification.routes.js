const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/me', requireAuth, notificationController.my);

module.exports = router;

