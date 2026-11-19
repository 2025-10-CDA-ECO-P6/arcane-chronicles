import type { Server as HttpServer } from 'node:http';

import { Server } from 'socket.io';

export function initSockets(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  return io;
}
