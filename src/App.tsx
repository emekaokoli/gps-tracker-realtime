import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import { useEffect, useState } from 'react';

function App() {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => ws.send(JSON.stringify({ trackDriverId: 'driver-123' }));
    ws.onmessage = (e) => {
      try {
        const { lat, lng } = JSON.parse(e.data);
        if (typeof lat === 'number' && typeof lng === 'number') {
          setPosition([lat, lng]);
        }
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <MapContainer center={position} zoom={30} scrollWheelZoom={false} style={{ height: "100vh", width: "100vw" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Popup with driver location
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default App
