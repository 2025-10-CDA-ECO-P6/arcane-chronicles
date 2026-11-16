import argon2, { type HashOptions } from 'argon2';
import type { NextFunction, Request, Response } from 'express';

import type { PasswordBody } from '../../types/auth.js';

const hashingOptions: HashOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

export const hashPassword = async (
  req: Request<unknown, unknown, PasswordBody>,
  _res: Response,
  next: NextFunction,
) => {
  try {
    req.body.password = await argon2.hash(req.body.password, hashingOptions);
    next();
  } catch (err) {
    next(err);
  }
};

export const verifyPassword = async (hash: string, password: string): Promise<boolean> =>
  argon2.verify(hash, password);
