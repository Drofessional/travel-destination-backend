// seed.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Destination = require('../models/destinationmodel.js');
const User = require('../models/usermodel.js');
const mongoose = require('../db/connection.js');
const bcrypt = require('bcryptjs');

// Import the cities from the JSON file
const { cities } = require('./cities.json');

// Your OpenTripMap API key
const apiKey = process.env.OPENTRIPMAP_API_KEY;

// Function to get city details from OpenTripMap
async function getCityDetails(city, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.get(`https://api.opentripmap.com/0.1/en/places/geoname?name=${city}&apikey=${apiKey}`);
        resolve(response.data);
      } catch (error) {
        console.error('Error:', error.response.data);
        reject(error);
      }
    }, delay);
  });
}

// Function to get attractions from OpenTripMap
async function getAttractions(lat, lon, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=${lon}&lat=${lat}&rate=3&format=json&apikey=${apiKey}`);
        const attractions = response.data.map(place => place.name);
        resolve(attractions);
      } catch (error) {
        console.error('Error:', error.response.data);
        reject(error);
      }
    }, delay);
  });
}

// Clear the destinations collection
async function clearDestinations() {
  try {
    await Destination.deleteMany({});
    console.log('Cleared destinations collection.');
  } catch (error) {
    console.error('Error clearing destinations collection:', error);
  }
}

// Clear the users collection
async function clearUsers() {
  try {
    await User.deleteMany({});
    console.log('Cleared users collection.');
  } catch (error) {
    console.error('Error clearing users collection:', error);
  }
}


// Start of seeding process
async function startSeeding() {
  await clearDestinations(); // Clear destinations collection
  await clearUsers();

  const userDestinations = [];

  const cityPromises = cities.map(async (city, index) => {
    const delay = index * 2000; // Delay of 2 seconds between each request
    try {
      const cityData = await getCityDetails(city, delay);
      const attractions = await getAttractions(cityData.lat, cityData.lon, delay + 1000);
      const destination = new Destination({
        city: cityData.name,
        country: cityData.country,
        lon: cityData.lon,
        lat: cityData.lat,
        attractions: attractions
      });

      const savedDestination = await destination.save();
      userDestinations.push(savedDestination._id);

      console.log(`Added ${cityData.name} to the database.`);
    } catch (error) {
      console.error(`Failed to fetch data for city: ${city}`);
    }
  });

  // Wait for all cities to be processed
  await Promise.all(cityPromises);

  const hashedPassword = await bcrypt.hash('test', 10);
  const user = new User({
    name: 'mike',
    email: 'mikefesss@gmail.com',
    password: hashedPassword,
    destinations: userDestinations
  });

  try {
    await user.save();
    console.log(`Added user ${user.name} to the database with destinations.`);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

startSeeding();