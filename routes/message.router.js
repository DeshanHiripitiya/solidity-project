const express = require('express');
const router = express.Router();

const { httpContract, account } = require('../service/contract');
const { broadcastMessage } = require('../service/socket');

router.get('/', async (req, res) => {
  const message = await httpContract.methods.getMessage().call();
  console.log('Current message:', message);

  return res.status(200).json({
    status: true,
    message: message,
  });
});

router.post('/create', async (req, res) => {
  const message = 'hello new message';
  const tx = await httpContract.methods.setMessage(message).send({
    from: account.address,
    gas: 100000,
  });

  await broadcastMessage(message);

  console.log('Message updated! TX Hash:', tx.transactionHash);

  return res.status(200).json({
    status: true,
    txHash: tx.transactionHash,
  });
});

module.exports = router;
