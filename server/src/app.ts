import Fastify, { type FastifyInstance } from 'fastify';

type ErrorPayload = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function buildApp(): FastifyInstance {
  const app = Fastify();

  app.get('/health', async () => ({
    success: true,
    data: { status: 'ok' },
  }));

  app.get('/api/v1/hello', async () => ({
    success: true,
    data: { message: 'Hello, API!' },
  }));

  app.setNotFoundHandler((_request, reply) => {
    const payload: ErrorPayload = {
      success: false,
      error: { code: 'NOT_FOUND', message: 'Route not found' },
    };

    return reply.code(404).send(payload);
  });

  app.setErrorHandler((_error, _request, reply) => {
    const payload: ErrorPayload = {
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    };

    return reply.code(500).send(payload);
  });

  return app;
}
