const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { setupWebSocket } = require('./service/socket');
const { wsContract, wsWeb3 } = require('./service/contract');
const { broadcastMessage } = require('./service/socket');

app.use(cors());
app.use(express.json());

const server = http.createServer(app); 

app.use('/message', require('./routes/message.router'));

setupWebSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

wsWeb3.eth.net
  .isListening()
  .then(async () => {
    const eventSub = await wsContract.events.updateMessageEvent({
      fromBlock: 'latest',
    });

    if (eventSub && typeof eventSub.on === 'function') {
      console.log('Subscribing to updateMessageEvent...');

      eventSub.on('data', (event) => {
        console.log('Event Received!');
        console.log('Message:', event.returnValues.myMessage);
        console.log('TX Hash:', event.transactionHash);
        console.log('Block Number:', event.blockNumber);
        broadcastMessage(event.returnValues.myMessage)
      });
      eventSub.on('error', (err) => {
        console.error('Error while listening to event:', err);
      });
    } else {
      console.error('Failed to initialize event subscription');
    }
  })
  .catch((err) => {
    console.error('WebSocket connection failed:', err);
  });
