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
    console.log(Post.find({}))
    
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
    const newComment = {commentOwnerID, content, date, likes , _id };

    await Post.updateOne(
        { _id: post._id },
        { $push: { comments: newComment } }
    );

    return newComment;
};

const deleteComment = async (postId, commentId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return { status: 404, error: 'Post not found' };
        }
        // Find the index of the comment to be deleted
        const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
        // If comment not found or user is not authorized to delete it
        if (commentIndex === -1 || post.comments[commentIndex].commentOwnerID !== userId) {
            return { status: 404, error: 'Comment not found or unauthorized' };
        }
        // Remove the comment from the array
        post.comments.splice(commentIndex, 1);
        await post.save();
        return { status: 200, message: 'Comment deleted successfully', comments: post.comments };
    } catch (error) {
        console.error('Error deleting comment:', error);
        return { status: 500, error: 'Internal server error' };
    }
};



module.exports = { createPost, getPosts, getPostById, updatePost, likePost, deletePost, addComment,deleteComment }