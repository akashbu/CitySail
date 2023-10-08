



const turf = require('@turf/turf');
const { createClient } = require('@google/maps');
const polyline = require('polyline'); // Import the 'polyline' library
const googleMapsClient = createClient({
  key: 'AIzaSyAd9Q9VAhlK92yem07xfIbh-8PvclKil4U',
  Promise: Promise, // Use native Promises
});

const origin = 'Fullerton, CA';
const destination = 'Norwalk, CA';


// server.js
const express = require('express');
const app = express();
const port = 3000; // Replace with your desired port

// Define an API endpoint to receive data from the React.js component using a GET request
app.get('/api/receiveData', (req, res) => {
  const dataFromReact = req.query.data; // Extract the data sent from React using query parameters
  // Process the data as needed
  console.log('Received data from React:', dataFromReact);
  // Send a response back to React
  res.json({ message: 'Data received successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


async function getRouteCoordinates() {
  try {
    const directions = await googleMapsClient.directions({
      origin,
      destination,
      mode: 'driving',
    }).asPromise();

    if (directions && directions.json && directions.json.routes && directions.json.routes.length > 0) {
      const route = directions.json.routes[0];
      const routeCoordinates = [];
      console.log(route.summary)
      // Iterate through the legs and steps to get detailed coordinates
      route.legs.forEach((leg) => {
        leg.steps.forEach((step) => {
          const polylinePoints = step.polyline.points;
          const decodedCoordinates = polyline.decode(polylinePoints);
          routeCoordinates.push(...decodedCoordinates);
        });
      });

      return routeCoordinates;
    } else {
      console.error('No route data found in the response.');
      return null;
    }
  } catch (error) {
    console.error('Error getting route coordinates:', error.message);
    return null;
  }
}
async function isMarkerOnRoute(insertedMarkerCoordinates) {
  //const insertedMarkerCoordinates = [33.8665225987302, -117.87740528583528];   //get marker location from dynamic marker.js
  const routeCoordinates = await getRouteCoordinates();
  console.log(insertedMarkerCoordinates)
  if (!routeCoordinates) {
    return false;
  }

  const thresholdDistance = 0.1; // Adjust this threshold as needed (in kilometers)

  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const segmentStart = routeCoordinates[i];
    const segmentEnd = routeCoordinates[i + 1];

    // Calculate the distance from the marker to the current route segment

    const distanceToSegment = turf.pointToLineDistance(insertedMarkerCoordinates, [segmentStart, segmentEnd], { units: 'miles' });
   // console.log(distanceToSegment,thresholdDistance)

    if (distanceToSegment <= thresholdDistance) {
      console.log(distanceToSegment,thresholdDistance)
      return true;
  
     // console.log('The inserted marker is on the route.'); // Marker is within threshold distance of the route
    }
  }
     return false;

    //console.log('The inserted marker is not on the route.');// Marker is not on the route

  
 
}



// Check if the inserted marker is on the route


const insertedMarkerCoordinates = [33.8665225987302, -117.87740528583528];

isMarkerOnRoute(insertedMarkerCoordinates) // Replace with your own promise function
  .then(result => {
    if (isMarkerOnRoute(insertedMarkerCoordinates)==true) {
      console.log('The inserted marker is on the route.');
    } else {
      console.log('The inserted marker is not on the route.');
    } // Access the resolved value
  })
  .catch(error => {
    console.error(error); // Handle errors if the promise is rejected
  });