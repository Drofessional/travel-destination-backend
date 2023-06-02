const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: false
  },
  lon: {
    type: Number,
    required: false
  },
  lat: {
    type: Number,
    required: false
  },
  attractions: [{
    type: String
  }]
});

module.exports = mongoose.model('Destination', DestinationSchema);
