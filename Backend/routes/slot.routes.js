const express = require('express');
const router = express.Router();
const slotController = require('../controller/slot.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/:court_id', slotController.list);
router.post('/block', requireAuth, requireRole('owner', 'admin'), slotController.block);

module.exports = router;

