const User = require('../models/user')
const Post = require('../models/post')
const mongoose = require('mongoose');
//this function is used to create a user
const createUser = async (username, nick, password, img) => {
    // If the image havn't a prefix, add it
    if (img && !img.startsWith("data")) {
        img = `data:image/png;base64,${img}`
    }
    const randomId = new mongoose.Types.ObjectId();
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('Username already taken');
    }
    // Create a new user
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
//this function is used to get the image of a user
const getUserProfileImageByUsername = async (ownerId) => {
    try {
        // Find the user by their ID
        const user = await User.findOne({ _id: ownerId });
        if (!user) {
            throw new Error('User not found');
        }
        // Return the user's image
        return user.img;
    } catch (error) {
        throw error; 
    }
};
//this function is used to get the nickname of a user
const getUserNickByUsername = async (ownerId) => {
    try {
        // Find the user by their ID
        const user = await User.findOne({ _id: ownerId });
        if (!user) {
            throw new Error('User not found');
        }
        // Return the user's nickname
        return user.nick;
    }
    catch (error) {
        throw error;
    }
}
//this function is used to get the information of a user
const getInfo = async (userId) => {
    try {
        // Find the user by their ID
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
//this function is used to delete a user
const deleteUser = async (userId) => {
    try {
        // Find the user by their ID
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        // Delete the user's posts
        user.posts.forEach(async (postId) => {
            await Post.deleteOne({ _id: postId});
        });
        // Delete the user
        await User.deleteOne({ _id: userId });
    } catch (error) {
        throw error;
    }
}

const getPostsByUserId = async (userId) => {
    try {
        // Find the user by their ID
        const requestedUser = await User.findById(userId);
        if (!requestedUser) return { error: 'User not found' };
        // Initialize an array to hold posts with profile details
        let postsWithProfile = [];
        // Loop through each post ID to find the post and its owner's details
        for (let postId of requestedUser.posts) {
            // Find the post by its ID
            const post = await Post.findOne({ _id: postId });
            // If the post doesn't exist, skip to the next post
            if (post) {
                // Find the post owner by their ID
                const postOwner = await User.findById(post.postOwnerID);
                //push the post with the profile details to the array
                postsWithProfile.push({
                    ...post.toObject(),
                    profilePic: postOwner.img,
                    nick: postOwner.nick
                });
            }
        }
        // Return the array of posts with profile details
        return { posts: postsWithProfile };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { error: 'Error fetching posts' };
    }
};
//this function is used to check if the user can view the posts of another user
const canViewPosts = async (requesterId, userId) => {
    // If the requester is the user, they can view the posts
    if (requesterId == userId) {
        return true; 
    }
    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Assuming user.friends is an array of friend IDs
    return user.friends.includes(requesterId);
};

//this function is used to send a friend request
const SendFriendShipRequest = async (userId, friendId) => {
    try {
        // Find the user and check if they exist
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Find the friend and check if they exist
        const friend = await User.findById(friendId);
        if (!friend) {
            throw new Error('Friend not found');
        }
        // Check if friendId is not already in the FriendsRequest array
        if (!friend.FriendsRequest.includes(userId)) {
            // Add the friendId to the FriendsRequest array
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
            // Find the friend by their ID
            const friend = await User.findById(friendId, 'nick img');
            // If the friend doesn't exist, skip to the next friend
            if (friend) {
                //push the friend's details to the array
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
        // Initialize an array to hold friends request details
        let friendsRequestDetails = [];
        // Loop through each friend ID to find their details
        for (const friendId of user.FriendsRequest) {
            const friend = await User.findById(friendId, 'nick img');
            if (friend) {
                //push the friend's details to the array
                friendsRequestDetails.push({ id: friend._id, nick: friend.nick, img: friend.img });
            }
        }
        // Return the array of friends request details
        return friendsRequestDetails;
    } catch (error) {
        console.error('Error fetching friends request details:', error);
        throw error;
    }
}
//this function is used to accept a friend request
const acceptReq = async (userId, friendId) => {
    try {
        // Find the user and check if they exist
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Find the friend and check if they exist
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
        // Find the user and check if they exist
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
//this function is used to update a user
const updateUser = async (id, username, nick, password, img) => {
    try {
        // If the image havn't a prefix, add it
        if (img && !img.startsWith("data")) {
            img = `data:image/png;base64,${img}`
        }
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const existingUser = await User.findOne({ username: username });
        // Ensure that the existing user is not the same as the current user
        if (existingUser && existingUser._id.toString() !== id.toString()) {
            throw new Error('Username is already taken');
        }
        // Update the user with the provided username, nick, and password
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
