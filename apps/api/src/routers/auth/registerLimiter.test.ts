import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../config.js';
import { UserModel } from '../../models/userModel.js';

vi.mock('../../models/userModel.js', () => ({
  UserModel: { getByEmail: vi.fn() },
}));

describe('POST /api/auth/register rate limit', () => {
  it('responds 429 after 10 attempts, rejected ones and invalid bodies included', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue({
      id: '0b7a7d1e-2f8c-4c55-9a39-3c1f5e1b9d42',
      displayName: 'Maître du jeu',
      email: 'mj@example.com',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const attempt = () =>
      request(app).post('/api/auth/register').send({
        displayName: 'Maître du jeu',
        email: 'mj@example.com',
        password: 'Archipel-du-n3ant',
      });

    for (let i = 0; i < 9; i += 1) {
      expect((await attempt()).status).toBe(409);
    }
    expect((await request(app).post('/api/auth/register').send({})).status).toBe(422);
    const response = await attempt();

    expect(response.status).toBe(429);
    expect(response.body.message).toBe('Too many registration attempts, please try again later');
    expect(response.body.retryAfter).toBeGreaterThan(59 * 60);
    expect(response.body.retryAfter).toBeLessThanOrEqual(60 * 60);
  });
});
