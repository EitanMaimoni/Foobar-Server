const userService = require('../services/user');

const createUser = async (req, res) => {
    try {
        const createdUser = await userService.createUser(req.body.username, req.body.nick, req.body.password, req.body.img);
        res.json(createdUser);
    } catch (error) {
        if (error.message === 'Username already taken') {
            // If the error is specifically about the username being taken, send a 409 Conflict status
            res.status(409).json({ message: error.message });
        } else {
            // For other errors, continue sending a 404 status or consider using a more appropriate status code
            res.status(404).json({ message: error.message });
        }
    }
};

const updateUser = async (req, res) => {
    try {
        const userIdFromParams = req.params.id;
        const userId = req.userId;
        if (userId != userIdFromParams) {
            return res.status(403).json({ message: "You don't have permission to update this user." });
        }
        res.json(await userService.updateUser(userId, req.body.username, req.body.nick, req.body.password, req.body.img))
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const authUser = async (req, res) => {
    res.json(await userService.authUser(req.body.username, req.body.password))
};

const getUsernickname = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const nickname = await userService.getUserNickByUsername(ownerId);
        res.json({ nickname });
    } catch (error) {
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


const getPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const requesterId = req.params.id;
        // Ensure the requester is the user or a friend of the user
        const canViewPosts = await userService.canViewPosts(requesterId, userId);
        if (!canViewPosts) {
            return res.status(403).json({ message: "You don't have permission to view these posts." });
        }

        return res.json(await userService.getPostsByUserId(requesterId));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.deleteUser(userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const SendFriendShipRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const friendId = req.params.id;
        await userService.SendFriendShipRequest(userId, friendId);
        res.json({ message: "Friendship request sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getFriends = async (req, res) => {
    try {
        const userId = req.userId;
        const requesterId = req.params.id;
        // Ensure the requester is the user or a friend of the user
        const canViewPosts = await userService.canViewPosts(requesterId, userId);
        if (!canViewPosts) {
            return res.status(403).json({ message: "You don't have permission to view these posts." });
        }
        const friends = await userService.getFriends(requesterId);
        res.json({ friends });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFriendsRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const friendsRequest = await userService.getFriendsRequest(userId);
        res.json({ friendsRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const acceptFriendShipRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const userIdFromParams = req.params.id;
        if (userId != userIdFromParams) {
            return res.status(403).json({ message: "You don't have permission to accept this request." });
        }

        const friendId = req.params.fid;
        await userService.acceptReq(userId, friendId);
        res.json({ message: "Friendship request accepted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteFriend = async (req, res) => {
    try {
        const userId = req.userId;
        const userIdFromParams = req.params.id;
        if (userId != userIdFromParams) {
            return res.status(403).json({ message: "You don't have permission to delete this friend." });
        }
        const friendId = req.params.fid;
        await userService.deleteFriend(userId, friendId);
        res.json({ message: "Friend deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const friendId = req.params.id;
        await userService.deleteRequest(userId, friendId);
        res.json({ message: "Friendship request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createUser, authUser, getUserImage, getUsernickname, getUserID, deleteUser,
    getInfo, getPosts, SendFriendShipRequest, getFriends, acceptFriendShipRequest,
    getFriendsRequest, deleteFriend, deleteRequest, updateUser
}