const { Venue, VenuePhoto, Amenity, VenueAmenity } = require('../helper/db.helper');

async function createVenue(payload) {
  const venue = await Venue.create(payload);
  return venue;
}

async function listVenues({ city, sport_type, page = 1, page_size = 10 }) {
  const where = {};
  if (city) where.city = city;
  const venues = await Venue.findAndCountAll({
    where,
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  });
  return venues;
}

module.exports = { createVenue, listVenues };

