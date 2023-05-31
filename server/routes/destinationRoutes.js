var express = require('express');
var router = express.Router();
const controller = require('../controllers/controllers.js'); // Import the controllers

// Destination APIs
router.get('/:username', controller.getDestinations);

router.post('/:username', controller.addDestination);

router.put('/:username/:destinationId', controller.updateDestination);

router.delete('/:username/:destinationId', controller.deleteDestination);

module.exports = router;
