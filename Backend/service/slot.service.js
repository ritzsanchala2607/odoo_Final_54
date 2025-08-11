const { CourtSlot, BlockedSlot } = require('../helper/db.helper');

async function listSlots(court_id) {
  return CourtSlot.findAll({ where: { court_id }, order: [['start_at', 'ASC']] });
}

async function blockSlot(payload) {
  return BlockedSlot.create(payload);
}

module.exports = { listSlots, blockSlot };

