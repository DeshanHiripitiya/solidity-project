const express = require('express');
const router = express.Router();

const {
  httpContract,
  account,
} = require('../service/contract');

router.get('/', async (req, res) => {
  const message = await httpContract.methods.getMessage().call();
  console.log('Current message:', message);

  return res.status(200).json({
    status: true,
    message: message  ,
  });
});

router.post('/create', async (req, res) => {
  const tx = await httpContract.methods
    .setMessage('hello nadun')
    .send({
      from: account.address,
      gas: 100000,
    });

  console.log('Message updated! TX Hash:', tx.transactionHash);

  return res.status(200).json({
    status: true,
    txHash: tx.transactionHash,
  });
});

module.exports = router;
