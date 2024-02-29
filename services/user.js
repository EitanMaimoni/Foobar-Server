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

    // If passwords match
    if (password == user.password) {
        // Return a JSON object with user's _id and coverImg
        return {
            id: user._id,
            profilepic: user.img,
            coverImg: user.coverImg
        };
    } else {
        // Passwords do not match, return null or false
        return null;
    }
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

const getInfo = async (userId) => {
    try {
        const user = await User.findById(userId).exec();

        if (!user) {
            throw new Error('User not found');
        }

        // Construct the user data object
        return {
            nickname: user.nick,
            img: user.img,
            coverImg: user.coverImg
        };
    } catch (error) {
        throw new Error(error);
    }
}


module.exports = { createUser, authUser, getUserProfileImageByUsername, getUserNickByUsername, getInfo}
