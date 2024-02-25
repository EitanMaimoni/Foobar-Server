const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();
router.route('/').post(userController.createUser);
router.route('/login').post(userController.authUser);

module.exports = router;