const express = require('express');
const router = express.Router();
const courtController = require('../controller/court.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', courtController.list);
// <<<<<<< krish
router.get('/all', courtController.listAll);
router.post('/', requireAuth, requireRole('owner', 'admin'), validation.courtCreate, courtController.create);
// =======
router.get('/:id', courtController.get);
router.post('/', requireAuth, requireRole('owner', 'admin'), courtController.create);
router.put('/:id', requireAuth, requireRole('owner', 'admin'), courtController.update);
router.delete('/:id', requireAuth, requireRole('owner', 'admin'), courtController.remove);
// >>>>>>> main

module.exports = router;

