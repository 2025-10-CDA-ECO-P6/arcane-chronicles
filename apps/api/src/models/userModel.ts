import { db } from '../database/db.js';

interface NewUser {
  displayName: string;
  email: string;
  passwordHash: string;
}

export class UserModel {
  static create(user: NewUser) {
    return db.user.create({
      data: user,
      select: { id: true, displayName: true, email: true },
    });
  }

  static getByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  static getById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: { id: true, displayName: true, email: true },
    });
  }
}
