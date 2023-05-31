// seed.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Destination = require('../models/destinationmodel.js');
const User = require('../models/usermodel.js');
const mongoose = require('./connection');

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

// Loop over the cities and seed the database, with delay between each request
cities.forEach(async (city, index) => {
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

    destination
      .save()
      .then(() => console.log(`Added ${cityData.name} to the database.`))
      .catch(err => console.error(`Error: ${err}`));
  } catch (error) {
    console.error(`Failed to fetch data for city: ${city}`);
  }
});

// After seeding destinations, create a sample user
User.findOne({ email: 'mikefesss@gmail.com' })
  .then(user => {
    if (!user) {
      const user = new User({
        name: 'mike',
        email: 'mikefesss@gmail.com',
        password: 'test',
        destinations: []
      });

      user
        .save()
        .then(() => console.log(`Added user ${user.name} to the database.`))
        .catch(err => console.error(`Error: ${err}`));
    } else {
      console.log(`User ${user.name} already exists in the database.`);
    }
  })
  .catch(err => console.error(`Error: ${err}`));

// Wait for some time to ensure all data has been written to the database
setTimeout(async () => {
  await clearDestinations(); // Clear destinations collection

  // Fetch all destinations from the database
  const destinations = await Destination.find({});
  // Write the destinations data to a JSON file
  const destinationsFilePath = path.join(__dirname, '..', 'data', 'destinations.json');
  fs.writeFileSync(destinationsFilePath, JSON.stringify(destinations, null, 2));

  // Fetch all users from the database
  const users = await User.find({});
  // Write the users data to a JSON file
  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  console.log('Wrote data to JSON files.');
}, 30000);
