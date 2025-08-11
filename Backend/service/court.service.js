const { Court } = require('../helper/db.helper');

async function createCourt(payload) {
  return Court.create(payload);
}

async function listCourts({ venue_id }) {
  return Court.findAll({ where: { venue_id } });
}

module.exports = { createCourt, listCourts };

