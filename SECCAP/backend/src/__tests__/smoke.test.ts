import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

/*
 * Smoke tests del backend (Fase 5.1).
 *
 * Objetivo: validar de forma in-process y determinística que la app
 * arranca controladamente y no expone detalles internos al cliente
 * en errores controlados ni cuando la BD está degradada.
 *
 * Esta suite usa mocks puntuales de prisma para poder simular BD ok / BD
 * caída sin requerir PostgreSQL — los tests de integración reales contra
 * PostgreSQL siguen viviendo en auth.test.ts, consulta.test.ts, etc.
 */

const { queryRawMock } = vi.hoisted(() => ({ queryRawMock: vi.fn() }));

vi.mock('../prisma.js', () => ({
  prisma: {
    $queryRaw: queryRawMock,
    $disconnect: vi.fn(async () => undefined),
  },
}));

import { app } from '../app.js';

beforeEach(() => {
  queryRawMock.mockReset();
});

// ───────────── GET /health ─────────────
describe('Smoke — GET /health', () => {
  it('responde 200 con shape estable cuando la BD está disponible', async () => {
    queryRawMock.mockResolvedValueOnce([{ '?column?': 1 }]);

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'seccap-backend',
      checks: { database: 'ok' },
    });
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('responde 503 degraded cuando la BD está caída, sin lanzar excepción', async () => {
    queryRawMock.mockRejectedValueOnce(new Error('connect ECONNREFUSED'));

    const res = await request(app).get('/health');

    expect(res.status).toBe(503);
    expect(res.body).toMatchObject({
      status: 'degraded',
      service: 'seccap-backend',
      checks: { database: 'error' },
    });
  });

  it('no expone el mensaje crudo del error de BD en la respuesta', async () => {
    queryRawMock.mockRejectedValueOnce(
      new Error('FATAL: password authentication failed for user "seccap"'),
    );

    const res = await request(app).get('/health');

    const body = JSON.stringify(res.body);
    expect(body).not.toContain('password');
    expect(body).not.toContain('FATAL');
    expect(body).not.toMatch(/at .*\(.*:\d+:\d+\)/);
  });
});

// ───────────── 404 controlado ─────────────
describe('Smoke — rutas inexistentes', () => {
  it('responde 404 con JSON estable, sin HTML ni stack trace', async () => {
    const res = await request(app).get('/no-existe-esta-ruta');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ error: 'Recurso no encontrado' });
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(body).not.toContain('node_modules');
  });
});

// ───────────── Auth sin token ─────────────
describe('Smoke — endpoints protegidos sin token', () => {
  it('responde 401 con JSON estructurado, no stack trace', async () => {
    const res = await request(app).get('/formacion/consulta');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Token de autenticación requerido' });
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('responde 401 con JSON ante token inválido, sin filtrar internals', async () => {
    const res = await request(app)
      .get('/formacion/consulta')
      .set('Authorization', 'Bearer no.es.un.jwt');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Token inválido o expirado' });
    expect(JSON.stringify(res.body)).not.toMatch(/jwt|jsonwebtoken|secret/i);
  });
});

// ───────────── JSON malformado ─────────────
describe('Smoke — body JSON inválido', () => {
  it('responde con error JSON sobrio sin exponer stack al enviar JSON malformado', async () => {
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"username": "admin", "password":');

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ error: 'Solicitud inválida' });
    const text = JSON.stringify(res.body);
    expect(text).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(text).not.toContain('node_modules');
    expect(text).not.toContain('SyntaxError');
  });
});
