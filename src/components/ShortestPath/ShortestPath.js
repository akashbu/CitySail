import React from "react";
import "./ShortestPath.css";
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
import RoutingMachine from "./RoutingMachine";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Creating a custom marker icon for the map
const customMarkerIcon = new L.Icon({
  iconUrl: icon,
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 32], // Anchor point of the icon
  popupAnchor: [0, -32], // Popup anchor point
});

// List of locations with their respective coordinates
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

// Main component for shortest path calculation
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
  const [intermediates, setIntermediates] = useState({});
  const [path, setPath] = useState([]);
  const [alertBox, setAlertBox] = useState(false);
  const [successful, setSucessful] = React.useState(false);
  const [same, setSame] = React.useState(false);
  const [info, setInfo] = useState(false);
  const [blockedLocations, setBlockedLocations] = useState([]);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [blockedPaths, setBlockedPaths] = useState([]);

  // Function to open the first dialog box
  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  // Function to open the second dialog box
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  // Functions to close dialog boxes
  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

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

  // Fetch data from the server and set up the distance matrix
  useEffect(() => {
    async function fetchDataFromServer() {
      const apiUrl = "https://map-project-qf27.onrender.com/data"; // Replace 'items' with your resource name

      const jsonData = localStorage.getItem("distanceMatrix");

      if (jsonData) {
        const data = JSON.parse(jsonData);
        setDistanceMatrix(data);
        findUnreachableLocations(data);
        createOptimizeMatrix(data);
      } else {
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

    function findUnreachableLocations(matrix) {
      const pairs = [];
      matrix.forEach((row, i) => {
        row.forEach((value, j) => {
          if (value === 999) {
            pairs.push({
              source: locations[i].name,
              destination: locations[j].name,
            });
          }
        });
      });

      setBlockedLocations(pairs);
    }

    fetchDataFromServer();
  }, []);

  // Function to create an optimized distance matrix using Floyd-Warshall algorithm
  function createOptimizeMatrix(matrix) {
    const newIntermediates = {};
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
            const key = `${locations[i].name}-${locations[j].name}`;
            newIntermediates[key] = locations[k].name;
          }
        }
      }
    }

    // console.log("Intermediate Nodes", newIntermediates);
    setIntermediates(newIntermediates);
    setOptimizedDistanceMatrix(optimizedMatrix); // Update the optimized matrix state
  }

  // console.log("Distance Matrix:");
  // printDistanceMatrix(distanceMatrix);

  // console.log("Optimized Matrix");
  // printDistanceMatrix(optimizedDistanceMatrix);

  // Update path whenever selected locations change
  useEffect(() => {
    if (
      selectedLocations.source?.label &&
      selectedLocations.destination?.label
    ) {
      // const sourceName = selectedLocations.source?.label
      // const destinationName = selectedLocations.destination?.label
      const sourceLocation = locations.find(
        (loc) => loc.name === selectedLocations.source?.label
      );
      const destinationLocation = locations.find(
        (loc) => loc.name === selectedLocations.destination?.label
      );
      const intermediateKey = `${sourceLocation.name}-${destinationLocation.name}`;

      if (intermediates[intermediateKey]) {
        const intermediateLocation = locations.find(
          (loc) => loc.name === intermediates[intermediateKey]
        );
        setPath([
          { lat: sourceLocation.lat, lon: sourceLocation.lon },
          { lat: intermediateLocation.lat, lon: intermediateLocation.lon },
          { lat: destinationLocation.lat, lon: destinationLocation.lon },
        ]);
      } else {
        setPath([
          { lat: sourceLocation.lat, lon: sourceLocation.lon },
          { lat: destinationLocation.lat, lon: destinationLocation.lon },
        ]);
      }
    }
  }, [selectedLocations, intermediates]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertBox(false);
    setSucessful(false);
    setSame(false);
  };

  // Function to calculate the shortest path when the "Calculate Shortest Path" button is clicked
  const calculateShortestPath = () => {
    const sourceName = sourceRef.current?.label;
    const destinationName = destinationRef.current?.label;

    if (sourceName && destinationName) {
      if (sourceName === destinationName) {
        setSame(true);
        return;
      }

      setPath([]);
      setSelectedLocations({
        source: sourceRef.current,
        destination: destinationRef.current,
      });
      setSucessful(true);
      setInfo(true);
    } else {
      setAlertBox(true);
    }
  };

  const refreshButton = () => {
    window.location.href = "/maps";
  };

  // Update blocked paths when blocked locations change
  useEffect(() => {
    const blockedPaths = blockedLocations.map((blocked) => {
      const source = locations.find((loc) => loc.name === blocked.source);
      const destination = locations.find(
        (loc) => loc.name === blocked.destination
      );
      return {
        from: [source.lat, source.lon],
        to: [destination.lat, destination.lon],
      };
    });

    setBlockedPaths(blockedPaths);
  }, [blockedLocations]);

  return (
    <div className="container">
      <div className="top-container">
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
            {/* Iterating over the locations and placing markers on the map */}
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={[location.lat, location.lon]}
                icon={customMarkerIcon}
              >
                <Popup>{location.name}</Popup>
              </Marker>
            ))}

            {blockedPaths?.map((blockedPath, index) => (
              <RoutingMachine
                key={index}
                from={blockedPath.from}
                to={blockedPath.to}
                isBlocked={true} // Pass true to set the color to red
              />
            ))}
            {/* Displaying the calculated shortest path on the map */}
            {path.length > 1 && (
              <>
                <RoutingMachine
                  from={[path[0].lat, path[0].lon]}
                  to={[path[1].lat, path[1].lon]}
                />
                {path.slice(1, -1).map((point, index) => (
                  <RoutingMachine
                    key={index}
                    from={[point.lat, point.lon]}
                    to={[path[index + 2].lat, path[index + 2].lon]}
                    isBlocked={false}
                  />
                ))}
              </>
            )}
          </MapContainer>
        </div>
        <div className="autocomplete-container">
          <div className="top-autocomplete">
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
            {/* Button to calculate the shortest path */}
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={calculateShortestPath}
            >
              Calculate Shortest Path
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={refreshButton}
            >
              Refresh
            </Button>
          </div>
          {/* Information container to display details of the calculated path */}
          {info && (
            <div
              className="info-container"
              style={{
                width: "100%",
                border: "1px solid lightgrey",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h3>
                <u>Details</u>
              </h3>
              <p>
                <strong>Source:</strong> {selectedLocations.source?.label}
              </p>
              <p>
                <strong>Destination:</strong>{" "}
                {selectedLocations.destination?.label}
              </p>
              {path.length > 2 && (
                <p>
                  <strong>Intermediate Node:</strong>{" "}
                  {
                    locations.find(
                      (loc) =>
                        loc.lat === path[1].lat && loc.lon === path[1].lon
                    )?.name
                  }
                </p>
              )}
              {optimizedDistanceMatrix.length > 0 &&
                selectedLocations.source &&
                selectedLocations.destination && (
                  <p>
                    <strong>Total Distance:</strong>{" "}
                    {optimizedDistanceMatrix[
                      locations.findIndex(
                        (loc) => loc.name === selectedLocations.source.label
                      )
                    ][
                      locations.findIndex(
                        (loc) =>
                          loc.name === selectedLocations.destination.label
                      )
                    ].toFixed(2)}{" "}
                    km
                  </p>
                )}

              {blockedLocations.length > 0 && (
                <div className="blocked-locations-container">
                  <h3>
                    <u>Blocked Paths</u>
                  </h3>
                  {blockedLocations.map((blocked, index) => (
                    <p key={index}>
                      <strong>Path {index + 1}:</strong> {blocked.source} -{" "}
                      {blocked.destination}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-container">
        <Button variant="outlined" color="primary" onClick={handleClickOpen1}>
          View Distance Matrix
        </Button>
        {/* Dialog to display the distance matrix */}
        <Dialog
          open={open1}
          onClose={handleClose1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          fullWidth={true}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            {"Distance Matrix"}
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Location
                    </TableCell>
                    {locations.map((location, index) => (
                      <TableCell
                        key={index}
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        {location.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {distanceMatrix.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        {locations[rowIndex].name}
                      </TableCell>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          style={{ color: cell === 999 ? "red" : "inherit" }}
                        >
                          {parseFloat(cell).toFixed(2)} km
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose1} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="bottom-container2">
        <Button variant="outlined" color="primary" onClick={handleClickOpen2}>
          View Optimize Matrix
        </Button>
        {/* Dialog to display the optimized distance matrix */}
        <Dialog
          open={open2}
          onClose={handleClose2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xl"
          fullWidth={true}
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            {"Optimize Distance Matrix"}
          </DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      Location
                    </TableCell>
                    {locations.map((location, index) => (
                      <TableCell
                        key={index}
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        {location.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optimizedDistanceMatrix.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell
                        style={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                        }}
                      >
                        {locations[rowIndex].name}
                      </TableCell>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {parseFloat(cell).toFixed(2)} km
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Snackbar notifications for errors and success messages */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={alertBox}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Please select both source and destination!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={same}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Please select different Source and Destination!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={successful}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Calculated shortest route between {selectedLocations.source?.label} -{" "}
          {selectedLocations.destination?.label}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ShortestPath;
