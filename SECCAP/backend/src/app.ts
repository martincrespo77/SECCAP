import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { catalogosRouter } from './routes/catalogos.js';
import { consultaRouter } from './routes/consulta.js';
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
