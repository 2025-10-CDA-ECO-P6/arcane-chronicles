import { createRateLimiter } from './rateLimiter.js';

export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true,
});
