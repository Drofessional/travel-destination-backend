// connection.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mike:test@cluster0.s3nhnjf.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

module.exports = mongoose;
