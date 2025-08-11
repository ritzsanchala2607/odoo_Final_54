const { Court, Venue } = require('../helper/db.helper');

async function createCourt(payload) {
  return Court.create(payload);
}

async function listCourts({ venue_id, owner_id }) {
  const where = {};
  if (venue_id) where.venue_id = venue_id;
  
  const include = [
    {
      model: Venue,
      as: 'venue',
      attributes: ['id', 'name', 'city'],
      where: owner_id ? { owner_id } : undefined
    }
  ];

  return Court.findAll({ 
    where,
    include,
    order: [['created_at', 'ASC']]
  });
}

async function getCourt(courtId) {
  const court = await Court.findByPk(courtId);
  if (!court) {
    throw new Error('Court not found');
  }
  return court;
}

async function updateCourt(courtId, payload) {
  const court = await Court.findByPk(courtId);
  if (!court) {
    throw new Error('Court not found');
  }
  
  await court.update(payload);
  return court;
}

async function deleteCourt(courtId) {
  const court = await Court.findByPk(courtId);
  if (!court) {
    throw new Error('Court not found');
  }
  
  // Soft delete by setting is_active to false
  await court.update({ is_active: false });
  return court;
}

// <<<<<<< krish
async function listAllCourts() {
  return Court.findAll();
}

// module.exports = { createCourt, listCourts  , listAllCourts};
// =======
module.exports = { createCourt, listCourts, getCourt, updateCourt, deleteCourt , listAllCourts};
// >>>>>>> main

