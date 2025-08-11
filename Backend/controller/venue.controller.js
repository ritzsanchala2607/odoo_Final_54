const { validationResult } = require('express-validator');
const venueService = require('../service/venue.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const venue = await venueService.createVenue({ ...req.body, owner_id: req.user.id });
    return res.status(201).json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const result = await venueService.listVenues(req.query);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function get(req, res) {
  try {
    const venue = await venueService.getVenueWithCourts(req.params.id);
    return res.json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function approve(req, res) {
  try {
    const venue = await venueService.approveVenue(req.params.id, {
      status: req.body.status,
      approved_by: req.user.id,
      decision_notes: req.body.decision_notes
    });
    return res.json({ venue });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, list, get, approve };

