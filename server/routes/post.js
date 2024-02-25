const postController = require('../controllers/post');
const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();
router.route('/nickname/:name').get(userController.getUsernickname)

router.route('/profile/:name').get(userController.getUserImage)
router.route('/get').get(postController.getPosts)

router.route('/add').post(postController.createPost);

router.route('/:id').get(postController.getPost)
        .patch(postController.updatePost)
        .delete(postController.deletePost)

module.exports = router;
/*
router.route('/').get(postController.getPost);
router.route('/').get(postController.getUserPosts);
router.route('/updatepost/:id').put(postController.updatePost);
router.route('/deletepost/:id').delete(postController.deletePost);
router.route('/likepost/:postId').get(postController.likePost);
router.route('/disLikePost/:id').get(postController.disLikePost);
router.route('/timelinepost').get(postController.getTimelinePosts);

*/


