const authenticateToken = require('../middleware/authenticateToken');
const postController = require('../controllers/post');
const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/').get(authenticateToken,postController.getFriendsPosts)
router.route('/nickname/:id').get(userController.getUsernickname)
router.route('/profile/:id').get(userController.getUserImage)
router.route('/get').get(authenticateToken, postController.getPosts);
router.route('/like/:id').put(authenticateToken, postController.likePost)
router.route('/:id').get(postController.getPost)
        .patch(postController.updatePost)
router.route('/uploadImage/:id').patch(authenticateToken, postController.updateImage)
router.route('/edit/:id').get(authenticateToken, postController.checkIfAuth)

router.route('/comment/like/:postid/:commentid').put(authenticateToken, postController.likeComment)
router.route('/comment/edit/:postid/:commentname').get(authenticateToken, postController.checkIfAuthComment)
router.route('/comment/edit/:postid/:commentid').patch(authenticateToken, postController.updateComment)
router.route('/comment/:id').post(authenticateToken, postController.addComment)
router.route('/comment/:postid/:commentid').delete(authenticateToken, postController.deleteComment)

router.route('/delete/:id').delete(authenticateToken, postController.deletePost)

module.exports = router;