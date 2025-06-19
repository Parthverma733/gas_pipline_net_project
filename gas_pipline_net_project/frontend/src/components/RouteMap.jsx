import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import './RouteMap.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});
const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const handleChange = (e) => {
  setCost(Number(e.target.value));
};
// Routing component with cleanup
const Routing = ({ routes }) => {
  const map = useMapEvents({});
  useEffect(() => {
    if (!routes || routes.length === 0) return;

    const controls = routes.map((route) =>
      L.Routing.control({
        waypoints: route.map(([lng, lat]) => L.latLng(lat, lng)),
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        show: false,
        createMarker: () => null, // hide default routing markers
      }).addTo(map)
    );

    // Cleanup on rerender or unmount
    return () => {
      controls.forEach(ctrl => map.removeControl(ctrl));
    };
  }, [map, routes]);

  return null;
};

// Map click handler
const ClickHandler = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

const RouteMap = () => {
  const [routes, setRoutes] = useState([]);
  const [userCoords, setUserCoords] = useState([]);
  const [stationCoords, setStationCoords] = useState([]);
  const [flag, setFlag] = useState(0);
  const [cost, setCost] = useState('');
  const [result, setResult] = useState('');

  // Fetch MST routes from backend
  const fetchRoutes = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/map-get');
      const data = await res.json();
      setResult(data["optimizeDistance"])
      setRoutes(data["routes"]);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Add marker on map click
  const handleMapClick = (coords) => {
    if (flag == 2) {
      setUserCoords((prev) => [...prev, coords]);
    } else if (flag == 1) {
      setStationCoords((prev) => [...prev, coords]);
    }
  };

  // Send coordinates to backend
  const handleSendToBackend = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/map-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coordinates: userCoords, stationCoordinates: stationCoords })
      });

      const data = await res.json();
      console.log('Response:', data);
      alert("Coordinates sent successfully!");

      // Fetch updated MST routes
      fetchRoutes();
    } catch (err) {
      console.error('Error sending coordinates:', err);
    }
  };

  const handleClear = () => {
    setUserCoords([]);
    setStationCoords([]);
    setRoutes([]);
  };

  return (
    <>
      <div className="map-component">
        <MapContainer center={[40.7128, -74.0060]} zoom={25} style={{ height: '90vh', width: '100%' }} className='map'>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            errorTileUrl="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; Esri & OpenStreetMap contributors'
          />


          <ClickHandler onClick={handleMapClick} />

          {/* Show MST route endpoints */}
          {routes?.map((route, i) => (
            <React.Fragment key={i}>
              <Marker position={route[0]} />
              <Marker position={route[1]} />
            </React.Fragment>
          ))}


          {userCoords.map((pos, idx) => (
            <Marker key={`user-${idx}`} position={pos} />
          ))}
          {stationCoords.map((pos, idx) => (
            <Marker key={`user-${idx}`} position={pos} icon={orangeIcon} />
          ))}

          <Routing routes={routes} />
        </MapContainer>
        <div className="right-sidebar">

          <div className="select-coor" >
            <h3>MAP VEIW</h3>
            <button onClick={() => setFlag(1)} className='station-btn'>Set Station</button>
            <button onClick={() => setFlag(2)} className='house-btn'>Set House</button>
          </div>
          <div className="set-cost">
            <h3>Set Cost For Setting Pipeline</h3>
            <h4>Cost Per Distance in meters :</h4>

            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
            <br /><br />
            <h3>Total optimize Cost For Setting Pipeline</h3>
            <input
              type="number"
              value={cost && result ? (result * cost).toFixed(2) : ''}
              readOnly
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />

          </div>

          <div className="total-cost">

          </div>


          <div className='bottom-btns-div'>
            <button onClick={handleSendToBackend} className='optimize-route-btn'>Get Optimize Routes</button>
            <button onClick={handleClear} className='clear-map-btn'>Clear Map</button>
          </div>

          <div className="map-icons">
            <div className="station-icon"><FontAwesomeIcon icon={faLocationDot} style={{ color: 'orange', fontSize: '70px' }} />
              <p>Gas Station</p>
            </div>
            <div className="house-icon"><FontAwesomeIcon icon={faLocationDot} style={{ color: 'blue', fontSize: '70px' }} />
              <p>House</p>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default RouteMap;
