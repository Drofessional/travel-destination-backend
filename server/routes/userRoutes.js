var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js');

// User APIs
router.post('/register', controller.registerUser); //working

router.put('/:name/updatePassword', controller.updatePassword); //working

router.get('/:name', controller.getUser); //working

router.put('/:name/updateName', controller.updateName); // new endpoint to update name

router.put('/:name/updateEmail', controller.updateEmail); // new endpoint to update email

router.post('/:name/checkPassword', controller.checkPassword); // new endpoint to check password

module.exports = router;
