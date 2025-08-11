const { CourtSchedule } = require('../helper/db.helper');

async function createSchedule(payload) {
  return CourtSchedule.create(payload);
}

async function listSchedules(court_id) {
  return CourtSchedule.findAll({ where: { court_id } });
}

module.exports = { createSchedule, listSchedules };

