const notificationService = require('../service/notification.service');

async function my(req, res) {
  try {
    const list = await notificationService.listMy(req.user.id);
    return res.json({ notifications: list });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { my };

