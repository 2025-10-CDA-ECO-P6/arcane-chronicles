import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import app from '../../config.js';
import { UserModel } from '../../models/userModel.js';

vi.mock('../../models/userModel.js', () => ({
  UserModel: { getByEmail: vi.fn() },
}));

describe('POST /api/auth/login rate limit', () => {
  it('responds 429 after 5 failed attempts', async () => {
    vi.mocked(UserModel.getByEmail).mockResolvedValue(null);
    const attempt = () =>
      request(app).post('/api/auth/login').send({ email: 'mj@example.com', password: 'wrong' });

    for (let i = 0; i < 5; i += 1) {
      expect((await attempt()).status).toBe(401);
    }
    const response = await attempt();

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: 'Too many login attempts, please try again in 15 minutes',
    });
  });
});
