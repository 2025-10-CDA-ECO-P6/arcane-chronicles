import type { LoginInput, RegisterInput } from '@arcane-chronicles/shared';
import { Prisma } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';

import { UserModel } from '../models/userModel.js';
import { hashPassword, verifyPassword } from '../services/auth/auth.js';
import { getCookieOptions, openSession } from '../services/security/cookies.js';
import type { AuthPayload } from '../types/auth.js';

const isEmailTaken = (err: unknown) =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';

export const login = async (
  req: Request<unknown, unknown, LoginInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserModel.getByEmail(req.body.email);
    const verified = await verifyPassword(user?.passwordHash, req.body.password);

    if (user && verified) {
      const authUser: AuthPayload = {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
      };

      openSession(res, authUser);
      res.json(authUser);
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

export const register = async (
  req: Request<unknown, unknown, RegisterInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { displayName, email, password } = req.body;
    const existingUser = await UserModel.getByEmail(email);

    if (existingUser) {
      res.status(409).json({ message: 'An account already exists with this email' });
      return;
    }

    const authUser = await UserModel.create({
      displayName,
      email,
      passwordHash: await hashPassword(password),
    });

    openSession(res, authUser);
    res.status(201).json(authUser);
  } catch (err) {
    if (isEmailTaken(err)) {
      res.status(409).json({ message: 'An account already exists with this email' });
      return;
    }
    next(err);
  }
};
