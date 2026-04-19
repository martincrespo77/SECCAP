import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mock-api-area-personal',
    timestamp: new Date().toISOString(),
  });
});
