const jwt = require('jsonwebtoken');
// this middleware is used to authenticate the token
const authenticateToken = (req, res, next) => {
    // Extract the token from the request's authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // If there is no token, return an unauthorized status
    if (token == null) return res.sendStatus(401); 
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token not valid
        req.userId = user._id; // Extracted user ID from token
        next();
    });
};

module.exports = authenticateToken;
