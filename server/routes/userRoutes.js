var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js');

// User APIs
router.post('/register', controller.registerUser);
router.post('/login', controller.loginUser); // add this line

router.put('/:name/updatePassword', controller.updatePassword);
router.get('/:name', controller.getUser);
router.put('/:name/updateName', controller.updateName);
router.put('/:name/updateEmail', controller.updateEmail);
router.post('/:name/checkPassword', controller.checkPassword);

module.exports = router;
