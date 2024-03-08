// Import required controllers and middleware
const userController = require('../controllers/user');
const postController = require('../controllers/post');
const authenticateToken = require('../middleware/authenticateToken');

// Import express and create a router instance
const express = require('express');
var router = express.Router();
router.route('/').post(userController.createUser);
router.route('/login').post(userController.authUser);
router.route('/getID').post(authenticateToken, userController.getUserID);
router.route('/:id/posts').get(authenticateToken, userController.getPosts)
.post(authenticateToken, postController.createPost);
router.route('/req').get(authenticateToken, userController.getFriendsRequest);
router.route('/:id').get(authenticateToken, userController.getInfo);    
router.route('/:id').put(authenticateToken, userController.updateUser);

router.route('/:id/posts/:pid').delete(authenticateToken, postController.deletePost)
.patch(authenticateToken, postController.updatePost);
router.route('/:id').delete(authenticateToken, userController.deleteUser);
router.route('/:id/friends').post(authenticateToken, userController.SendFriendShipRequest)
.get(authenticateToken, userController.getFriends);
router.route('/:id/friends/:fid').patch(authenticateToken, userController.acceptFriendShipRequest)
.delete(authenticateToken, userController.deleteFriend);

module.exports = router;