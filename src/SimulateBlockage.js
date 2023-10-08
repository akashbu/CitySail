// import * as turf from '@turf/turf';
// Use require syntax

const turf = require('@turf/turf');


// Your code here
// const googleMapsClient = require('@google/maps').createClient({
//     key: 'AIzaSyAd9Q9VAhlK92yem07xfIbh-8PvclKil4U',
//     Promise: Promise, // Use native Promises
//   });
  
//   const polyline = require('polyline');
  
//   const origin = 'Fullerton, CA';
//   const destination = 'Norwalk, CA';
  
//   async function getRouteCoordinates() {
//     try {
//       const directions = await googleMapsClient.directions({
//         origin,
//         destination,
//         mode: 'driving',
//       }).asPromise();
  
//       if (directions && directions.json && directions.json.routes && directions.json.routes.length > 0) {
//         const route = directions.json.routes[0];
//         const polylinePoints = route.overview_polyline.points;
//         const decodedCoordinates = polyline.decode(polylinePoints);
  
//         // The decodedCoordinates array contains coordinates along the route
//         console.log(decodedCoordinates);
//         console.log('Route Name:', route.summary); 
//       } else {
//         console.error('No route data found in the response.');
//       }
//     } catch (error) {
//       console.error('Error getting route coordinates:', error.message);
//     }
//   }


  
  
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAd9Q9VAhlK92yem07xfIbh-8PvclKil4U',
    Promise: Promise, // Use native Promises
  });
  
  const origin = 'Fullerton, CA';
  const destination = 'Norwalk, CA';
  
  async function getRouteCoordinates() {
    try {
      const directions = await googleMapsClient.directions({
        origin,
        destination,
        mode: 'driving',
      }).asPromise();
  
      if (directions && directions.json && directions.json.routes && directions.json.routes.length > 0) {
        const route = directions.json.routes[0];
  
        // Iterate through the legs and steps to get detailed coordinates
        route.legs.forEach((leg) => {
          leg.steps.forEach((step) => {
            const polylinePoints = step.polyline.points;
            const decodedCoordinates = require('polyline').decode(polylinePoints);
            console.log('Step Coordinates:', decodedCoordinates);
          });
        });
      } else {
        console.error('No route data found in the response.');
      }
    } catch (error) {
      console.error('Error getting route coordinates:', error.message);
    }
  }
  

  
// const axios = require('axios');
// const fs = require('fs');


// async function geocode(lat, lon) {
//     const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
//     try {
//       const response = await axios.get(apiUrl);
//       return response.data.display_name;
//     } catch (error) {
//       console.error('Error geocoding:', error);
//       return null;
//     }
//   }

// async function calculateRoadDistance(startLat, startLon, endLat, endLon) {
//     const startLocation = await geocode(startLat, startLon);
//     const endLocation = await geocode(endLat, endLon);
  
//     const osrmBaseUrl = 'http://router.project-osrm.org';
//     const apiUrl = `${osrmBaseUrl}/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?steps=true&geometries=geojson`;
  
//     try {
//       const response = await axios.get(apiUrl);
//       const route = response.data.routes[0];
//       const roadDistance = route.distance / 1000; // Convert to kilometers
//       return roadDistance
//     } catch (error) {
//       console.error('Error calculating road distance:', error);
//     }

//     return roadDistance
//   }

//   // Example road coordinates (adjust these as needed)
//   async function checkForDynamicMarkers(){

    

//    // Assuming you have coordinates for the source, destination, and inserted markers
//     const sourceCoordinates = [33.89916622901473,-117.91977882385254];
//     const destinationCoordinates = [33.899273090781506,-117.9106378555298];
//     const insertedMarkerCoordinates = [33.9061119652832,-118.06612551212312];

//     // Calculate the distances
//     const sourceToDestinationDistance = await calculateRoadDistance(
//     sourceCoordinates[0],
//     sourceCoordinates[1],
//     destinationCoordinates[0],
//     destinationCoordinates[1]
//     );
//     const sourceToInsertedMarkerDistance = await calculateRoadDistance(
//     sourceCoordinates[0],
//     sourceCoordinates[1],
//     insertedMarkerCoordinates[0],
//     insertedMarkerCoordinates[1]
//     );
//     const destinationToInsertedMarkerDistance = await calculateRoadDistance(
//     destinationCoordinates[0],
//     destinationCoordinates[1],
//     insertedMarkerCoordinates[0],
//     insertedMarkerCoordinates[1]
//     );


//     console.log(sourceToDestinationDistance)
//     console.log(sourceToInsertedMarkerDistance)
//     console.log(destinationToInsertedMarkerDistance)
    
//     // Check if the inserted marker is between the source and destination markers
//     if (
    
//     sourceToDestinationDistance == sourceToInsertedMarkerDistance+destinationToInsertedMarkerDistance


//     ) 
    
//     {
//     console.log('The inserted marker is between the source and destination markers.');
//     } else {
//     console.log('The inserted marker is not between the source and destination markers.');
//     }


// }
// checkForDynamicMarkers();
  
//   // Call the function with the road coordinates

  



// Example coordinates for the source, destination, and inserted marker
const sourceCoordinates = [-117.91977882385254, 33.89916622901473];
const destinationCoordinates = [-117.9106378555298, 33.899273090781506];
const insertedMarkerCoordinates = [33.9061119652832, -118.06612551212312];


// Example route coordinates (a series of points along the route)
 const routeCoordinates =getRouteCoordinates();

//[
//   [-117.91977882385254, 33.89916622901473],
//   // ... Add more coordinates along the route ...
//    [-117.91535854339601, 33.899237470207446],
//   [-117.9106378555298, 33.899273090781506],
// ];

// Create Turf.js point features for the source, destination, and inserted marker
const sourcePoint = turf.point(sourceCoordinates);
const destinationPoint = turf.point(destinationCoordinates);
const insertedMarkerPoint = turf.point(insertedMarkerCoordinates);

// Create a Turf.js line feature for the route
const routeLine = turf.lineString(routeCoordinates);
const snappedPoint = turf.nearestPointOnLine(routeLine, insertedMarkerPoint);
const snappedCoordinates = snappedPoint.geometry.coordinates;
console.log("snappedCoordinates",snappedCoordinates)

// Check if the inserted marker is on the route
const isOnRoute = turf.booleanPointOnLine(snappedCoordinates, routeLine);
console.log(routeLine)
if (isOnRoute) {
  console.log('The inserted marker is on the route.');
} else {
  console.log('The inserted marker is not on the route.');
}
