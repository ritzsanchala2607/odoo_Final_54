const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const { validation } = require('../helper/validation');

router.post('/register', validation.signup, userController.signup);
router.post('/login', validation.login, userController.login);
router.post('/verify-otp', userController.verifyOtp);
router.post('/logout', userController.logout);
router.get('/check-auth', userController.checkAuth);
router.post('/refresh-token', userController.refreshToken);
router.get('/me', userController.getCurrentUser);
router.post('/upload-avatar', userController.upload.single('avatar'), userController.uploadAvatar);

module.exports = router;

