require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const mongoose = require('./db/connection'); 

const app = express();
const port = process.env.PORT || 3000;
// app.use(cors(corsOptions));
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Allow requests from a specific origin (replace with your domain)
    methods: ['GET', 'POST'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    credentials: true, // Enable sending cookies with requests (for authenticated requests)
    optionsSuccessStatus: 200 // Return 200 for successful preflight requests
  };
  
  app.use(cors(corsOptions));
app.use(express.json());
console.log(process.env.JWT_SECRET);

// Use Routes
app.use('/users', userRoutes);
app.use('/destinations', destinationRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));