const express = require('express');
const router = express.Router();
const facilityController = require('../controller/facility.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/applications', requireAuth, requireRole('admin'), facilityController.list);
router.post('/applications', requireAuth, requireRole('owner'), facilityController.apply);
router.post('/applications/:id/decide', requireAuth, requireRole('admin'), facilityController.decide);

module.exports = router;

