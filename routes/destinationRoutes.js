const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers.js'); // Import the controllers

// Destination APIs
router.get('/:name', controller.getDestinations); //working

router.post('/:name', controller.addDestination); //working

router.put('/:name/:destinationId', controller.updateDestination); //working but not using?

router.delete('/:destinationId', controller.deleteDestination);
router.get('/id/:destinationId', controller.getDestinationDetails);
module.exports = router;