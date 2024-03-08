const postService = require('../services/post');
// Create a new post
const createPost = async (req, res) => {
    // Use the userId from the request, set by the middleware
    const postOwnerID = req.userId;
    const { content, img, date, comments, likesID } = req.body;
    // Validate the request
    try {
        // Create the post
        const post = await postService.createPost(postOwnerID, content, img, date, comments, likesID);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post' });
    }
};
// Update the image of a post
const updateImage = async (req, res) => {
    const post = await postService.getPostById(req.params.id)
    const img = req.body.image;
    if(post.postOwnerID != req.userId){
        return res.status(401).json({ errors: ['Unauthorized'] })
    }
    try{
        const updatedPost = await postService.updateImage(post, img)
        if (!updatedPost) {
            return res.status(500).json({ errors: ['Internal server error'] })
        }
        res.json(updatedPost)
    }catch (error) {
        res.status(500).json({ message: 'Error updating image' });
    }
}


// Get a post by its ID
const getPost = async (req, res) => {
    const post = await postService.getPostById(req.params.id)
    // If the post doesn't exist, return a 404 error
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] })
    }
    res.json(post)
}
// Get all posts
const getPosts = async (req, res) => {
    res.json(await postService.getPosts());
}
// Update a post
const updatePost = async (req, res) => {
    // Get the post by its ID
    const updatedPost = await postService.updatePost(req, res)
    if (!updatedPost) {
        return res.status(500).json({ errors: ['Internal server error'] })
    }
    // Return the updated post
    res.json(updatedPost)
}
// Like a post
const likePost = async (req, res) => {
    // Get the post by its ID
    const post = await postService.likePost(req.params.id, req.userId);
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    // Return the number of likes
    res.json(post.likesID.length);
}
// Check if the user is authorized to perform an action
const checkIfAuth = async (req, res) => {
    try{
        return await postService.checkIfAuth(req, res)
    }catch(error){
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Delete a post
const deletePost = async (req, res) => {
    try {
        // Get the post by its ID
        const post = await postService.getPostById(req.params.pid);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        if (post.postOwnerID != req.userId) {
            return res.status(401).json({ errors: ['Unauthorized'] });
        }
        // Delete the post
        await postService.deletePost(post);
        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Failed to delete post:', error);
        return res.status(500).json({ errors: ['Internal server error'] });
    }
}
// Get the posts of the user's friends
const getFriendsPosts = async (req, res) => {
    const posts = await postService.getFriendsPosts(req.userId);
    res.json(posts);
}


// Add a comment to a post
const addComment = async (req, res) => {
    try {
        // Get the post by its ID
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ errors: ['Post not found'] });
        }
        // Get the comment content from the request
        const commentContent = req.body.content;
        if (!commentContent) {
            return res.status(400).json({ errors: ['Comment content is required'] });
        }
        // Add the comment to the post
        const newComments = await postService.addComment(req.userId, commentContent, post);
        // Return the comments of the updated post
        return res.json(newComments);
    } catch (error) {
        console.error('Failed to add comment:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
};

// Delete a comment from a post
const deleteComment = async (req, res) => {
    try {
        const postid = req.params.postid;
        const commentid = req.params.commentid;
        // Get the post by its ID
        const result = await postService.deleteComment(postid, commentid, req.userId);
        if (result.error) {
            return res.status(result.status).json({ errors: [result.error] });
        }
        // Return the comments of the updated post
        res.json(result.post.comments);
    } catch (error) {
        console.error('Failed to delete comment:', error);
        res.status(500).json({ errors: ['Internal server error'] });
    }
};
// Like a comment
const likeComment = async (req, res) => {
    // Get the post by its ID
    const commentId = req.params.commentid;
    const postId = req.params.postid;
    // Get the post by its ID
    const commentLikes = await postService.likeComment(postId, commentId, req.userId);
    if (!commentLikes) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    // Return the number of likes
    res.json(commentLikes);
}
// Update a comment
const updateComment = async (req, res) => {
    const post = await postService.getPostById(req.params.postid);
    // Get the comment by its ID
    const commentId = req.params.commentid;
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] });
    }
    //call the updateComment function from the postService
    const updateComment = await postService.updateComment(commentId, post, req.body.content);
    if (!updateComment) {
        return res.status(500).json({ errors: ['Internal server error'] })
    }
    // Return the updated comment
    res.json(updateComment)
}
// Check if the user is authorized to perform an action
const checkIfAuthComment = async (req, res) => {
    // Get the post by its ID
    const post = await postService.getPostById(req.params.postid)
    if (!post) {
        return res.status(404).json({ errors: ['Post not found'] })
    }
    //call the checkIfAuth function from the postService
    const comment = post.comments.find(comment => comment._id == req.params.commentname);
    if (comment.commentOwnerID != req.userId) {
        return res.status(401).json({ errors: ['Unauthorized'] })
    }
    // Return true if the user is authorized
    res.json(true);
}




module.exports = {createPost, updatePost, getPosts, getPost, deletePost, likePost, updateImage,
    addComment, updateComment,deleteComment, checkIfAuth, checkIfAuthComment, likeComment, getFriendsPosts}