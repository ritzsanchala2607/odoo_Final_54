const { Venue, VenuePhoto, Amenity, VenueAmenity, User, Court } = require('../helper/db.helper');

async function createVenue(payload) {
  const venue = await Venue.create(payload);
  return venue;
}

async function listVenues({ city, sport_type, page = 1, page_size = 10, status, owner_id }) {
  const where = {};
  if (city) where.city = city;
  if (status) where.status = status;
  if (owner_id) where.owner_id = owner_id;

  const venues = await Venue.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'full_name', 'email']
      },
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sport_type', 'price_per_hour', 'price_per_person', 'capacity', 'is_active'],
        required: false // LEFT JOIN so venues with 0 courts still appear
      }
    ],
    limit: page_size,
    offset: (page - 1) * page_size,
    order: [['created_at', 'DESC']],
  });

  const rows = venues.rows.map(v => {
    const venue = v.toJSON();
    const allCourts = venue.courts || [];
    const activeCourts = allCourts.filter(c => c.is_active);

    const totalCourtsAll = allCourts.length;
    const totalCourtsActive = activeCourts.length;

    const capacityAll = allCourts.reduce((s, c) => s + (c.capacity || 0), 0);
    const capacityActive = activeCourts.reduce((s, c) => s + (c.capacity || 0), 0);

    const avgPriceActive =
      totalCourtsActive > 0
        ? (activeCourts.reduce((s, c) => s + parseFloat(c.price_per_hour || 0), 0) / totalCourtsActive).toFixed(2)
        : 0;

    const courtTypes = [...new Set(activeCourts.map(c => c.sport_type))];

    venue.capacityInfo = {
      totalCourtsActive,
      totalCourtsAll,
      totalCapacityActive: capacityActive,
      totalCapacityAll: capacityAll,
      courtTypes,
      averagePrice: avgPriceActive
    };
    return venue;
  });

  return { count: venues.count, rows };
}

async function listVenuesAll() {
  const venues = await Venue.findAll({
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'full_name', 'email']
      },
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sport_type', 'price_per_hour', 'price_per_person', 'capacity', 'is_active'],
        required: false // LEFT JOIN so venues with 0 courts still appear
      }
    ]
  });
  return venues;
}

async function getVenueWithCourts(venueId) {
  const venue = await Venue.findByPk(venueId, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'full_name', 'email']
      },
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sport_type', 'price_per_hour', 'price_per_person', 'capacity', 'is_active', 'allow_per_hour', 'allow_per_person', 'created_at'],
        required: false
      }
    ]
  });
  if (!venue) throw new Error('Venue not found');

  const v = venue.toJSON();
  const allCourts = v.courts || [];
  const activeCourts = allCourts.filter(c => c.is_active);

  v.capacityInfo = {
    totalCourtsActive: activeCourts.length,
    totalCourtsAll: allCourts.length,
    totalCapacityActive: activeCourts.reduce((s, c) => s + (c.capacity || 0), 0),
    totalCapacityAll: allCourts.reduce((s, c) => s + (c.capacity || 0), 0),
    courtTypes: [...new Set(activeCourts.map(c => c.sport_type))],
    averagePrice:
      activeCourts.length > 0
        ? (activeCourts.reduce((s, c) => s + parseFloat(c.price_per_hour || 0), 0) / activeCourts.length).toFixed(2)
        : 0
  };

  return v;
}

async function approveVenue(venueId, { status, approved_by, decision_notes }) {
  const venue = await Venue.findByPk(venueId);
  if (!venue) {
    throw new Error('Venue not found');
  }
  
  venue.status = status;
  venue.approved_by = approved_by;
  venue.approved_at = new Date();
  
  await venue.save();
  return venue;
}


async function listAllVenues() {
  return Venue.findAll({
    include: [{
      model: VenuePhoto,
      as: 'photos',
      attributes: ['url', 'is_cover'],
      required: false
    }]
  });
}

module.exports = {
  listAllVenues, createVenue, listVenues, approveVenue, getVenueWithCourts };

