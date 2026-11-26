import { Prisma } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../../config.js';
import { UserModel } from '../../models/userModel.js';

vi.mock('../../models/userModel.js', () => ({
  UserModel: { create: vi.fn(), getByEmail: vi.fn(), getById: vi.fn() },
}));

const password = 'correct-horse-battery';
const publicUser = {
  id: '0b7a7d1e-2f8c-4c55-9a39-3c1f5e1b9d42',
  displayName: 'Maître du jeu',
  email: 'mj@example.com',
  avatarUrl: null as string | null,
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
  vi.mocked(UserModel.create).mockReset();
  vi.mocked(UserModel.getByEmail).mockReset();
  vi.mocked(UserModel.getById).mockReset();
});

describe('POST /api/auth/register', () => {
  const registration = {
    displayName: publicUser.displayName,
    email: publicUser.email,
    password: 'Archipel-du-n3ant',
  };

  it('responds 201 with the user, stores a hash of the password and opens the session', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    vi.mocked(UserModel.create).mockResolvedValue(publicUser);

    const response = await request(app).post('/api/auth/register').send(registration);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(publicUser);
    expect(getTokenCookie(response)).toMatch(/HttpOnly/);
    const { passwordHash } = vi.mocked(UserModel.create).mock.calls[0][0];
    expect(passwordHash).not.toBe(registration.password);
    expect(await argon2.verify(passwordHash, registration.password)).toBe(true);
  });

  it('only saves the expected fields, trimmed, whatever else the body contains', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    vi.mocked(UserModel.create).mockResolvedValue(publicUser);

    await request(app)
      .post('/api/auth/register')
      .send({ ...registration, displayName: '  Maître du jeu  ', isAdmin: true });

    expect(UserModel.create).toHaveBeenCalledWith({
      displayName: 'Maître du jeu',
      email: registration.email,
      passwordHash: expect.any(String),
    });
  });

  it('saves the email in lowercase', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    vi.mocked(UserModel.create).mockResolvedValue(publicUser);

    await request(app)
      .post('/api/auth/register')
      .send({ ...registration, email: 'MJ@Example.com' });

    expect(UserModel.getByEmail).toHaveBeenCalledWith('mj@example.com');
    expect(UserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'mj@example.com' }),
    );
  });

  it('responds 409 without hashing or creating anything when the email already has an account', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(dbUser);
    const hash = vi.spyOn(argon2, 'hash');

    const response = await request(app).post('/api/auth/register').send(registration);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'An account already exists with this email' });
    expect(hash).not.toHaveBeenCalled();
    expect(UserModel.create).not.toHaveBeenCalled();
    expect(getTokenCookie(response)).toBeUndefined();
    hash.mockRestore();
  });

  it('responds 409 when the database refuses a duplicate email created in the meantime', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    vi.mocked(UserModel.create).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    const response = await request(app).post('/api/auth/register').send(registration);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ message: 'An account already exists with this email' });
    expect(getTokenCookie(response)).toBeUndefined();
  });

  it('responds 422 with every broken password rule before reading the database', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ ...registration, password: 'weak' });

    expect(response.status).toBe(422);
    expect(response.body.errors).toEqual([
      { field: 'password', message: 'Password must contain at least 12 characters' },
      { field: 'password', message: 'Password must contain an uppercase letter' },
      { field: 'password', message: 'Password must contain a digit' },
      { field: 'password', message: 'Password must contain a special character' },
    ]);
    expect(UserModel.getByEmail).not.toHaveBeenCalled();
  });
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

  it('sends the avatar in the response but keeps only the identity in the token', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue({
      ...dbUser,
      avatarUrl: 'https://example.com/avatar.webp',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: publicUser.email, password });

    expect(response.body.avatarUrl).toBe('https://example.com/avatar.webp');
    const token = getTokenCookie(response)?.split(';')[0].replace('token=', '') ?? '';
    const payload = jwt.decode(token) as Record<string, unknown>;
    expect(Object.keys(payload).sort()).toEqual(['displayName', 'email', 'exp', 'iat', 'id']);
  });

  it('finds the account whatever the case of the email', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(dbUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: ' MJ@Example.com ', password });

    expect(response.status).toBe(200);
    expect(UserModel.getByEmail).toHaveBeenCalledWith('mj@example.com');
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

  it('still verifies a password on an unknown email so the response time does not reveal it', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    const verify = vi.spyOn(argon2, 'verify');

    await request(app).post('/api/auth/login').send({ email: 'unknown@example.com', password });

    expect(verify).toHaveBeenCalledOnce();
    verify.mockRestore();
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
