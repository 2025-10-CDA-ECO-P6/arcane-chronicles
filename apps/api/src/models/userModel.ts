import { db } from '../database/db.js';

interface NewUser {
  displayName: string;
  email: string;
  passwordHash: string;
}

const publicFields = { id: true, displayName: true, email: true, avatarUrl: true };

export class UserModel {
  static create(user: NewUser) {
    return db.user.create({
      data: user,
      select: publicFields,
    });
  }

  static getByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  static getById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: publicFields,
    });
  }
}
