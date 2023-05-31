// Destination.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  attractions: [{
    type: String
  }]
});

module.exports = mongoose.model('Destination', DestinationSchema);
