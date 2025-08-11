const express = require('express');
const router = express.Router();
const courtController = require('../controller/court.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', courtController.list);
router.get('/all', courtController.listAll);

router.post('/', requireAuth, requireRole('owner', 'admin'), courtController.create);
router.put('/:id', requireAuth, requireRole('owner', 'admin'), courtController.update);
router.delete('/:id', requireAuth, requireRole('owner', 'admin'), courtController.remove);

module.exports = router;