import jwt from 'jsonwebtoken';
import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import app from '../../config.js';
import { CampaignModel } from '../../models/campaignModel.js';

vi.mock('../../models/campaignModel.js', () => ({
  CampaignModel: { getAllPublic: vi.fn(), getAllByGm: vi.fn() },
}));

const gm = {
  id: '0b7a7d1e-2f8c-4c55-9a39-3c1f5e1b9d42',
  displayName: 'Maître du jeu',
  email: 'mj@example.com',
};
const sessionCookie = (secret = 'test-secret', expiresIn: jwt.SignOptions['expiresIn'] = '7d') =>
  `token=${jwt.sign(gm, secret, { expiresIn })}`;

const publicCampaign = { id: 'public-1', title: 'L’archipel du néant' };
const gmCampaign = {
  id: 'mine-1',
  title: 'Ma campagne',
  description: null,
  imageUrl: null,
  createdAt: new Date('2026-04-08T10:00:00Z'),
  updatedAt: new Date('2026-04-08T10:00:00Z'),
  publishedAt: null,
  publishedVersion: null,
  chapters: [],
  quests: [],
  _count: { chapters: 0, quests: 0, characters: 0 },
};

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '7d';
});

beforeEach(() => {
  vi.mocked(CampaignModel.getAllPublic)
    .mockReset()
    .mockResolvedValue([publicCampaign] as never);
  vi.mocked(CampaignModel.getAllByGm)
    .mockReset()
    .mockResolvedValue([gmCampaign] as never);
});

describe('GET /api/campaigns', () => {
  it('lists the public campaigns to a visitor, with or without scope=public', async () => {
    for (const path of ['/api/campaigns', '/api/campaigns?scope=public']) {
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([publicCampaign]);
    }
    expect(CampaignModel.getAllByGm).not.toHaveBeenCalled();
  });

  it('still lists the public campaigns when the session cookie has expired', async () => {
    const response = await request(app)
      .get('/api/campaigns')
      .set('Cookie', sessionCookie('test-secret', -10));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([publicCampaign]);
  });

  it('lists the campaigns of the GM read from the session, never from the URL', async () => {
    const response = await request(app)
      .get('/api/campaigns?scope=mine&gmId=someone-else')
      .set('Cookie', sessionCookie());

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({ id: 'mine-1', status: 'NEW', progress: 0 }),
    ]);
    expect(CampaignModel.getAllByGm).toHaveBeenCalledWith(gm.id);
    expect(CampaignModel.getAllPublic).not.toHaveBeenCalled();
  });

  it('refuses scope=mine without a valid session', async () => {
    const withoutCookie = await request(app).get('/api/campaigns?scope=mine');
    const withForgedCookie = await request(app)
      .get('/api/campaigns?scope=mine')
      .set('Cookie', sessionCookie('another-secret'));

    expect(withoutCookie.status).toBe(401);
    expect(withForgedCookie.status).toBe(401);
    expect(CampaignModel.getAllByGm).not.toHaveBeenCalled();
  });

  it('responds 422 to an unknown scope', async () => {
    const response = await request(app).get('/api/campaigns?scope=all');

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      errors: [{ field: 'scope', message: 'Scope must be public or mine' }],
    });
  });
});
