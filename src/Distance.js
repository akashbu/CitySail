

import {markers} from './DynamicMarker';


console.log(markers)
const axios = require('axios');

// Define the starting and ending coordinates (latitude and longitude)
const startLat = 40.748817;
const startLon = -73.985428;
const endLat = 34.052235;
const endLon = -118.243683;

// Use Nominatim API to geocode coordinates to place names (optional)
async function geocode(lat, lon) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data.display_name;
  } catch (error) {
    console.error('Error geocoding:', error);
    return null;
  }
}

// Calculate road distance using OSRM API
async function calculateRoadDistance(startLat, startLon, endLat, endLon) {
  const startLocation = await geocode(startLat, startLon);
  const endLocation = await geocode(endLat, endLon);

  const osrmBaseUrl = 'http://router.project-osrm.org';
  const apiUrl = `${osrmBaseUrl}/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?steps=true&geometries=geojson`;

  try {
    const response = await axios.get(apiUrl);
    const route = response.data.routes[0];
    const roadDistance = route.distance / 1000; // Convert to kilometers
    console.log(`Road distance from ${startLocation} to ${endLocation}: ${roadDistance.toFixed(2)} km`);
  } catch (error) {
    console.error('Error calculating road distance:', error);
  }
}

// Call the function to calculate road distance
calculateRoadDistance(startLat, startLon, endLat, endLon);
