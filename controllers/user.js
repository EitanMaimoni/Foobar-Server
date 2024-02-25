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
}


const getUserImage = async (req, res) => {
    try {
        const username = req.params.name; 
        const imgUrl = await userService.getUserProfileImageByUsername(username);
        res.json({ imgUrl }); 
    } catch (error) {
        res.status(404).json({ message: error.message }); // User not found or other errors
    }
};
module.exports = { createUser, authUser, getUserImage,getUsernickname }