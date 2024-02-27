const userController = require('../controllers/user');
const authenticateToken = require('../middleware/authenticateToken');

const express = require('express');
var router = express.Router();
router.route('/').post(userController.createUser);
router.route('/login').post(userController.authUser);
router.route('/getID').post(authenticateToken, userController.getUserID);
router.route('/:id').post(authenticateToken, userController.getInfo);

module.exports = router;