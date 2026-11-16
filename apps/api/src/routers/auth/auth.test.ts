import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../../config.js';
import { UserModel } from '../../models/userModel.js';

vi.mock('../../models/userModel.js', () => ({
  UserModel: { getByEmail: vi.fn(), getById: vi.fn() },
}));

const password = 'correct-horse-battery';
const publicUser = {
  id: '0b7a7d1e-2f8c-4c55-9a39-3c1f5e1b9d42',
  displayName: 'Maître du jeu',
  email: 'mj@example.com',
};
let dbUser: typeof publicUser & { passwordHash: string; createdAt: Date; updatedAt: Date };

const getTokenCookie = (response: request.Response) =>
  ([] as string[]).concat(response.headers['set-cookie'] ?? []).find((c) => c.startsWith('token='));

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '7d';
  dbUser = {
    ...publicUser,
    passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

beforeEach(() => {
  vi.mocked(UserModel.getByEmail).mockReset();
  vi.mocked(UserModel.getById).mockReset();
});

describe('POST /api/auth/login', () => {
  it('responds 200 with the user and sets an httpOnly cookie', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(dbUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: publicUser.email, password });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(publicUser);
    const cookie = getTokenCookie(response);
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/SameSite=Lax/);
    expect(cookie).toMatch(/Expires=/);
  });

  it('responds 401 with a generic message on a wrong password', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(dbUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: publicUser.email, password: 'wrong-password' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid email or password' });
    expect(getTokenCookie(response)).toBeUndefined();
  });

  it('responds 401 with the same message on an unknown email', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid email or password' });
  });

  it('responds 422 with the refused fields on an invalid body', async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'not-an-email' });

    expect(response.status).toBe(422);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        { field: 'email', message: 'Invalid email address' },
        { field: 'password', message: 'Password is required' },
      ]),
    );
    expect(UserModel.getByEmail).not.toHaveBeenCalled();
  });
});

describe('GET /api/auth/me', () => {
  it('responds 401 without a cookie', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
  });

  it('responds 401 with an expired token', async () => {
    const token = jwt.sign(publicUser, 'test-secret', { expiresIn: -10 });

    const response = await request(app).get('/api/auth/me').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
  });

  it('responds 401 with a token signed by another secret', async () => {
    const token = jwt.sign(publicUser, 'another-secret', { expiresIn: '7d' });

    const response = await request(app).get('/api/auth/me').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
  });

  it('responds 200 with the user when the login cookie is sent back', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(dbUser);
    vi.mocked(UserModel.getById).mockResolvedValue(publicUser);
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: publicUser.email, password });

    const response = await agent.get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(publicUser);
    expect(UserModel.getById).toHaveBeenCalledWith(publicUser.id);
  });

  it('responds 401 when the account no longer exists', async () => {
    vi.mocked(UserModel.getById).mockResolvedValue(null);
    const token = jwt.sign(publicUser, 'test-secret', { expiresIn: '7d' });

    const response = await request(app).get('/api/auth/me').set('Cookie', `token=${token}`);

    expect(response.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('responds 200 and clears the cookie, even without a valid session', async () => {
    const response = await request(app).post('/api/auth/logout');

    expect(response.status).toBe(200);
    expect(getTokenCookie(response)).toMatch(/Expires=Thu, 01 Jan 1970/);
  });
});
