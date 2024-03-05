const tokenController = require('../controllers/token');
const authenticateToken = require('../middleware/authenticateToken');

const express = require('express');
var router = express.Router();

router.route('/').post(tokenController.createToken)
router.route('/verifyToken').post(authenticateToken, tokenController.tokenValidation)

module.exports = router;