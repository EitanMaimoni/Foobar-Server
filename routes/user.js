const userController = require('../controllers/user');
const authenticateToken = require('../middleware/authenticateToken');

const express = require('express');
var router = express.Router();
router.route('/').post(userController.createUser);
router.route('/login').post(userController.authUser);
router.route('/getID').post(authenticateToken, userController.getUserID);
router.route('/:id/posts').get(authenticateToken, userController.getPosts);
router.route('/:id').get(authenticateToken, userController.getInfo);
router.route('/:id').delete(authenticateToken, userController.deleteUser);

module.exports = router;