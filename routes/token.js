const tokenController = require('../controllers/token');

const express = require('express');
var router = express.Router();
console.log('asdsadsad')
router.route('/').post(tokenController.createToken)

module.exports = router;