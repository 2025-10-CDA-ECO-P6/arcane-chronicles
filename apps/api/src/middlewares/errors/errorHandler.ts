import type { NextFunction, Request, Response } from 'express';

import { logger } from '../../lib/logger.js';

interface ClientError extends Error {
  status: number;
  expose?: boolean;
}

const isClientError = (err: unknown): err is ClientError =>
  err instanceof Error &&
  'status' in err &&
  typeof err.status === 'number' &&
  err.status >= 400 &&
  err.status < 500;

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (isClientError(err)) {
    logger.warn({ err, path: req.path }, 'Client error');
    res.status(err.status).json({ message: err.expose ? err.message : 'Bad request' });
    return;
  }

  logger.error({ err, path: req.path }, 'Unhandled error');
  res.status(500).json({ message: 'Internal server error' });
}
