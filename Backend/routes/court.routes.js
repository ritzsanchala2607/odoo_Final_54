const express = require('express');
const router = express.Router();
const courtController = require('../controller/court.controller');
const { requireAuth, requireRole } = require('../middleware/auth');
const { validation } = require('../helper/validation');

router.get('/', courtController.list);
router.get('/all', courtController.listAll);

// router.post('/', requireAuth, requireRole('owner', 'admin'), courtController.create);
// router.put('/:id', requireAuth, requireRole('owner', 'admin'), courtController.update);
// router.delete('/:id', requireAuth, requireRole('owner', 'admin'), courtController.remove);
router.post('/', requireAuth, requireRole('owner', 'admin'), validation.courtCreate, courtController.create);

router.put('/:id', requireAuth, requireRole('owner', 'admin'), courtController.update);
router.delete('/:id', requireAuth, requireRole('owner', 'admin'), courtController.remove);

// module.exports = router;
// >>>>>>> Stashed changes

module.exports = router;