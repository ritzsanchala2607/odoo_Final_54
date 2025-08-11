const { validationResult } = require('express-validator');
const facilityService = require('../service/facility.service');

async function apply(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const record = await facilityService.apply({ ...req.body, owner_id: req.user.id });
    return res.status(201).json({ application: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const list = await facilityService.listApplications(req.query);
    return res.json({ applications: list });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function decide(req, res) {
  try {
    const app = await facilityService.decide(req.params.id, { ...req.body, decided_by: req.user.id });
    return res.json({ application: app });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { apply, list, decide };

