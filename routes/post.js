// Import required controllers and middleware
const authenticateToken = require('../middleware/authenticateToken');
const postController = require('../controllers/post');
const userController = require('../controllers/user');

// Import express and create a router instance
const express = require('express');
var router = express.Router();

router.route('/').get(authenticateToken,postController.getFriendsPosts)
router.route('/nickname/:id').get(authenticateToken, userController.getUsernickname)
router.route('/profile/:id').get(authenticateToken, userController.getUserImage)
router.route('/like/:id').put(authenticateToken, postController.likePost)

router.route('/edit/:id').get(authenticateToken, postController.checkIfAuth)

router.route('/comment/like/:postid/:commentid').put(authenticateToken, postController.likeComment)
router.route('/comment/edit/:postid/:commentname').get(authenticateToken, postController.checkIfAuthComment)
router.route('/comment/edit/:postid/:commentid').patch(authenticateToken, postController.updateComment)
router.route('/comment/:id').post(authenticateToken, postController.addComment)
router.route('/comment/:postid/:commentid').delete(authenticateToken, postController.deleteComment)

module.exports = router;