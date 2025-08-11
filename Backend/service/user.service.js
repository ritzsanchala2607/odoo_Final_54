const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../helper/db.helper');

async function signup({ email, password, full_name, role, avatar_url }) {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error('Email already in use');
  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password_hash, full_name, role, avatar_url, is_active: true, otp_verified: false });
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  return { user, token };
}

module.exports = { signup, login };

