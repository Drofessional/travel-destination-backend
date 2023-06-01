var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js');

// User APIs
router.post('/register', controller.registerUser); //working

router.put('/:name/updatePassword', controller.updatePassword); //working

router.get('/:name', controller.getUser); //working

module.exports = router;
