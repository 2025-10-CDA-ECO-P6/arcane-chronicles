import type { Server as HttpServer } from 'node:http';

import { Server } from 'socket.io';

// Gestionnaires d'événements temps réel (architecture.md §4), à ranger par
// domaine dans handlers/ : game:join, game:assign-hero, scene:change,
// element:reveal, hp:update, combat:start / combat:end, combat:initiative,
// turn:next, objective:validate, inventory:update, item:use, game:state.
export function initSockets(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      // À implémenter : marquer le participant comme DISCONNECTED.
    });
  });

  return io;
}
