const User = require('../models/user')
const Post = require('../models/post')
const mongoose = require('mongoose');

const createUser = async (username, nick, password, img) => {
    const randomId = new mongoose.Types.ObjectId();
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Username already taken');
    }
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
                    ...post.toObject(),
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
            return res.status(401).json({ errors: ['Friend request already sent'] })
        }
    } catch (error) {
        throw error;
    }
}

const getFriends = async (userId) => {
    try {
        // Find the user and check if they exist
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        // Initialize an array to hold friends' details
        let friendsDetails = [];

        // Loop through each friend ID to find their details
        for (const friendId of user.friends) {
            const friend = await User.findById(friendId, 'nick img');
            if (friend) {
                friendsDetails.push({ id: friend._id, nick: friend.nick, img: friend.img });
            }
        }
        return friendsDetails;
    } catch (error) {
        console.error('Error fetching friends details:', error);
        throw error;
    }
}

const getFriendsRequest = async (userId) => {
    try {
        // Find the user and check if they exist
        const user = await User.findById(userId);

        if (!user) throw new Error('User not found');

        let friendsRequestDetails = [];
        for (const friendId of user.FriendsRequest) {
            const friend = await User.findById(friendId, 'nick img');
            if (friend) {
                friendsRequestDetails.push({ id: friend._id, nick: friend.nick, img: friend.img });
            }
        }
        return friendsRequestDetails;
    } catch (error) {
        console.error('Error fetching friends request details:', error);
        throw error;
    }
}

const acceptReq = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const friend = await User.findById(friendId);
        if (!friend) {
            throw new Error('Friend not found');
        }
        // add to friends list
        user.friends.push(friendId);
        await user.save();
        // remove from friends request list
        user.FriendsRequest = user.FriendsRequest.filter(id => id != friendId);
        await user.save();
        // add to friends list
        friend.friends.push(userId);
        await friend.save();
    } catch (error) {
        throw error;
    }
}
const deleteFriend = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const friend = await User.findById(friendId);
        if (!friend) {
            throw new Error('Friend not found');
        }
        //check if the friend is in the friends request list
        if (user.FriendsRequest.includes(friendId)) {
            await deleteRequest(user, friendId);
            return;
        }
        // remove from friends list
        user.friends = user.friends.filter(id => id != friendId);
        await user.save();
        // remove from friends list
        friend.friends = friend.friends.filter(id => id != userId);
        await friend.save();
    }
    catch (error) {
        throw error;
    }
}

const deleteRequest = async (user, friendId) => {
    try {
        // remove from friends request list
        user.FriendsRequest = user.FriendsRequest.filter(id => id != friendId);
        await user.save();
    }
    catch (error) {
        throw error;
    }
}

const updateUser = async (id, username, nick, password, img) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const existingUser = await User.findOne({ username: username });
        // Ensure that the existing user is not the same as the current user
        if (existingUser && existingUser._id.toString() !== id.toString()) {
            throw new Error('Username is already taken');
        }
        user.username = username;
        user.nick = nick;
        user.password = password;
        user.img = img;
        await user.save();
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createUser, authUser, getUserProfileImageByUsername, getUserNickByUsername, getInfo, deleteUser,
    canViewPosts, getPostsByUserId, SendFriendShipRequest, getFriends, getFriendsRequest, acceptReq, deleteFriend, deleteRequest, updateUser
}
