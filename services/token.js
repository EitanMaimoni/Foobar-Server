const jwt = require('jsonwebtoken');
const User = require('../models/user')
//this function is used to create a token
const createToken = async (username, password) => {
    // Find the user by their username
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    // Check if the password is correct
    if (user.password != password) {
        throw new Error('Invalid credentials');
    }
    // Create a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return token;
}


module.exports = { createToken }