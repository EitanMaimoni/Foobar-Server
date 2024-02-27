const userService = require('../services/user');

const createUser = async (req, res) => {
    
    res.json(await userService.createUser(req.body.username, req.body.nick, req.body.password, req.body.img))
};

const authUser = async (req, res) => {
    res.json(await userService.authUser(req.body.username, req.body.password))
};


const getUsernickname = async (req, res) => {
    try {
        const username = req.params.name; 
        const nickname = await userService.getUserNickByUsername(username);
        res.json({ nickname }); 
    }catch(error){
        res.status(404).json({ message: error.message });
    }
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
module.exports = { createUser, authUser, getUserImage, getUsernickname, getUserID, getInfo }