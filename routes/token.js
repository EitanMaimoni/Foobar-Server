// Import required controllers and middleware
const tokenController = require('../controllers/token');
const authenticateToken = require('../middleware/authenticateToken');
// Import express and create a router instance
const express = require('express');
var router = express.Router();

router.route('/').post(tokenController.createToken)
router.route('/verifyToken').post(authenticateToken, tokenController.tokenValidation)

module.exports = router;