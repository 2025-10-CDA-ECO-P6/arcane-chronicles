import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../config.js';

describe('Unknown route', () => {
  it('responds 404 in JSON', async () => {
    const response = await request(app).get('/api/nope');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Route not found' });
  });
});
