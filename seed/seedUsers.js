const User = require('../models/user'); 
const usersData = require('../data/userList.json');
const fs = require('fs');
const path = require('path');

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

const seedUsers = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Convert image paths to Base64
            const updatedUsersData = usersData.map(user => {
                if (user.img) {
                    return { ...user, img: imageToBase64(user.img) };
                }
                return user;
            });

            await User.insertMany(updatedUsersData);
            console.log('Database seeded with users');
        }
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

module.exports = seedUsers;
