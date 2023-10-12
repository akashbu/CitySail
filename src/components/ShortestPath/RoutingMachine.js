import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

function RoutingMachine({ from, to, isBlocked }) {
  const map = useMap();

  useEffect(() => {
    let routingControl;
    if (from && to) {
      const lineColor = isBlocked ? 'red' : 'blue';
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

    return () => map.eachLayer(layer => {
      if (layer instanceof L.Routing.Control) {
        map.removeLayer(layer);
      }
    });
  }, [map, from, to]);

  return null;
}

export default RoutingMachine;