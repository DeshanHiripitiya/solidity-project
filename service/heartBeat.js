let isAlive = true;
const heartbeat = setInterval(() => {
  if (!isAlive) {
    console.warn('WebSocket unresponsive. Forcing reconnect...');
    wsProvider.destroy();
    setupWebSocketProvider();
  } else {
    isAlive = false;
    // you could also call a dummy method like getBlockNumber to test connection
    wsProvider
      .getBlockNumber()
      .then(() => {
        isAlive = true;
      })
      .catch((e) => {
        console.error('Ping failed:', e);
        isAlive = false;
      });
  }
}, 10000); // Every 10s
