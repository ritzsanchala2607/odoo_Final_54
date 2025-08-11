const express = require('express');
const router = express.Router();
const courtController = require('../controller/court.controller');
const { validation } = require('../helper/validation');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', courtController.list);
router.post('/', requireAuth, requireRole('owner', 'admin'), validation.courtCreate, courtController.create);

module.exports = router;

