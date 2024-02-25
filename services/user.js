const User = require('../models/user')

const createUser = async (username, nick, password, img) => {
    const user = new User({ username, nick, password, img })
    return await user.save();
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
const getUserProfileImageByUsername = async (username) => {
    try {
        const user = await User.findOne({ username: username }, 'img'); // Select only the img field
        if (!user) {
            throw new Error('User not found');
        }
        return user.img; // Return the image URL
    } catch (error) {
        throw error; // Propagate the error
    }
};
const getUserNickByUsername = async (username) => {
    try {
        const user = await User.findOne({ username: username }, 'nick'); 
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
