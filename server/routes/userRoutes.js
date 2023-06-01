var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js');

// User APIs
router.post('/register', controller.registerUser);

//Does this make sense?
// router.post('/login', controller.loginUser);

router.get('/:name', controller.getUser);

module.exports = router;
