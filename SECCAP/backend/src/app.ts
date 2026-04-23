import express, { Router, type ErrorRequestHandler, type RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { logger } from './logger.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { catalogosRouter } from './routes/catalogos.js';
import { consultaRouter } from './routes/consulta.js';
import { detalleRouter } from './routes/detalle.js';
import { auditoriaRouter } from './routes/auditoria.js';
import { authenticate } from './middleware/authenticate.js';
import { authorize } from './middleware/authorize.js';

export const app = express();

// --- Middleware global ---
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// --- Rutas ---
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/formacion/catalogos', authenticate, authorize('catalogos:leer'), catalogosRouter);
app.use('/formacion/consulta', authenticate, authorize('consulta:leer'), consultaRouter);
app.use('/formacion', authenticate, detalleRouter);
app.use('/auditoria', authenticate, authorize('auditoria:leer'), auditoriaRouter);

/**
 * Router auxiliar usado SOLO desde la suite de tests (Vitest).
 * Permite registrar rutas temporales antes del 404 handler global,
 * sin que dichas rutas existan jamás en runtime de producción.
 *
 * Vitest setea automáticamente `process.env.VITEST === 'true'`.
 */
export const testRouter: Router = Router();
if (process.env.VITEST === 'true') {
  app.use('/__test', testRouter);
}

// --- 404 controlado: respuesta JSON estable, sin HTML ni stack ---
const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'Recurso no encontrado' });
};
app.use(notFoundHandler);

// --- Error handler global: nunca filtrar stack traces al cliente ---
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // body-parser firma sus errores con `type` y `status`
  const status =
    typeof (err as { status?: unknown }).status === 'number'
      ? (err as { status: number }).status
      : typeof (err as { statusCode?: unknown }).statusCode === 'number'
        ? (err as { statusCode: number }).statusCode
        : 500;

  const isClientError = status >= 400 && status < 500;

  if (status >= 500) {
    logger.error({ err, path: req.path }, 'Error no controlado');
  } else {
    logger.warn({ err: (err as Error).message, path: req.path }, 'Error de cliente');
  }

  res.status(status).json({
    error: isClientError ? 'Solicitud inválida' : 'Error interno del servidor',
  });
};
app.use(errorHandler);
