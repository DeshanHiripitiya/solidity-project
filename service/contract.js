const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const abi = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../contract.json'), 'utf8')
);

const contractAddress = process.env.CONTRACT_ADDRESS;

const wsProvider = new Web3.providers.WebsocketProvider(process.env.WS_RPC_URL);
const wsWeb3 = new Web3(wsProvider);

const httpWeb3 = new Web3(process.env.RPC_URL);

wsProvider.on('connect', () => {
  console.log('WebSocket connected successfully');
});

wsProvider.on('error', (error) => {
  console.error('WebSocket connection error:', error);
});

wsProvider.on('end', () => {
  console.log('WebSocket connection ended');
});

const account = httpWeb3.eth.accounts.privateKeyToAccount(
  process.env.PRIVATE_KEY
);

httpWeb3.eth.accounts.wallet.add(account);
httpWeb3.eth.defaultAccount = account.address;

wsWeb3.eth.accounts.wallet.add(account);
wsWeb3.eth.defaultAccount = account.address;

// console.log('contractAddress', contractAddress);

const httpContract = new httpWeb3.eth.Contract(abi, contractAddress);
const wsContract = new wsWeb3.eth.Contract(abi, contractAddress);

module.exports = { httpWeb3, httpContract, wsContract, account, wsWeb3 };
