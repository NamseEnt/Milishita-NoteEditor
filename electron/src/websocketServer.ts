import ws from 'ws';

const websocketServer = new ws.Server({
  port: 1235,
});

websocketServer.on('listening', () => {
  console.log(`Websocket server running at ${websocketServer.options.port}`);
});

export default websocketServer;
