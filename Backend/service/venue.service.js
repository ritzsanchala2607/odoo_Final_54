const { Venue, VenuePhoto, Amenity, VenueAmenity, User } = require('../helper/db.helper');
const { Op } = require('sequelize');

// Create a new venue
async function createVenue(payload) {
  const venue = await Venue.create({
    ...payload,
    status: 'pending', // Default status for new venues
    created_at: new Date(),
    updated_at: new Date()
  });
  return venue;
}

// List venues with filtering and pagination
async function listVenues({ 
  city, 
  status, 
  owner_id, 
  page = 1, 
  page_size = 10,
  min_rating,
  max_price
}) {
  const where = {};
  
  if (city) where.city = { [Op.iLike]: `%${city}%` };
  if (status) where.status = status;
  if (owner_id) where.owner_id = owner_id;
  if (min_rating) where.rating_avg = { [Op.gte]: parseFloat(min_rating) };
  if (max_price) where.starting_price = { [Op.lte]: parseFloat(max_price) };

  const { count, rows } = await Venue.findAndCountAll({
    where,
    limit: parseInt(page_size),
    offset: (parseInt(page) - 1) * parseInt(page_size),
    order: [['created_at', 'DESC']],
    include: [
      { model: VenuePhoto, as: 'photos', limit: 1 },
      { model: Amenity, as: 'amenities' }
    ]
  });

  return {
    total: count,
    page: parseInt(page),
    page_size: parseInt(page_size),
    total_pages: Math.ceil(count / page_size),
    data: rows
  };
}

// Get a single venue by ID with related data
async function getVenueById(id) {
  return await Venue.findByPk(id, {
    include: [
      { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
      { model: VenuePhoto, as: 'photos' },
      { model: Amenity, as: 'amenities' }
    ]
  });
}

// Update a venue
async function updateVenue(id, updates, user) {
  const venue = await Venue.findByPk(id);
  
  if (!venue) return null;
  
  // Only owner or admin can update
  if (venue.owner_id !== user.id && user.role !== 'admin') {
    throw new Error('Not authorized to update this venue');
  }

  // Don't allow updating owner_id or approved_by
  const { owner_id, approved_by, ...safeUpdates } = updates;
  
  return await venue.update({
    ...safeUpdates,
    updated_at: new Date()
  });
}

// Delete a venue
async function deleteVenue(id, user) {
  const venue = await Venue.findByPk(id);
  
  if (!venue) return false;
  
  // Only owner or admin can delete
  if (venue.owner_id !== user.id && user.role !== 'admin') {
    return false;
  }
  
  await venue.destroy();
  return true;
}

// Approve a venue (admin only)
async function approveVenue(id, adminId) {
  return await Venue.update(
    { 
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date()
    },
    { 
      where: { id },
      returning: true,
      plain: true 
    }
  );
}

// Get venues by owner
async function getVenuesByOwner(ownerId) {
  return await Venue.findAll({
    where: { owner_id: ownerId },
    order: [['created_at', 'DESC']],
    include: [
      { model: VenuePhoto, as: 'photos', limit: 1 },
      { 
        model: Amenity, 
        as: 'amenities',
        through: { attributes: [] } // Exclude join table attributes
      }
    ]
  });
}

// Update venue rating based on reviews
async function updateVenueRating(venueId) {
  const venue = await Venue.findByPk(venueId, {
    include: [
      {
        model: Review,
        as: 'reviews',
        attributes: ['rating'],
        where: { status: 'approved' }
      }
    ]
  });

  if (!venue) return null;

  const ratings = venue.reviews.map(r => r.rating);
  const avgRating = ratings.length > 0 
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : 0;

  return await venue.update({ rating_avg: avgRating });
}

module.exports = { 
  createVenue, 
  listVenues, 
  getVenueById, 
  updateVenue, 
  deleteVenue, 
  approveVenue, 
  getVenuesByOwner,
  updateVenueRating 
};

