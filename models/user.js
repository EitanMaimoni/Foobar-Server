const mongoose = require('mongoose');
const ThemeImg = require('../data/themeImg')

const Schema = mongoose.Schema;

const User = new Schema({
    _id:{
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    nick: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    coverImg: {
        type: String, 
        required: false,
        default: ThemeImg
    },
    img: {
        type: String, 
        required: true
    },
    friends: {
        type: [String],
        required: false
    },
    posts: {
        type: [String],
        required: false
    },
    FriendsRequest: {
        type: [String],
        required: false
    }
});

module.exports = mongoose.model('User', User);