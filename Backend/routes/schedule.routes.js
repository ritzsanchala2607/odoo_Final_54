const express = require('express');
const router = express.Router();
const scheduleController = require('../controller/schedule.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/:court_id', scheduleController.list);
router.post('/', requireAuth, requireRole('owner', 'admin'), scheduleController.create);

module.exports = router;

