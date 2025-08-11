const express = require('express');
const router = express.Router();
const reviewController = require('../controller/review.controller');
const { validation } = require('../helper/validation');
const { requireAuth } = require('../middleware/auth');

router.get('/venue/:venue_id', reviewController.listForVenue);
router.post('/', requireAuth, validation.reviewCreate, reviewController.create);

module.exports = router;

