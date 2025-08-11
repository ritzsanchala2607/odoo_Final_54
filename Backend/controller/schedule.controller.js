const { validationResult } = require('express-validator');
const scheduleService = require('../service/schedule.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const s = await scheduleService.createSchedule(req.body);
    return res.status(201).json({ schedule: s });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function list(req, res) {
  try {
    const list = await scheduleService.listSchedules(req.params.court_id);
    return res.json({ schedules: list });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { create, list };

