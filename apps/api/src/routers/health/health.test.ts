import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../config.js';

describe('GET /api/health', () => {
  it('responds 200 when the API is running', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
