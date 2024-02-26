const  Post = require ('../models/post')
const mongoose = require('mongoose');

const createPost = async (postOwnerID, content, img, date, comments, likesID) => {
    const randomId = new mongoose.Types.ObjectId(); // Generates a new unique ObjectId
    const post = new Post({ _id: randomId, postOwnerID, content, img, date, comments, likesID });
    return await post.save();
};

const getPostById = async (id) => {
    console.log("iddddddddddd",id)
    const postaaa= await Post.findById(id);
    console.log(postaaa)
    return postaaa;
}

const getPosts = async () => {
    return await Post.find({}); 
}

const updatePost = async(id,content) => {
    const post = await getPostById(id)
    if(!post) return null
        post.content = content
        await post.save();
        return post
}

const deletePost = async (post) =>{
    return  await post.deleteOne();
}

const likePost = async (postId, userId)=>{
    const post = await getPostById(postId)
    if(!post) return null
    if(post.likesID.includes(userId)){
        post.likesID = post.likesID.filter(id => id !== userId)
    }else{
        post.likesID.push(userId)
    }
    await post.save();
    return post;
}
const addComment = async (commentOwnerId, commentContent, post) => {
    const date = new Date().toISOString();
    const likesID = [];
    post.comments.push({ commentOwnerId,commentContent, date, likesID });
    return await post.save();
};

module.exports = { createPost , getPosts, getPostById,updatePost,likePost,deletePost,addComment}