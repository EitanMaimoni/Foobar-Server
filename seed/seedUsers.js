const User = require('../models/user'); 
const usersData = require('../data/userList.json');
const fs = require('fs');
const path = require('path');
//this file is used to seed the database with the userList.json file
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
// Seed the database with users
const seedUsers = async () => {
    try {
        // Get the user collection
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Convert image paths to Base64
            const updatedUsersData = usersData.map((user) => {
                return { 
                    ...user,
                    img: imageToBase64(user.img) 
                };
            });
            // Insert the users into the database
            await User.insertMany(updatedUsersData);
            console.log('Database seeded with users');
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

module.exports = seedUsers;
