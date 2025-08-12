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

async function distributions(req, res) {
  try {
    const result = await adminService.getDistributions();
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports.distributions = distributions;

async function users(req, res) {
  try {
    const { page, page_size, q, role, status } = req.query;
    const result = await adminService.listUsers({ page, page_size, query: q, role, status });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function setActive(req, res) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const user = await adminService.setUserActive(id, !!is_active);
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function setRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await adminService.updateUserRole(id, role);
    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports.users = users;
module.exports.setActive = setActive;
module.exports.setRole = setRole;


