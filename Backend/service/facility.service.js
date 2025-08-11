const { FacilityApplication } = require('../helper/db.helper');

async function apply(payload) {
  return FacilityApplication.create(payload);
}

async function listApplications({ status }) {
  const where = {};
  if (status) where.status = status;
  return FacilityApplication.findAll({ where, order: [['submitted_at', 'DESC']] });
}

async function decide(id, { decided_by, status, decision_notes }) {
  const app = await FacilityApplication.findByPk(id);
  if (!app) throw new Error('Application not found');
  app.decided_by = decided_by;
  app.status = status;
  app.decided_at = new Date();
  app.decision_notes = decision_notes;
  await app.save();
  return app;
}

module.exports = { apply, listApplications, decide };

