const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const adminController = require('../controller/admin.controller');

router.get('/stats', requireAuth, requireRole('admin'), adminController.stats);

module.exports = router;


