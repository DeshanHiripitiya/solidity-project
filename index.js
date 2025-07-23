const cors = require('cors');
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { setupWebSocket } = require('./service/socket');
const { initializeWebSocketProvider } = require('./service/contract');
const { broadcastMessage } = require('./service/socket');
const { Console } = require('console');

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

app.use('/message', require('./routes/message.router'));

setupWebSocket(server);

let wsProvider, wsContract;

server.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

// Wait for provider to be ready
// const initializeContractEvents = async () => {
//   try {
//     console.log('Initializing WebSocket connection...');
//     console.log(wsProvider.websocket._readyState);
//     await new Promise((res) => setTimeout(res, 1000));

//     console.log('Testing connection with getBlockNumber...');
//     try {
//       const blockNumberPromise = wsProvider.getBlockNumber();
//       const timeoutPromise = new Promise((_, reject) =>
//         setTimeout(
//           () => reject(new Error('getBlockNumber timeout after 15 seconds')),
//           15000
//         )
//       );

//       const blockNumber = await Promise.race([
//         blockNumberPromise,
//         timeoutPromise,
//       ]);
//       console.log('WebSocket connected. Current block:', blockNumber);
//     } catch (blockError) {
//       console.error('Failed to get block number:', blockError.message);
//       throw blockError;
//     }

//     // Log contract details for debugging
//     console.log('Contract address:', wsContract.target);

//     // Correct way to check available events
//     console.log('Available events:', Object.keys(wsContract.filters));

//     // List all available event fragments
//     const eventFragments = wsContract.interface.fragments.filter(
//       (f) => f.type === 'event'
//     );
//     console.log(
//       'Contract events:',
//       eventFragments.map((f) => f.name)
//     );
//     console.log('Subscribing to UpdateMessage event...');

//     // Listen for the contract event
//     wsContract.on('updateMessageEvent', async (message, event) => {
//       try {
//         console.log('Event Received!');
//         console.log('Event details:', {
//           message,
//           event: {
//             blockNumber: event.blockNumber,
//             transactionHash: event.transactionHash,
//             blockHash: event.blockHash,
//           },
//         });

//         // Your custom function
//         await broadcastMessage(message);
//       } catch (error) {
//         console.error('Error processing event:', error);
//       }
//     });

//     wsContract.on('*', (event) => {
//       console.log('Any event received:', event);
//     });

//     console.log('Event listeners set up successfully');

//     // Add error handler for the contract
//     // wsContract.on('error', (error) => {
//     //   console.error('Contract event error:', error);
//     // });
//   } catch (err) {
//     console.error('WebSocket connection failed:', err);
//     // Retry after 5 seconds
//     console.log('Retrying connection in 5 seconds...');
//     setTimeout(initializeContractEvents, 5000);
//   }
// };

// const waitForWebSocketConnection = async (
//   provider,
//   retries = 10,
//   delay = 2000
// ) => {
//   for (let i = 0; i < retries; i++) {
//     console.log(`Checking WebSocket connection... (${i + 1}/${retries})`);
//     try {
//       console.log(
//         'Attempting to get block number...',
//         provider.websocket._readyState
//       );
//       // await provider.getBlockNumber(); // succeeds if connected
//       if (!provider.websocket._readyState) {
//         console.log(provider.websocket._readyState);
//         await new Promise((resolve) => setTimeout(resolve, delay));
//         continue;
//       }
//       console.log('WebSocket provider is ready.');
//       return true;
//     } catch (err) {
//       console.log(`Waiting for wsProvider to connect... (${i + 1}/${retries})`);
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       console.log('Retrying connection...');
//     }
//   }
//   console.error('WebSocket provider not ready after retries.');
//   return false;
// };

(async () => {
  const result = await initializeWebSocketProvider();
  // wsProvider = result.wsProvider;
  // wsContract = result.wsContract;
  // console.log('WebSocket provider initialized:', wsProvider);
  // const ready = await waitForWebSocketConnection(wsProvider);
  // if (ready) {
  //   await initializeContractEvents();
  // } else {
  //   console.error('Failed to connect to WebSocket provider.');
  // }
})();
