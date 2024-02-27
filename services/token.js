const jwt = require('jsonwebtoken');
const User = require('../models/user')

const createToken = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    if (user.password != password) {
        throw new Error('Invalid credentials');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return token;
}


module.exports = { createToken }