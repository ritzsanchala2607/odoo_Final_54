const slotService = require('../service/slot.service');

async function list(req, res) {
  try {
    const slots = await slotService.listSlots(req.params.court_id);
    return res.json({ slots });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function block(req, res) {
  try {
    const record = await slotService.blockSlot({ ...req.body, created_by: req.user.id });
    return res.status(201).json({ blocked_slot: record });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { list, block };

