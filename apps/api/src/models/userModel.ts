import { db } from '../database/db.js';

export class UserModel {
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
