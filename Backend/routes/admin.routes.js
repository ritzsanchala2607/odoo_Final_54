const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const adminController = require('../controller/admin.controller');

router.get('/stats', requireAuth, requireRole('admin'), adminController.stats);
router.get('/distributions', requireAuth, requireRole('admin'), adminController.distributions);
router.get('/users', requireAuth, requireRole('admin'), adminController.users);
router.post('/users/:id/active', requireAuth, requireRole('admin'), adminController.setActive);
router.post('/users/:id/role', requireAuth, requireRole('admin'), adminController.setRole);

module.exports = router;


