const { Review } = require('../helper/db.helper');

async function createReview(payload) {
  return Review.create(payload);
}

async function listVenueReviews(venue_id) {
  return Review.findAll({ where: { venue_id }, order: [['created_at', 'DESC']] });
}

module.exports = { createReview, listVenueReviews };

