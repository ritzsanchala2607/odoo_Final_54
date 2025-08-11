const express = require('express');
const router = express.Router();
const venueController = require('../controller/venue.controller');
const { validation } = require('../helper/validation');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', venueController.list);
router.post('/', requireAuth, requireRole('owner', 'admin'), validation.venueCreate, venueController.create);

module.exports = router;

