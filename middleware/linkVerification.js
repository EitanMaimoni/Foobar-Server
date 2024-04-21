const net = require('net');

function linksVerification(req, res, next) {
    const ip_address = '127.0.0.1';
    const port_no = 5555;
    const content = req.body.content;
    const linkRegex = /(?:^|\s)(www.[^\s]+)/g;
    let match;
    let links = [];

    while ((match = linkRegex.exec(content)) !== null) {
        links.push(match[0].trim());
    }

    if (links.length === 0) {
        console.log('No link found in the content');
        return next();
    }

    let completedChecks = 0;
    let hasError = false;

    links.forEach(link => {
        const client = new net.Socket();
        const message = 2 ${link};

        client.connect(port_no, ip_address, () => {
            console.log(Connected to C++ server to check link: ${link});
            console.log(Sending "${message}" to server);
            client.write(message);
            client.end();  // Close the sending side of the socket
        });

        let responseData = '';

        client.on('data', (data) => {
            responseData += data.toString();
        });

        client.on('end', () => {
            console.log(Server has finished sending data for link: ${link});
        });

        client.on('close', () => {
            completedChecks++;
            if (responseData.trim() === 'true\ntrue' && !hasError) {
                hasError = true;
                console.log('Server returned true, cancelling the process');
                res.status(400).json({ error: 'Server returned true, cancelling the process' });
            } else if (completedChecks === links.length && !hasError) {
                next();
            }
        });

        client.on('error', (err) => {
            console.error('Error:', err);
            hasError = true;
            res.status(500).json({ error: 'Server error' });
        });
    });
}

module.exports = linksVerification;