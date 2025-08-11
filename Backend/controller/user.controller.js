const { validationResult } = require('express-validator');
const userService = require('../service/user.service');
const multer = require('multer');
const path = require('path');

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/avatar/'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

// Avatar upload handler
async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const avatarUrl = `/avatar/${req.file.filename}`;
  return res.json({ avatar_url: avatarUrl });
}

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const user = await userService.signup(req.body);

    if(user === "Email Already Exists"){
      return res.status(400).json({ message: "Email Already Exists" });
    }
    return res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const result = await userService.login(req.body, req, res);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const result = await userService.verifyOtp({ email, otp });
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function logout(req, res) {
  try {
    const result = await userService.logout(req, res);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function checkAuth(req, res) {
  try {
    const result = await userService.checkAuth(req);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function refreshToken(req, res) {
  try {
    const result = await userService.refreshToken(req, res);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await userService.getCurrentUser(req);
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

module.exports = { signup, login, verifyOtp, logout, checkAuth, refreshToken, getCurrentUser, uploadAvatar, upload };

