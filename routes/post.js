const authenticateToken = require('../middleware/authenticateToken');
const postController = require('../controllers/post');
const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();
router.route('/nickname/:id').get(userController.getUsernickname)

router.route('/profile/:id').get(userController.getUserImage)
router.route('/get').get(postController.getPosts)

router.route('/add').post(authenticateToken, postController.createPost);

router.route('/like/:id').put(authenticateToken, postController.likePost)

router.route('/:id').get(postController.getPost)
        .patch(postController.updatePost)

router.route('/delete/:id').delete(authenticateToken, postController.deletePost)

router.route('/comment/:id').post(authenticateToken, postController.addComment)

module.exports = router;