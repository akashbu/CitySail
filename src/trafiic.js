// import React from 'react';
// import { MapContainer, TileLayer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import TomTom from 'tomtom-sdk';
// import { TomTomTrafficFlowTiles } from 'tomtom-sdk';

// function showTraffic() {
//   const tomtomApiKey = 'P7oCgBtaHN6YQGrRIdV3jrikRJpi1q1X';

//   // Initialize the map
//   const center = [51.505, -0.09];
//   const zoom = 13;

//   return (
//     <MapContainer center={center} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
//       {/* TomTom Traffic Flow Layer */}
//       <TomTom.Layer.TrafficFlowTiles
//         apiKey={tomtomApiKey}
//         style={{ zIndex: 10 }}
//       />

//       {/* Standard Tile Layer */}
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//     </MapContainer>
//   );
// }

// export default showTraffic;
