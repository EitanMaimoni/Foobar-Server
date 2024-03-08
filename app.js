    const session = require('express-session');
    const express = require('express');
    const mongoose = require('mongoose');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const customEnv = require('custom-env');

    // Seeding function imports
    const seedUsers = require('./seed/seedUsers');
    const seedPosts = require('./seed/seedPosts');
    // Create an Express application
    var app = express();
    app.use(session({
        secret:'foo',
        saveUninitialized:false,
        resave:false
    }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true}));
    app.use(express.json());
    app.use(cors());

    customEnv.env(process.env.NODE_ENV, './config');
    console.log(process.env.CONNECTION_STRING);
    console.log(process.env.PORT);
    // Connect to MongoDB
    mongoose.connect(process.env.CONNECTION_STRING).then(() => {
        seedPosts();
        seedUsers();
    }).catch(err => {
        console.error('Could not connect to MongoDB:', err);
    });
    // Serve static files from the 'public' folder
    app.use(express.static('public'));
    // Define the routes
    const user = require('./routes/user');
    app.use('/api/users', user);

    const post = require('./routes/post');
    app.use('/api/posts', post);

    const token = require('./routes/token');
    app.use('/api/tokens', token);
    //server listening on the port specified in the environment variable
    app.listen(process.env.PORT);

