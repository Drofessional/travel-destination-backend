const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const mongoose = require('./db/connection'); 

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
console.log(process.env.JWT_SECRET);
const port = process.env.PORT || 3000;

// Use Routes
app.use('/users', userRoutes);
app.use('/destinations', destinationRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));