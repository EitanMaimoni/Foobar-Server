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
    try {
        const userId = req.params.id; 
        const user = await userService.getInfo(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { createUser, authUser, getUserImage, getUsernickname, getUserID, getInfo }