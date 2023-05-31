var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js'); // Import the controllers

// User APIs
router.post('/register', controller.registerUser);

router.post('/login', controller.loginUser);

router.get('/:name', controller.getUser);

module.exports = router;
