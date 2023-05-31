const express = require('express');
const router = express.Router();
const controller = require('../controllers/controllers.js'); // Import the controllers

// Destination APIs
router.get('/destination/:name', controller.getDestinations);

router.post('/destination/:name', controller.addDestination);

router.put('/destination/:name/:destinationId', controller.updateDestination);

router.delete('/destination/:name/:destinationId', controller.deleteDestination);

module.exports = router;