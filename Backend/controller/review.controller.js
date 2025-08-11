const { validationResult } = require('express-validator');
const reviewService = require('../service/review.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const review = await reviewService.createReview({ ...req.body, user_id: req.user.id });
    return res.status(201).json({ review });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function listForVenue(req, res) {
  try {
    const reviews = await reviewService.listVenueReviews(req.params.venue_id);
    return res.json({ reviews });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, listForVenue };

