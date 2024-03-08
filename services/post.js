const Post = require('../models/post')
const User = require('../models/user')
const mongoose = require('mongoose');
//this function is used to create a post
const createPost = async (postOwnerID, content, img, date, comments, likesID) => {
    // If the image havn't a prefix, add it
    if (img && !img.startsWith("data")) {
        img = `data:image/png;base64,${img}`
    }
    // Create a new post
    const randomId = new mongoose.Types.ObjectId();
    const post = new Post({ _id: randomId, postOwnerID, content, img, date, comments, likesID });
    const user = await User.findById(postOwnerID);
    // Add the post to the user's posts
    user.posts.push(randomId);
    await user.save();
    return await post.save();
};

const getPostById = async (id) => {
    return await Post.findById(id);
}
//this function is used to get all the posts
const getPosts = async () => {    
     const posts = await Post.find({});
     // for each comment in the post, get the user's nickname and profile picture
     for (let post of posts) {
         const postOwner = await User.findById(post.postOwnerID);
         post.profilePic = postOwner.img;
         post.nick = postOwner.nick;
     }
}
//this function is used to delete a postq
const deletePost = async (post) => {
    return await post.deleteOne();
}

const likePost = async (postId, userId) => {
    // Get the post by its ID
    const post = await getPostById(postId)
    if (!post) return null
    if (post.likesID.includes(userId)) {
        post.likesID = post.likesID.filter(id => id !== userId)
    } else {
        // Add the user's ID to the post's likes
        post.likesID.push(userId)
    }
    // Save the updated post
    await post.save();
    return post;
}
//this function is used to update a post
const updatePost = async (req, res) => {
    // Get the post by its ID
    const post = await Post.findById(req.params.pid)
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] })
    }
    // Get the user by their ID
    const user = await User.findById(req.userId)
    if(!user){
        return res.status(404).json({ errors: ['User not found'] })
    }
    // If the user is not the post owner, return a 401 error
    //get the content and the image from the request
    const content = req.body.content;
    const img = req.body.image;
    // If the image havn't a prefix, add it
    if (img && !img.startsWith("data")) {
        post.img = `data:image/png;base64,${img}`;
    } else {
        post.img = img;
    }
    // Update the post's content
    post.content = content
    await post.save();
    return post
}
const updateImage = async (post, img) => {
    post.img = img
    await post.save();
    return post
}
//this function is used to get the posts of the friends and five other posts
const getFriendsPosts = async (userId) => {
    // Get the user by their ID
    const user = await User.findById(userId);
    // Get the posts of the user's friends
    const friendPosts = await Post.find({ postOwnerID: { $in: user.friends } })
                                  .sort({ date: -1 })
                                  .limit(20);

    const nonFriendPosts = await Post.find({ postOwnerID: { $nin: user.friends } })
                                     .sort({ date: -1 })
                                     .limit(5);
    // Combine the posts and sort them by date
    let combinedPosts = [...friendPosts, ...nonFriendPosts];
    combinedPosts = combinedPosts.sort((a, b) => b.date - a.date);
    // Add the profile picture and nickname to each post
    const postsWithProfile = await Promise.all(combinedPosts.map(async (post) => {
        const postOwner = await User.findById(post.postOwnerID);
        return {
            // Spread the post object
            // Add the profile picture and nickname
            ...post.toObject(), 
            profilePic: postOwner.img,
            nick: postOwner.nick
        };
    }));

    return postsWithProfile;
};
//this function is used to add a comment to a post
const addComment = async (commentOwnerID, content, post) => {
    const randomId = new mongoose.Types.ObjectId();
    const date = new Date();
    const likes = [];
    const owner = await User.findById(commentOwnerID)
    const ownerNick = owner.nick;
    const ownerPic = owner.img;
    // Create a new comment object and add it to the post
    const newComment = { _id: randomId,nickname: ownerNick,profilePic:ownerPic , commentOwnerID, content, date, likes };
    await Post.updateOne(
        { _id: post._id },
        { $push: { comments: newComment } }
    );

    // Fetch the updated post to get the latest comments
    const updatedPost = await Post.findById(post._id);
    return updatedPost.comments;
};
//this function is used to update a comment
const updateComment = async (commentId,post, content) => {
    if (!post) return null
    // Find the comment by its ID
    const commentIndex = post.comments.find(comment => comment._id == commentId);
    if (!commentIndex) return null
    // Update the comment's content
    commentIndex.content = content
    await post.save();
    return post.comments
}
//this function is used to like a comment
const likeComment = async (postId, commentId, userId) => {
    // Get the post by its ID
    const post = await getPostById(postId)
    if (!post) return null
    const comment = post.comments.find(comment => comment._id == commentId)
    if (!comment) return null
    // If the user has already liked the comment, remove their ID from the likes
    if (comment.likes.includes(userId)) {
        comment.likes = comment.likes.filter(id => id !== userId)
    } else {
        // Add the user's ID to the comment's likes
        comment.likes.push(userId)
    }
    await post.save();
    return comment.likes;
}
//this function is used to delete a comment
const deleteComment = async (postId, commentId, userId) => {
    try {
        // Get the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            return { status: 404, error: 'Post not found' };
        }
        // Find the comment by its ID
        const commentIndex = post.comments.find(comment => comment._id == commentId);
        if (!commentIndex) {
            return { status: 404, error: 'Comment not found' };
        }
        if (commentIndex.commentOwnerID != userId) {
            return { status: 403, error: 'Unauthorized' };
        }
        // Remove the comment from the post
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();
        return { status: 200, post: post }; 

    } catch (error) {
        console.error('Error deleting comment:', error);
        return { status: 500, error: 'Internal server error' };
    }
};
//this function is used to check if the user is authorized to perform an action
const checkIfAuth = async (req, res) => {
    // Get the post by its ID
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ errors: ['User not found'] });
    }
    const post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] })
    }
    // If the user is not the post owner, return a 401 error
    if (post.postOwnerID != req.userId) {
        return res.status(401).json({ errors: ['Unauthorized'] })
    }
    // Return the post
    return (res.json(post))
}
module.exports = { createPost, getPosts, getPostById, updatePost, likePost, deletePost, updateImage,
     addComment,deleteComment ,updateComment,likeComment, getFriendsPosts ,checkIfAuth}