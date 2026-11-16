import type { LoginInput } from '@arcane-chronicles/shared';
import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { UserModel } from '../models/userModel.js';
import { verifyPassword } from '../services/auth/auth.js';
import { getCookieOptions, getJwtExpiresIn, getJwtSecret } from '../services/security/cookies.js';
import type { AuthPayload } from '../types/auth.js';

export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserModel.getByEmail(req.body.email);
    const verified = user ? await verifyPassword(user.passwordHash, req.body.password) : false;

    if (user && verified) {
      const authUser: AuthPayload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      };

      const token = jwt.sign(authUser, getJwtSecret(), { expiresIn: getJwtExpiresIn() });
      const { exp } = jwt.decode(token) as JwtPayload & { exp: number };

      res
        .cookie('token', token, {
          ...getCookieOptions(),
          expires: new Date(exp * 1000),
        })
        .json(authUser);
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token', getCookieOptions()).sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.auth ? await UserModel.getById(req.auth.id) : null;

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    next(err);
  }
};
