const session = require('express-session');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const customEnv = require('custom-env');
const path = require('path');

// Route imports
const user = require('./routes/user');
const post = require('./routes/post');
const token = require('./routes/token');

// Seeding function imports
const seedUsers = require('./seed/seedUsers');
const seedPosts = require('./seed/seedPosts');

customEnv.env(process.env.NODE_ENV, './config');

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Connected to MongoDB');
    seedPosts(); // Seed Posts
    seedUsers(); // Seed Users

    // Send initial message "8 1 2" after database connection
    sendMessage();
}).catch(err => {
    console.error('Could not connect to MongoDB:', err);
});

function sendMessage() {
    // Establish connection with your C++ server and send message "8 1 2"
    // You can use libraries like 'net' or 'socket.io-client' for this purpose
    const net = require('net');

    const client = new net.Socket();
    
    const ip_address = '127.0.0.1';
    const port_no = 5555;

    client.connect(port_no, ip_address, () => {
        console.log('Connected to C++ server');
        // Send "8 1 2" to the server
        client.write('8 1 2');
    });

    client.on('data', (data) => {
        console.log('Received:', data.toString());
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Error:', err);
    });
}

var app = express();

app.use(session({
    secret: 'foo',
    saveUninitialized: false,
    resave: false
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/users', user);
app.use('/api/posts', post);
app.use('/api/tokens', token);

app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve React app for any other route not covered by API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });