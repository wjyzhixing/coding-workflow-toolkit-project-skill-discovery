import { describe, expect, it } from 'vitest';

import { buildApp } from '../src/app.js';

describe('API template', () => {
  it('returns a successful health response', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      success: true,
      data: { status: 'ok' },
    });
    await app.close();
  });

  it('returns the hello payload', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/api/v1/hello' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      success: true,
      data: { message: 'Hello, API!' },
    });
    await app.close();
  });

  it('returns a structured 404 for an unknown route', async () => {
    const app = buildApp();

    const response = await app.inject({ method: 'GET', url: '/missing' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Route not found' },
    });
    await app.close();
  });
});
