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

const tokenValidation = async (req, res) => {
    //if we get here, we passed the authenticateToken in middleware
    res.json({ isValid: true });
};

module.exports = { createToken, tokenValidation };
