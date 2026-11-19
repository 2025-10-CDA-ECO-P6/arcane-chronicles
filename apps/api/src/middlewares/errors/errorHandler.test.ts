import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../config.js';
import { errorHandler } from './errorHandler.js';

describe('errorHandler', () => {
  it('responds 400 when the JSON body is malformed', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": ');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('responds 500 without details on an unexpected error', async () => {
    const failingApp = express();
    failingApp.get('/boom', () => {
      throw new Error('database password leaked in this message');
    });
    failingApp.use(errorHandler);

    const response = await request(failingApp).get('/boom');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});
