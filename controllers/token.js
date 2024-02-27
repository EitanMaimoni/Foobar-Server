const tokenService = require('../services/token');

const createToken = async (req, res) => {
    try {
        const token = await tokenService.createToken(req.body.username, req.body.password);
        res.json({ token });
    } catch (error) {
        if (error.message === 'Invalid credentials') {
            res.status(401).send('Invalid credentials');
        } else {
            res.status(500).send('Server error');
        }
    }
};

module.exports = { createToken };
