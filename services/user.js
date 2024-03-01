const User = require('../models/user')
const Post = require('../models/post')
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

    // If passwords match
    if (password == user.password) {
        // Return a JSON object with user's _id and coverImg
        return {
            id: user._id,
            profilepic: user.img,
            coverImg: user.coverImg,
            nick: user.nick
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
            coverImg: user.coverImg,
            nick: user.nick
        };
    } catch (error) {
        throw new Error(error);
    }
}

const deleteUser = async (userId) => {
    try {
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
    try {
        // Find the user by their ID
        const requestedUser = await User.findById(userId);
        if (!requestedUser) return { error: 'User not found' };

        let postsWithProfile = [];
        for (let postId of requestedUser.posts) {
            const post = await Post.findOne({ _id: postId });
            if (post) {
                const postOwner = await User.findById(post.postOwnerID);
                postsWithProfile.push({
                    ...post.toObject(), // Converts the Mongoose document to a plain JavaScript object
                    profilePic: postOwner.img,
                    nick: postOwner.nick
                });
            }
        }

        return { posts: postsWithProfile };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { error: 'Error fetching posts' };
    }
};

const canViewPosts = async (requesterId, userId) => {
    if (requesterId == userId) {
        return true; // Users can always see their own posts
    }
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Assuming user.friends is an array of friend IDs
    return user.friends.includes(requesterId);
};
const SendFriendShipRequest = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const friend = await User.findById(friendId);
        if (!friend) {
            throw new Error('Friend not found');
        }
        // Check if friendId is not already in the FriendsRequest array
        if (!friend.FriendsRequest.includes(userId)) {
            friend.FriendsRequest.push(userId);
            await friend.save();
        } else {
            // Optionally, handle the case where the friend request already exists
            console.log('Friend request already sent');
        }
    } catch (error) {
        throw error;
    }
}

const getFriends = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const friends = await User.find({ _id: { $in: user.friends } });
        return friends;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    createUser, authUser, getUserProfileImageByUsername, getUserNickByUsername, getInfo, deleteUser,
    canViewPosts, getPostsByUserId, SendFriendShipRequest ,getFriends
}
