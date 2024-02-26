const Post = require('../models/post')
const User = require('../models/user')
const mongoose = require('mongoose');

const createPost = async (postOwnerID, content, img, date, comments, likesID) => {
    const randomId = new mongoose.Types.ObjectId();
    const post = new Post({ _id: randomId, postOwnerID, content, img, date, comments, likesID });
    return await post.save();
};

const getPostById = async (id) => {
    return await Post.findById(id);
}

const getPosts = async () => {
    return await Post.find({});
}

const updatePost = async (post, content) => {
    if (!post) return null
    post.content = content
    console.log(post.content)
    await post.save();
    return post
}

const deletePost = async (post) => {
    return await post.deleteOne();
}

const likePost = async (postId, userId) => {
    const post = await getPostById(postId)
    if (!post) return null
    if (post.likesID.includes(userId)) {
        post.likesID = post.likesID.filter(id => id !== userId)
    } else {
        post.likesID.push(userId)
    }
    await post.save();
    return post;
}
const addComment = async (commentOwnerID, content, post) => {
    const _id = new mongoose.Types.ObjectId();
    const date = new Date();
    const likes = [];
    const newComment = { _id, commentOwnerID, content, date, likes };

    await Post.updateOne(
        { _id: post._id },
        { $push: { comments: newComment } }
    );

    return newComment;
};




const getUsernickname = async (id) => {
    const user = await User.findById(id);
    return user.nickname;
}

module.exports = { createPost, getPosts, getPostById, updatePost, likePost, deletePost, addComment }