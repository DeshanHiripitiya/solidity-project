const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let wsProvider, wsWallet, wsContract;

const abi = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../contract.json'), 'utf8')
);

const contractAddress = process.env.CONTRACT_ADDRESS;

const httpProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
const httpWallet = wallet.connect(httpProvider);
wsWallet = wallet.connect(wsProvider);
const httpContract = new ethers.Contract(contractAddress, abi, httpWallet);

async function initializeWebSocketProvider() {
  console.log('Initializing WebSocket provider...');
  wsProvider = new ethers.WebSocketProvider(process.env.WS_RPC_URL);
  wsWallet = wallet.connect(wsProvider);
  wsContract = new ethers.Contract(contractAddress, abi, wsWallet);

  // console.log('WebSocket provider initialized::::::::::::::::', wsProvider);

  wsProvider.websocket.onopen = () => {
    console.log(
      'WebSocket contract connected successfully++++++++++',
      wsProvider.websocket._readyState
    );
  };

  wsProvider.once('block', (blockNumber) => {
    console.log('Latest block (first one after connect):', blockNumber);
  });

  wsProvider.websocket.onerror = (error) => {
    console.error('WebSocket contract connection error:', error);
  };

  wsProvider.websocket.onclose = () => {
    console.log('WebSocket contract connection ended');
  };

  await new Promise((resolve) => setTimeout(resolve, 4000));
  // await testWebSocketConnection();

  return { wsProvider, wsContract };
}

// Function to test WebSocket connection
// async function testWebSocketConnection() {
//   console.log('Testing WebSocket connection...');
//   try {
//     if (!wsProvider) {
//       throw new Error('WebSocket provider not initialized');
//     }

//     console.log('Testing WebSocket connection...');
//     for (let i = 0; i < 10; i++) {
//     try {
//       console.log('waiting',i)
//       const block = await httpContract.getBlockNumber();
//       if (block > 0) return block;
//     } catch (e) {
//       console.log('Waiting for provider...',e);
//     }
//     await new Promise(res => setTimeout(res, 1000));
//   };
//     console.log('WebSocket test successful, current block:', blockNumber);
//     return true;
//   } catch (error) {
//     console.error('WebSocket connection test failed:', error.message);
//     return false;
//   }
// }

// Function to reconnect WebSocket
// async function reconnectWebSocket() {
//   try {
//     console.log('Attempting to reconnect WebSocket...');
    
//     // Clean up existing connection
//     if (wsProvider && wsProvider.websocket) {
//       wsProvider.websocket.close();
//     }

//     // Wait a bit before reconnecting
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Reinitialize
//     const result = await initializeWebSocketProvider();
//     wsProvider = result.wsProvider;
//     wsContract = result.wsContract;
    
//     console.log('WebSocket reconnected successfully');
//     return { wsProvider, wsContract };
    
//   } catch (error) {
//     console.error('WebSocket reconnection failed:', error);
//     throw error;
//   }
// }



// Listen for WebSocket connection events


// auto reconnect
// wsProvider.on('close', async (code) => {
//   console.warn(`WebSocket closed. Code: ${code}`);
//   console.log('Attempting to reconnect in 5 seconds...');
//   await new Promise((r) => setTimeout(r, 5000));
//   setupWebSocketProvider(); // Reconnect
// });



// console.log('contractAddress', contractAddress);




module.exports = {
  httpProvider,
  wsProvider,
  httpContract,
  wsContract,
  wallet,
  httpWallet,
  wsWallet,
  initializeWebSocketProvider,
};
