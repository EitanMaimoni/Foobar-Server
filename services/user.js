const User = require('../models/user')
const mongoose = require('mongoose');

const createUser = async (username, nick, password, img) => {
    const randomId = new mongoose.Types.ObjectId();
    const user = new User({ _id: randomId, username, nick, password, img })
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
        // Assuming ownerId is being used for some purpose in your code
        const ownerId = req.userId;

        // Find the user by their ID
        const user = await User.findOne({ _id: userId });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the required fields
        return res.json({
            nickname: user.nick,
            img: user.img,
            coverImg: user.coverImg
        });

    } catch (error) {
        res.status(500).json({ message: error.message }); // Internal Server Error
    }
}

const deleteUser = async (userId) => {
    try {
        console.log("aaaaaaa");
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        // Correct method to delete a user by their ID
        await User.deleteOne({ _id: userId });
    } catch (error) {
        throw error;
    }
}

const getPostsByUserId = async (userId) => {
    const requestedUser = User.findById(userId);
     await requestedUser.posts.sort({ date: -1 });
};

const canViewPosts = async (requesterId, userId) => {
    if (requesterId === userId) return true; // Users can always see their own posts

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Assuming user.friends is an array of friend IDs
    return user.friends.includes(requesterId);
};

module.exports = { createUser, authUser, getUserProfileImageByUsername, getUserNickByUsername, getInfo, deleteUser,canViewPosts,getPostsByUserId }
