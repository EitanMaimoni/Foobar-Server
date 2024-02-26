const User = require('../models/user')
const mongoose = require('mongoose');

const createUser = async (username, nick, password, img) => {
    const randomId = new mongoose.Types.ObjectId(); 
    const user = new User({ _id: randomId, username, nick, password, img })
    return await user.save();
}

const authUser = async (username, password) => {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found, return null or appropriate response
    if (!user) {
        return null;
    }

    // If passwords match, return the user, otherwise return null
    return password == user.password ? true : false
};
const getUserProfileImageByUsername = async (ownerId) => {
    try {
        const user = await User.findOne({ _id: ownerId });
        if (!user) {
            throw new Error('User not found');
        }
        return user.img;
    } catch (error) {
        throw error; // Propagate the error
    }
};

const getUserNickByUsername = async (ownerId) => {
    try {
        const user = await User.findOne({ _id: ownerId }); 
        if (!user) {
            throw new Error('User not found');
        }
        return user.nick;
    }
    catch (error) {
        throw error;
    }
}


module.exports = { createUser, authUser, getUserProfileImageByUsername,getUserNickByUsername}