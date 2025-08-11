const { validationResult } = require('express-validator');
const courtService = require('../service/court.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const court = await courtService.createCourt(req.body);
    return res.status(201).json({ court });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const courts = await courtService.listCourts(req.query);
    return res.json({ courts });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function listAll(req, res) {
  try {
    const courts = await courtService.listAllCourts();
    return res.json({ courts });
  } catch(e) {
    console.log(e);
    return res.status(400).json({ message: e.message });
  }
}

async function get(req, res) {
  try {
    const court = await courtService.getCourt(req.params.id);
    return res.json({ court });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}


async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const court = await courtService.updateCourt(req.params.id, req.body);
    return res.json({ court });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const court = await courtService.deleteCourt(req.params.id);
    return res.json({ message: 'Court deleted successfully', court });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, list, get, update, remove, listAll };

