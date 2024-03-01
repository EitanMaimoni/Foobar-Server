const userController = require('../controllers/user');
const authenticateToken = require('../middleware/authenticateToken');

const express = require('express');
var router = express.Router();
router.route('/').post(userController.createUser);
router.route('/login').post(userController.authUser);
router.route('/getID').post(authenticateToken, userController.getUserID);
router.route('/:id/posts').get(authenticateToken, userController.getPosts);
router.route('/req').get(authenticateToken, userController.getFriendsRequest);
router.route('/:id').get(authenticateToken, userController.getInfo);

router.route('/:id').delete(authenticateToken, userController.deleteUser);
router.route('/:id/friends').post(authenticateToken, userController.SendFriendShipRequest)
.get(authenticateToken, userController.getFriends).delete(authenticateToken, userController.deleteRequest);
router.route('/:id/friends/:fid').patch(authenticateToken, userController.acceptFriendShipRequest)
.delete(authenticateToken, userController.deleteFriend);


module.exports = router;