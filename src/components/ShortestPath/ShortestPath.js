import React from "react";
import './ShortestPath.css'; 
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet library
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import icon from "leaflet/dist/images/marker-icon.png";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";

// Create a custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon
  popupAnchor: [0, -32], // Popup anchor point
});

const locations = [
  { id: 0, name: "Fullerton", lat: 33.8704, lon: -117.9242 },
  { id: 1, name: "Long Beach", lat: 33.77005, lon: -118.193741 },
  { id: 2, name: "Brea", lat: 33.915279, lon: -117.888207 },
  { id: 3, name: "Placentia", lat: 33.871075, lon: -117.862755 },
  { id: 4, name: "Yorba Linda", lat: 33.888531, lon: -117.82431 },
  { id: 5, name: "Buena Park", lat: 33.86911, lon: -117.993952 },
  { id: 6, name: "Cerritos", lat: 33.862607, lon: -118.052657 },
  { id: 7, name: "Anaheim", lat: 33.836594, lon: -117.914299 },
  { id: 8, name: "Norwalk", lat: 33.91378, lon: -118.070099 },
  { id: 9, name: "Bellflower", lat: 33.881683, lon: -118.117012 },
  { id: 10, name: "La Mirada", lat: 33.908989, lon: -118.009949 },
  { id: 11, name: "Lakewood", lat: 33.853626, lon: -118.133957 },
  { id: 12, name: "Los Alamitos", lat: 33.80497, lon: -118.0718 },
  { id: 13, name: "Seal Beach", lat: 33.741409, lon: -118.104767 },
  { id: 14, name: "La Habra", lat: 33.931858, lon: -117.946136 },
  { id: 15, name: "Garden Grove", lat: 33.774269, lon: -117.937996 },
  { id: 16, name: "Santa Ana", lat: 33.745472, lon: -117.867653 },
  { id: 17, name: "Carson", lat: 33.82782, lon: -118.272346 },
  { id: 18, name: "Chino Hills", lat: 33.9912, lon: -117.760861 },
  { id: 19, name: "Diamond Bar", lat: 34.02649, lon: -117.810264 },
];

const list = [
  { label: "Fullerton" },
  { label: "Long Beach" },
  { label: "Brea" },
  { label: "Placentia" },
  { label: "Yorba Linda" },
  { label: "Buena Park" },
  { label: "Cerritos" },
  { label: "Anaheim" },
  { label: "Norwalk" },
  { label: "Bellflower" },
  { label: "La Mirada" },
  { label: "Lakewood" },
  { label: "Los Alamitos" },
  { label: "Seal Beach" },
  { label: "La Habra" },
  { label: "Garden Grove" },
  { label: "Santa Ana" },
  { label: "Carson" },
  { label: "Chino Hills" },
  { label: "Diamond Bar" },
];

const ShortestPath = () => {
  const constantPositions = [[33.8704, -117.9242]];
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [optimizedDistanceMatrix, setOptimizedDistanceMatrix] = useState([]);
  const sourceRef = useRef();
  const destinationRef = useRef();
  const [selectedLocations, setSelectedLocations] = useState({
    source: null,
    destination: null,
  });

  function printDistanceMatrix(matrix) {
    const numLocations = matrix.length;

    // Print column headers
    let header = "         "; // Extra spaces for alignment
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

  useEffect(() => {
    async function fetchDataFromServer() {
      const apiUrl = "http://localhost:5000/data"; // Replace 'items' with your resource name
    
      const jsonData = localStorage.getItem('distanceMatrix');

      if (jsonData){
        const data = JSON.parse(jsonData);
        setDistanceMatrix(data);
        createOptimizeMatrix(data);
      }else{
      try {
        const response = await axios.get(apiUrl);
        const data = response.data; // This contains the retrieved data
        setDistanceMatrix(data);
        createOptimizeMatrix(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    }

    fetchDataFromServer();
  }, []);

  function createOptimizeMatrix(matrix) {
    const numLocations = matrix.length;
    const optimizedMatrix = JSON.parse(JSON.stringify(matrix)); // Create a deep copy of the matrix

    for (let k = 0; k < numLocations; k++) {
      for (let i = 0; i < numLocations; i++) {
        for (let j = 0; j < numLocations; j++) {
          if (
            optimizedMatrix[i][k] + optimizedMatrix[k][j] <
            optimizedMatrix[i][j]
          ) {
            optimizedMatrix[i][j] =
              optimizedMatrix[i][k] + optimizedMatrix[k][j];
          }
        }
      }
    }

    setOptimizedDistanceMatrix(optimizedMatrix); // Update the optimized matrix state
  }

  console.log("Distance Matrix:");
  printDistanceMatrix(distanceMatrix);

  console.log("Optimized Matrix");
  printDistanceMatrix(optimizedDistanceMatrix);

  const calculateShortestPath = () => {
    setSelectedLocations({
      source: sourceRef.current,
      destination: destinationRef.current,
    });
  };

  console.log(selectedLocations.source, selectedLocations.destination);

//   if (
//     selectedLocations.source &&
//     selectedLocations.source.label === "Fullerton"
//   ) {
//     console.log("True");
//   }


  return (
    <div className="container">
      <div className="map-container">
        <MapContainer
          center={constantPositions[0]}
          zoom={11}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=GSifio1YoG2l3lcMqzrJ"
          />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.lat, location.lon]}
              icon={customMarkerIcon}
            >
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="autocomplete-container">
        <Autocomplete
          disablePortal
          id="source-auto"
          options={list}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Source" />}
          onChange={(event, newValue) => {
            sourceRef.current = newValue;
          }}
        />
        <Autocomplete
          disablePortal
          id="destination-auto"
          options={list}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Destination" />
          )}
          onChange={(event, newValue) => {
            destinationRef.current = newValue;
          }}
        />
        <Button variant="outlined" color="primary" size="large" onClick={calculateShortestPath}>
          Calculate Shortest Path
        </Button>
      </div>
    </div>
  );
};

export default ShortestPath;
