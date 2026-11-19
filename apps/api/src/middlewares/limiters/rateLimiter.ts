import type { Request, Response } from 'express';
import { type Options, rateLimit, type RateLimitInfo } from 'express-rate-limit';

interface RateLimiterOptions {
  windowMs: number;
  limit: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

const getRetryAfterSeconds = (req: Request, windowMs: number) => {
  const { resetTime } = (req as Request & { rateLimit?: RateLimitInfo }).rateLimit ?? {};
  const remainingMs = resetTime ? resetTime.getTime() - Date.now() : windowMs;
  return Math.max(1, Math.ceil(remainingMs / 1000));
};

export const createRateLimiter = ({
  windowMs,
  limit,
  message,
  skipSuccessfulRequests = false,
}: RateLimiterOptions) =>
  rateLimit({
    windowMs,
    limit,
    skipSuccessfulRequests,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req: Request, res: Response, _next: unknown, options: Options) => {
      res.status(options.statusCode).json({
        message,
        retryAfter: getRetryAfterSeconds(req, windowMs),
      });
    },
  });
