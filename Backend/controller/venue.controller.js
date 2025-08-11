const { createVenue, listVenues, getVenueById, updateVenue, deleteVenue, approveVenue, getVenuesByOwner } = require('../service/venue.service');
const { validationResult } = require('express-validator');

// Create a new venue
exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const venue = await createVenue({
      ...req.body,
      owner_id: req.user.id // Set the owner_id from the authenticated user
    });
    
    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// List all venues
exports.list = async (req, res, next) => {
  try {
    const venues = await listVenues({
      ...req.query,
      owner_id: req.user.role === 'owner' ? req.user.id : undefined
    });
    
    res.json({
      success: true,
      ...venues
    });
  } catch (error) {
    next(error);
  }
};

// Get venues by owner
exports.getByOwner = async (req, res, next) => {
  try {
    const venues = await getVenuesByOwner(req.user.id);
    res.json({
      success: true,
      data: venues
    });
  } catch (error) {
    next(error);
  }
};

// Get venue by ID
exports.getById = async (req, res, next) => {
  try {
    const venue = await getVenueById(req.params.id);
    if (!venue) {
      return res.status(404).json({
        success: false,
        message: 'Venue not found'
      });
    }
    
    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// Update venue
exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const venue = await updateVenue(
      req.params.id,
      req.body,
      req.user
    );
    
    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};

// Delete venue
exports.remove = async (req, res, next) => {
  try {
    await deleteVenue(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Venue deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Approve venue (admin only)
exports.approve = async (req, res, next) => {
  try {
    const venue = await approveVenue(req.params.id, req.user.id);
    res.json({
      success: true,
      data: venue
    });
  } catch (error) {
    next(error);
  }
};