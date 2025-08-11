const { body, param, query } = require('express-validator');

const validation = {
  signup: [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').isString().notEmpty(),
    body('role').isIn(['user', 'owner', 'admin']),
  ],
  login: [
    body('email').isEmail(),
    body('password').isString().notEmpty(),
  ],
  venueCreate: [
    body('name').isString().notEmpty(),
    body('slug').isString().notEmpty(),
  ],
  courtCreate: [
    body('venue_id').isUUID(),
    body('name').isString().notEmpty(),
    body('sport_type').isString().notEmpty(),
    body('price_per_hour').isNumeric(),
  ],
  reviewCreate: [
    body('venue_id').isUUID(),
    body('rating').isInt({ min: 1, max: 5 }),
  ],
};

module.exports = { validation, body, param, query };

