const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const { validation } = require('../helper/validation');

router.post('/signup', validation.signup, userController.signup);
router.post('/login', validation.login, userController.login);

module.exports = router;

