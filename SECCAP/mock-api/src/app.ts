import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { catalogosRouter } from './routes/catalogos.js';
import { formacionesRouter } from './routes/formaciones.js';

export const app = express();

app.use(cors());
app.use(express.json());

// --- Rutas ---
app.use('/externa/v1/health', healthRouter);
app.use('/externa/v1/catalogos', catalogosRouter);
app.use('/externa/v1/formaciones', formacionesRouter);
