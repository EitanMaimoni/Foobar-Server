    const userService = require('../services/user');

    const createUser = async (req, res) => {
        
        res.json(await userService.createUser(req.body.username, req.body.nick, req.body.password, req.body.img))
    };

    const authUser = async (req, res) => {
        res.json(await userService.authUser(req.body.username, req.body.password))
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
        try {
            const userId = req.params.id; 
            const user = await userService.getInfo(userId);
            
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
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
            const friendId = req.params.fid;
            await userService.SendFriendShipRequest(userId, friendId);
            res.json({ message: "Friendship request sent successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }






    const getFriends = async (req, res) => {
        try {
            const userId = req.userId;
            const friends = await userService.getFriends(userId);
            res.json({ friends });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    const acceptFriendShipRequest = async (req, res) => {
        try {
            const userId = req.userId;
            const userIdFromParams = req.params.id;
            if(userId != userIdFromParams) {
                return res.status(403).json({ message: "You don't have permission to accept this request." });
            }
            
            const friendId = req.params.fid;
            await userService.SendFriendShipRequest(userId, friendId);
            res.json({ message: "Friendship request accepted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    module.exports = { createUser, authUser, getUserImage, getUsernickname, getUserID, deleteUser, 
        getInfo ,getPosts,SendFriendShipRequest , getFriends ,acceptFriendShipRequest }