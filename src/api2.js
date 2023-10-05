const axios = require('axios');
const fs = require('fs');

function saveDistanceMatrixToFile(matrix, filename) {
    try {
      const data = JSON.stringify(matrix);
      fs.writeFileSync(filename, data);
      console.log(`Distance matrix saved to ${filename}`);
    } catch (error) {
      console.error('Error saving distance matrix:', error);
    }
  }

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
      return roadDistance
    } catch (error) {
      console.error('Error calculating road distance:', error);
    }

    return roadDistance
  }


  const locations = [
    { name: 'Fullerton', lat: 33.8704, lon: -117.9242 },
    { name: 'Long Beach', lat: 33.770050, lon: -118.193741 },
    { name: 'Brea', lat: 33.915279, lon: -117.888207 },
    { name: 'Placentia', lat: 33.871075, lon: -117.862755 },
    { name: 'Yorba Linda', lat: 33.888531, lon: -117.824310 },
    { name: 'Bueuna Park', lat: 33.869110, lon: -117.993952 },
    { name: 'Cerritos', lat: 33.862607, lon: -118.052657 },
    { name: 'Anaheim', lat: 33.836594, lon: -117.914299},
    { name: 'Norwalk', lat: 33.913780, lon: -118.070099 },
    { name: 'Bellflower', lat: 33.881683, lon: -118.117012 },
    { name: 'La Mirada', lat: 33.908989, lon: -118.009949 },
    { name: 'Lakewood', lat: 33.853626, lon: -118.133957 },
    { name: 'Los Alamitos', lat: 33.804970, lon: -118.071800 },
    { name: 'Seal Beach', lat: 33.741409, lon: -118.104767 },
    { name: 'La Habra', lat: 33.931858, lon: -117.946136 },
    { name: 'Garden Grove', lat: 33.774269, lon: -117.937996 },
    { name: 'Santa Ana', lat: 33.745472, lon: -117.867653 },
    { name: 'Carson', lat: 33.827820, lon: -118.272346 },
    { name: 'Chino Hills', lat: 33.991200, lon: -117.760861 },
    { name: 'Diamond Bar', lat: 34.026490, lon: -117.810264 },
  ];
  
  // Calculate distances between all pairs of locations and populate a distance matrix
  const numLocations = locations.length;
  const distanceMatrix = Array.from({ length: numLocations }, () => Array(numLocations));

  
  
async function createDistanceMatrix (){
  for (let i = 0; i < numLocations; i++) {
    for (let j = 0; j < numLocations; j++) {
      if (i === j) {
        distanceMatrix[i][j] = 0; // Distance from a location to itself is 0
      } else {
        const { lat: lat1, lon: lon1 } = locations[i];
        const { lat: lat2, lon: lon2 } = locations[j];
        try {
            roadDistance = await calculateRoadDistance(lat1, lon1, lat2, lon2);
            if (roadDistance) {
              distanceMatrix[i][j] = roadDistance;
              console.log(`Road distance from ${locations[i].name} to ${locations[j].name}: ${roadDistance.toFixed(2)} km`)
            } else {
              // Set a default value (e.g., -1) for distances that could not be calculated
              distanceMatrix[i][j] = -1;
            }
          } catch (error) {
            console.error('Error calculating road distance:', error);
            // Set a default value (e.g., -1) for distances in case of an error
            distanceMatrix[i][j] = -1;
          }
      }
    }
  }
}

function createOpitimizeMatrix(){
    distanceMatrix[1][3] = 999
    for (let k = 0; k < numLocations; k++) {
      for (let i = 0; i < numLocations; i++) {
        for (let j = 0; j < numLocations; j++) {
          if (distanceMatrix[i][k] + distanceMatrix[k][j] < distanceMatrix[i][j]) {
            distanceMatrix[i][j] = distanceMatrix[i][k] + distanceMatrix[k][j];
          }
        }
      }
    }
  }

    // Function to print the distanceMatrix in matrix format
function printDistanceMatrix(matrix) {
    const numLocations = matrix.length;
  
    // Print column headers
    let header = '         '; // Extra spaces for alignment
    for (let j = 0; j < numLocations; j++) {
      header += `Location ${j}    `;
    }
    console.log(header);
  
    // Print the matrix rows
    for (let i = 0; i < numLocations; i++) {
      let row = `Location ${i}  `;
      for (let j = 0; j < numLocations; j++) {
        row += `${matrix[i][j].toFixed(2)} km    `;
      }
      console.log(row);
    }
}

async function main(){
await createDistanceMatrix()
saveDistanceMatrixToFile(distanceMatrix, 'distance_matrix2.json');
printDistanceMatrix(distanceMatrix);
createOpitimizeMatrix()
printDistanceMatrix(distanceMatrix);
}



  
//   // Call the function to print the distanceMatrix in matrix format
//   printDistanceMatrix(distanceMatrix);

main()