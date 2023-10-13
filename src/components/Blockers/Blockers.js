import React from "react";
import Marquee from "react-fast-marquee";
import img1 from "../../image/accident1.png";
import img2 from "../../image/blocker.png";
import img3 from "../../image/accident.png";
import img4 from "../../image/crash.png";
import img5 from "../../image/roadblocker.png";
import img6 from "../../image/crash1.png";
import img7 from "../../image/slip.png";
import img8 from "../../image/fire.png";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import "./Blocker.css";
import axios from "axios";
import Alert from "@mui/material/Alert";

// Sample location data
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

// Sample Autocomplete options
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

const Blockers = () => {
  const [open, setOpen] = React.useState(false);
  const [report, setReport] = React.useState(false);
  const [same, setSame] = React.useState(false);
  const [clear, setClear] = React.useState(false);
  const sourceRef = useRef();
  const destinationRef = useRef();
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState({
    source: null,
    destination: null,
  });

  // Handler for closing snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setReport(false);
    setSame(false);
    setClear(false);
  };

  useEffect(() => {
    // Function to fetch data from server
    async function fetchDataFromServer() {
      const apiUrl = "https://map-project-qf27.onrender.com/data"; // Replace 'items' with your resource name

      const jsonData = localStorage.getItem("distanceMatrix");

      if (jsonData) {
        const data = JSON.parse(jsonData);
        setDistanceMatrix(data);
      } else {
        try {
          const response = await axios.get(apiUrl);
          const data = response.data; // This contains the retrieved data
          setDistanceMatrix(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }

    fetchDataFromServer();
  }, []);

  // Function to report blockage
  const reportBlockage = async () => {
    const sourceName = sourceRef.current?.label;
    const destinationName = destinationRef.current?.label;

    if (sourceName && destinationName) {
      const sourceId = locations.find(
        (location) => location.name === sourceName
      )?.id;
      const destinationId = locations.find(
        (location) => location.name === destinationName
      )?.id;

      if (sourceId === destinationId) {
        setSame(true);
        return;
      }

      if (sourceId !== undefined && destinationId !== undefined) {
        setSelectedLocations({
          source: sourceName,
          destination: destinationName,
        });

        console.log("Source ID:", sourceId);
        console.log("Destination ID:", destinationId);
      } else {
        console.error("Location not found!");
      }

      distanceMatrix[sourceId][destinationId] = 999;
      console.log(distanceMatrix);

      const distanceMatrixJSON = JSON.stringify(distanceMatrix);
      localStorage.setItem("distanceMatrix", distanceMatrixJSON);
      console.log("Distance matrix saved to local storage.");
      setReport(true);
    } else {
      setOpen(true);
      console.error("Please select both source and destination!");
    }
  };

  // Function to clear blockage
  const clearBlockage = () => {
    localStorage.removeItem("distanceMatrix");
    setClear(true);
  };

  console.log(distanceMatrix);

  return (
    <div className="blocker">
      <div className="marquee">
        <Marquee gradient={true} pauseOnHover={true} delay={1}>
          <div className="image-wrapper">
            <img src={img1} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img2} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img4} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img7} height={300} width={300} alt="" />
          </div>
          <div>
            <h1>REPORT BLOCKAGE HERE</h1>
          </div>
          <div className="image-wrapper">
            <img src={img3} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img6} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img5} height={300} width={300} alt="" />
          </div>
          <div className="image-wrapper">
            <img src={img8} height={300} width={300} alt="" />
          </div>
        </Marquee>
      </div>
      <div className="autocomplete-container-blocker">
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
      </div>
      <div className="buttonclass">
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={reportBlockage}
        >
          Report
        </Button>
      </div>
      <div className="buttonerror">
        <Button
          variant="outlined"
          size="large"
          color="error"
          onClick={clearBlockage}
        >
          Clear All Blockage
        </Button>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={open}
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
        open={report}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Blockage Reported from {selectedLocations.source} -{" "}
          {selectedLocations.destination}
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
          severity="warning"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Please Select Different Source and Destination!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={clear}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%", fontSize: "1.3em" }}
        >
          Cleared All Bloackages
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Blockers;
