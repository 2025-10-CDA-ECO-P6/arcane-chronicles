import type { Request, Response } from 'express';
import { type Options, rateLimit, type RateLimitInfo } from 'express-rate-limit';

const WINDOW_MS = 15 * 60 * 1000;

const getRetryAfterSeconds = (req: Request) => {
  const { resetTime } = (req as Request & { rateLimit?: RateLimitInfo }).rateLimit ?? {};
  const remainingMs = resetTime ? resetTime.getTime() - Date.now() : WINDOW_MS;
  return Math.max(1, Math.ceil(remainingMs / 1000));
};

export const loginLimiter = rateLimit({
  windowMs: WINDOW_MS,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req: Request, res: Response, _next: unknown, options: Options) => {
    res.status(options.statusCode).json({
      message: 'Too many login attempts, please try again later',
      retryAfter: getRetryAfterSeconds(req),
    });
  },
});
