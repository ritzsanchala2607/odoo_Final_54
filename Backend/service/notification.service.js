const { Notification } = require('../helper/db.helper');

async function listMy(user_id) {
  return Notification.findAll({ where: { user_id }, order: [['created_at', 'DESC']] });
}

module.exports = { listMy };

