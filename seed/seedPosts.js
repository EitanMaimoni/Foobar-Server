const mongoose = require('mongoose');
const postsData = require('../data/postsList.json');
const fs = require('fs');
const path = require('path');
//this file is used to seed the database with the postsList.json file
// Connect to MongoDB
const db = mongoose.connection;
// Function to convert an image to Base64
const imageToBase64 = (imagePath) => {
    try {
        const fullPath = path.join(__dirname, '..', 'data', imagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        return `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`Error converting image to Base64 for ${imagePath}:`, error);
        return null;
    }
};
// Seed the database with posts
const seedPosts = async () => {
    try {
        // Get the posts collection
        const collection = db.collection('posts');
        const postCount = await collection.countDocuments();
        // If there are no posts, seed the database
        if (postCount === 0) {
            const postsWithCustomId = postsData.map((post) => {
                const updatedComments = post.comments.map((comment) => ({
                    ...comment,
                    profilePic: comment.profilePic ? imageToBase64(comment.profilePic) : null
                }));

                return {
                    ...post,
                    img: post.img ? imageToBase64(post.img) : null,
                    comments: updatedComments
                };
            });

            await collection.insertMany(postsWithCustomId);
            console.log('Database seeded with posts');
        }
    } catch (error) {
        console.error('Error seeding posts:', error);
    }
};

module.exports = seedPosts;
