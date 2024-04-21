const net = require('net');

// Define the linksVerification middleware function
function linksVerification(req, res, next) {
    const client = new net.Socket();

    const ip_address = '127.0.0.1';
    const port_no = 5555;

    // Extract the content from the request body
    const content = req.body.content; // Assuming the content is sent in the request body

    // Regular expression to extract the link from the content
    const linkRegex = /(?:^|\s)(www.[^\s]+)/g;
    const match = linkRegex.exec(content);

    if (match) {
        const link = match[0]; // Extract the link from the matched regex
        const message = `2 ${link}`; // Prepare the message to send to the server

        client.connect(port_no, ip_address, () => {
            console.log('Connected to C++ server');
            console.log(`Sending "${message}" to server`);
            client.write(message); // Send the message to the server
        });

        let responseData = '';

        client.on('data', (data) => {
            responseData += data.toString(); // Append data to responseData
        });

        client.on('close', () => {
            console.log('Connection closed');
            // Check if responseData contains 'true\ntrue'
            if (responseData.trim() === 'true\ntrue') {
                // If the server returns 'true\ntrue', cancel the process
                console.log('Server returned true, cancelling the process');
                return res.status(400).json({ error: 'Server returned true, cancelling the process' });
            } else {
                // If the server returns anything else, continue with the next middleware
                next();
            }
        });
client.on('error', (err) => {
            console.error('Error:', err);
            // If there's an error, continue with the next middleware
            next();
        });
    } else {
        console.log('No link found in the content');
        next();
    }
}

module.exports = linksVerification;