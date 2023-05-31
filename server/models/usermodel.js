// User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  destinations: [{
    type: Schema.Types.ObjectId,
    ref: 'Destination',
    required: false
  }]
});

module.exports = mongoose.model('User', UserSchema);
