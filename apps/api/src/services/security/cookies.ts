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

export const openSession = (res: Response, user: AuthPayload) => {
  const token = jwt.sign(user, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
  const { exp } = jwt.decode(token) as JwtPayload & { exp: number };

  res.cookie('token', token, {
    ...getCookieOptions(),
    expires: new Date(exp * 1000),
  });
};

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

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.auth = req.cookies.token
      ? (jwt.verify(req.cookies.token, getJwtSecret()) as AuthPayload & JwtPayload)
      : null;
  } catch {
    req.auth = null;
  }
  next();
};
