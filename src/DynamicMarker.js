import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents ,createContext} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import customMarkerIcon from './custom-marker.png';
import L, { latLng } from 'leaflet';
import axios from 'axios'; // Import Axios




function DynamicMarker() {
  
   const [markers, setMarkers] = useState([[33.876118, -117.921410]]);
  

  const addMarker = (latlng) => {
    const newMarker = latlng;
    setMarkers([...markers, newMarker]);
  };
  console.log(markers);
  

  const customIcon = L.icon({
    iconUrl: customMarkerIcon,
    iconSize: [32, 32], // Adjust the size as needed
    iconAnchor: [16, 32], // Position the anchor point at the bottom center
  });

  // Custom hook to handle map click events
  function MapClickEvents() {
    const map = useMapEvents({
      click: (e) => {
        addMarker(e.latlng);
          //check if marker is on route
        

      },
    });
    return null;
  }
  

  // send data to nodejs

  const sendDataToNode = () => {
    // Make an HTTP POST request to the Node.js API endpoint
    axios.post('/api/receiveData', { data: markers })
      .then((response) => {
        console.log('Response from Node.js:', response.data);
        // Handle the response from the server
      })
      .catch((error) => {
        console.error('Error sending data to Node.js:', error);
        // Handle errors
      });
  };



  
  return (
    <>
    <MapContainer center={[33.8761, -117.9214]} zoom={10} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      {markers.map((position, idx) => (
        <Marker key={`marker-${idx}`} position={position} icon={customIcon}>
          <Popup>
            <span>Home <br /> </span>
          </Popup>
        </Marker>
      ))}
      <MapClickEvents /> {/* Custom hook to handle map click events */}
    </MapContainer>


<div>
<button onClick={sendDataToNode}>Send Data to Node.js</button>
</div>
</>
    

  );




  
}

export default DynamicMarker;
