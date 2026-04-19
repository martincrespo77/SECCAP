import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: parseInt(process.env.BACKEND_PORT ?? '3001', 10),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  MOCK_API_URL: process.env.MOCK_API_URL ?? 'http://localhost:3002',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '8h',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'info',
} as const;

// Validación de arranque — secreto JWT obligatorio
if (!config.JWT_SECRET || config.JWT_SECRET.length < 16) {
  throw new Error(
    'JWT_SECRET debe estar definido y tener al menos 16 caracteres. ' +
    'Configure la variable en SECCAP/.env',
  );
}
