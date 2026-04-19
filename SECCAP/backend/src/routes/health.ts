import { Router } from 'express';
import { prisma } from '../prisma.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = 'error';
  }

  const overall = dbStatus === 'ok' ? 'ok' : 'degraded';

  res.status(overall === 'ok' ? 200 : 503).json({
    status: overall,
    service: 'seccap-backend',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbStatus,
    },
  });
});
