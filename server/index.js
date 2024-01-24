import express from 'express';
import { createServer } from 'http';

import { handler } from './handler.js';
import { initWsServer, initDbListener } from './socket.js';

const port = process.env.HOTLOGGER_PORT || 3000;
const app = express();
const server = createServer(app);

initWsServer(server);

server.on('listening', () => {
    const addr = server.address();
    initDbListener('localhost', addr.port);
});

app.use(handler);
server.listen(port);