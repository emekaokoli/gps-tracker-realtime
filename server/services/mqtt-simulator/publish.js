const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

const driverId = 'driver-123';
setInterval(() => {
  const lat = 6.4 + Math.random() * 0.1;
  const lng = 3.4 + Math.random() * 0.1;
  const payload = JSON.stringify({ driverId, lat, lng });
  client.publish('driver/gps', payload);
}, 4000);
