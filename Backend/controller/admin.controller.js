const adminService = require('../service/admin.service');

async function stats(req, res) {
  try {
    const result = await adminService.getPlatformStats();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { stats };


