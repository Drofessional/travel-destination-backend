const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');

const app = express();
app.use(express.json());
require('dotenv').config();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
