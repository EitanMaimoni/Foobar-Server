const postService = require('../services/post');

const createPost = async (req, res) => {
    // Use the userId from the request, set by the middleware
    const postOwnerID = req.userId; 
    const { content, img, date, comments, likesID } = req.body;

    try {
        const post = await postService.createPost(postOwnerID, content, img, date, comments, likesID);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};
const likePost = async (req, res) => {
    const post = await postService.likePost(req.params.id, req.userId);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    res.json(post.likesID.length);
}

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
    const post = await postService.getPostById(req.params.id)
    if(!post){
        return res.status(404).json({errors:['Post not found']})
    }
    if(post.postOwnerID != req.userId){
        return res.status(401).json({errors:['Unauthorized']})
    }

    const updatedPost = await postService.updatePost(post,req.body.content)
    if(!updatedPost){
        return res.status(500).json({errors:['Internal server error']})
    }
    res.json(updatedPost)
    
} 
const checkIfAuth = async(req,res)=>{
    const post = await postService.getPostById(req.params.id)
    if(!post){
        return res.status(404).json({errors:['Post not found']})
    }
    if(post.postOwnerID != req.userId){
        return res.status(401).json({errors:['Unauthorized']})
    }
    res.json(post)
}

const deletePost = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }

        if (post.postOwnerID != req.userId) {
            return res.status(401).json({ errors: ['Unauthorized'] });
        }
        await postService.deletePost(post);
        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Failed to delete post:', error);
        return res.status(500).json({ errors: ['Internal server error'] });
    }
}
const addComment = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }

        const commentContent = req.body.content;
        if (!commentContent) {
            return res.status(400).json({ errors: ['Comment content is required'] });
        }

        await postService.addComment(req.userId, commentContent, post);
        //return the comments
        res.json(post.comments);
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
};

const deleteComment = async (req, res) => {
    try {
        const postid = req.params.postid;
        const commentid = req.params.commentid;
        const result = await postService.deleteComment(postid, commentid, req.userId);
        if (result.error) {
            return res.status(result.status).json({ errors: [result.error] });
        }
        res.json(post.comments);
    } catch (error) {
        console.error('Failed to delete comment:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
};
const likeComment = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        const commentIndex = post.comments.findIndex(comment => comment._id == req.params.commentid);
        if (commentIndex === -1) {
            return res.status(404).json({ errors: ['Comment not found'] });
        }
        const comment = post.comments[commentIndex];
        const userId = req.userId;
        if (comment.likesID.includes(userId)) {
            comment.likesID = comment.likesID.filter(id => id !== userId);
        } else {
            comment.likesID.push(userId);
        }
        await post.save();
        res.json(comment.likesID.length);
    } catch (error) {
        console.error('Failed to like comment:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
}
module.exports = { createPost,updatePost,getPosts,getPost,deletePost,likePost,addComment,deleteComment,checkIfAuth}