// socket.js
const WebSocket = require('ws');

let wss = null;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}

const broadcastMessage = async (message) => {
  if (!wss) return;

  const payload = JSON.stringify(message);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

module.exports = { setupWebSocket, broadcastMessage };
