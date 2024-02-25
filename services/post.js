const  Post = require ('../models/post')
const mongoose = require('mongoose');

const createPost = async (postOwnerID, content, img, date, comments, likesID) => {
    const randomId = new mongoose.Types.ObjectId(); // Generates a new unique ObjectId
    const post = new Post({ _id: randomId, postOwnerID, content, img, date, comments, likesID });
    return await post.save();
};

const getPostById = async (id) => {
    return await Post.findById(id);
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

const deletePost = async (id) =>{
    const post = await getPostById(id)
    if(!post) return Error("No such post")
    post.content = content
    await post.deleteOne();
    return post;
}

module.exports = { createPost , getPosts, getPostById,updatePost }