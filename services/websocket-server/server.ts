import WebSocket from 'ws';
import redis from '../../utils/redis';

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map<string, WebSocket>();

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    try {
      const { trackDriverId } = JSON.parse(msg.toString());
      if (trackDriverId) clients.set(trackDriverId, ws);
    } catch (_) {}
  });
});

(async () => {
  const sub = redis.duplicate();
  await sub.connect();
  await sub.subscribe('driver_location_updates', (message) => {
    const { driverId } = JSON.parse(message);
    const client = clients.get(driverId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
})();
