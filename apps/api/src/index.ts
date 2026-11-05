import { createServer } from 'node:http';

import app from './config.js';
import { logger } from './lib/logger.js';
import { initSockets } from './sockets/index.js';

const port = Number(process.env.PORT ?? 4000);

const httpServer = createServer(app);

initSockets(httpServer);

httpServer.listen(port, () => {
  logger.info(`API à l'écoute sur le port ${port}`);
});
