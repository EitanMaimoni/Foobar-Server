const postService = require('../services/post');


const createPost = async (req, res) => {
    res.json(await postService.createPost(req.body.postOwnerID, req.body.content, req.body.img,
                                          req.body.date, req.body.comments, req.body.likesID))
};

const getPost = async(req,res)=>{
   
    const post = await postService.getPostById(req.params.id)
    if(!post){
        return res.status(404).json({errors:['Post not found']})
    }
    res.json(post)
}

const getPosts = async (req, res) => {
    res.json(await postService.getPosts()); 
}


const updatePost = async(req,res)=>{
    const post = await postService.updatePost(req.body.postOwnerID, req.body.content, req.body.img,
        req.body.date, req.body.comments, req.body.likesID)
        if(!post){
            return res.status(404).json({errors:['Post not found']})
        }
        res.json(post)
} 

const deletePost = async (req,res) =>{
    const post = await postService.deletePost(req.params.id)
    if(!post){
        return res.status(404).json({errors:['Post not found']})
    }
    res.json(post)
}

module.exports = { createPost,updatePost,getPosts,getPost,deletePost}