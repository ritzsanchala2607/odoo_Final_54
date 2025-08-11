const { validationResult } = require('express-validator');
const userService = require('../service/user.service');

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await userService.signup(req.body);
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const result = await userService.login(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { signup, login };

