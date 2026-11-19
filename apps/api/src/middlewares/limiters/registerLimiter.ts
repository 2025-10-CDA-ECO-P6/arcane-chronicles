import { createRateLimiter } from './rateLimiter.js';

export const registerLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: 'Too many registration attempts, please try again later',
});
