import type { CookieOptions, NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

import type { AuthPayload } from '../../types/auth.js';

export const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return secret;
};

export const getJwtExpiresIn = (): SignOptions['expiresIn'] => {
  const expiresIn = process.env.JWT_EXPIRES_IN;
  if (!expiresIn) {
    throw new Error('JWT_EXPIRES_IN is not defined');
  }
  return expiresIn as SignOptions['expiresIn'];
};

export const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  domain: process.env.COOKIE_DOMAIN || undefined,
});

export const checkCookie = (req: Request, res: Response, next: NextFunction) => {
  const secret = getJwtSecret();

  try {
    req.auth = jwt.verify(req.cookies.token, secret) as AuthPayload & JwtPayload;
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
  next();
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies.token) {
    checkCookie(req, res, next);
  } else {
    req.auth = null;
    next();
  }
};
