const authenticateToken = require('../middleware/authenticateToken');
const postController = require('../controllers/post');
const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/:id/posts/:pid').delete(authenticateToken, postController.deletePost)

module.exports = router;