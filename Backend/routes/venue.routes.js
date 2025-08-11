const express = require('express');
const router = express.Router();
const venueController = require('../controller/venue.controller');
const { validation } = require('../helper/validation');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', venueController.list);
// <<<<<<< krish
// router.post('/', requireAuth, requireRole('owner', 'admin'), validation.venueCreate, venueController.create);
router.post('/',venueController.create);
// =======
router.get('/:id', venueController.get);
router.post('/', requireAuth, requireRole('owner', 'admin'), validation.venueCreate, venueController.create);
router.post('/:id/approve', requireAuth, requireRole('admin'), venueController.approve);
// >>>>>>> main

module.exports = router;

