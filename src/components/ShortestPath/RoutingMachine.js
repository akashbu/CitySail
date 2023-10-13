import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';


// RoutingMachine component for displaying routes on the map
function RoutingMachine({ from, to, isBlocked }) {
   // Using the useMap hook to get access to the map instance
  const map = useMap();

  // useEffect hook to add the routing control to the map when 'from' and 'to' props are updated
  useEffect(() => {
    let routingControl;
    if (from && to) {
      const lineColor = isBlocked ? 'red' : 'blue';

       // Creating and adding the routing control to the map
        routingControl = L.Routing.control({
        waypoints: [
          L.latLng(from[0], from[1]),
          L.latLng(to[0], to[1])
        ],
        routeWhileDragging: true,
        createMarker: () => { return null; },
        lineOptions: {
            styles: [{color: lineColor, opacity: 1, weight: 5}]
          },
      }).addTo(map);

      routingControl._container.style.display = 'none'; 
    }

    // Cleanup function to remove the routing control from the map when the component unmounts or the 'from' and 'to' props change
    return () => map.eachLayer(layer => {
      if (layer instanceof L.Routing.Control) {
        map.removeLayer(layer);
      }
    });
  }, [map, from, to]);// Dependencies of the useEffect hook

  return null;
}

export default RoutingMachine;