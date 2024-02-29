const userService = require('../services/user');

const createUser = async (req, res) => {
    
    res.json(await userService.createUser(req.body.username, req.body.nick, req.body.password, req.body.img))
};

const authUser = async (req, res) => {
    res.json(await userService.authUser(req.body.username, req.body.password))
};

const getUsernickname = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const nickname = await userService.getUserNickByUsername(ownerId);
        res.json({ nickname }); 
    }catch(error){
        res.status(404).json({ message: error.message });
    }
}

const getUserImage = async (req, res) => {
    try {
        const ownerId = req.params.id; 
        const imgUrl = await userService.getUserProfileImageByUsername(ownerId);
        res.json({ imgUrl }); 
    } catch (error) {
        res.status(404).json({ message: error.message }); // User not found or other errors
    }
};
const getUserID = async (req, res) => {
    try {
        const ownerId = req.userId; 
        return res.json({ ownerId }); 
         
    } catch (error) {
        res.status(404).json({ message: error.message }); // User not found or other errors
    }
}
const getInfo = async (req, res) => {
    res.json(await userService.getInfo(req.userId))
};
const deleteUser = async (req, res) => {
    try{
        await userService.deleteUser(req.params.id);
        res.json({ message: 'User deleted' });
    }
    catch(error){
        res.status(404).json({ message: error.message });
    }
}
const getPosts = async (req, res) => {
    try {
        const userId = req.params.id; 
        const requesterId = req.user.id;
        // Ensure the requester is the user or a friend of the user
        const canViewPosts = await userService.canViewPosts(requesterId, userId);

        if (!canViewPosts) {
            return res.status(403).json({ message: "You don't have permission to view these posts." });
        }

        res.json(await postService.getPostsByUserId(userId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { createUser, authUser, getUserImage, getUsernickname, getUserID, getInfo ,deleteUser ,getPosts  }