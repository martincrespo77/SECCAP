import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../prisma.js';

/*
 * Tests de integración: Catálogos via proxy
 * Requieren:
 *   - PostgreSQL corriendo (contenedor seccap-pg) con seed aplicado
 *   - Mock-API corriendo en puerto 3002
 */

let token: string;

beforeAll(async () => {
  // Limpiar bloqueos residuales
  await prisma.sysUsuario.updateMany({
    where: { username: 'consultor' },
    data: { intentosFallidos: 0, bloqueadoHasta: null },
  });

  // Login como consultor (tiene permiso catalogos:leer)
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'consultor', password: 'consultor123' });
  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ───────────── Autenticación y RBAC ─────────────
describe('Catálogos — auth y RBAC', () => {
  let tokenSinPermiso: string;

  beforeAll(async () => {
    // Montar ruta temporal en testRouter (bajo /__test, antes del 404 global)
    // que exige un permiso que consultor NO tiene
    const { authenticate } = await import('../middleware/authenticate.js');
    const { authorize } = await import('../middleware/authorize.js');
    const { testRouter } = await import('../app.js');
    testRouter.get(
      '/catalogos-rbac',
      authenticate,
      authorize('admin:usuarios'),
      (_req, res) => { res.json({ ok: true }); },
    );

    // Limpiar bloqueos del auditor y obtener su token
    await prisma.sysUsuario.updateMany({
      where: { username: 'auditor' },
      data: { intentosFallidos: 0, bloqueadoHasta: null },
    });
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'auditor', password: 'auditor123' });
    tokenSinPermiso = loginRes.body.token;
  });

  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/formacion/catalogos/tipos');
    expect(res.status).toBe(401);
  });

  it('devuelve 403 si el usuario no tiene el permiso requerido', async () => {
    // auditor no tiene admin:usuarios → debe recibir 403
    const res = await request(app)
      .get('/__test/catalogos-rbac')
      .set('Authorization', `Bearer ${tokenSinPermiso}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Permiso insuficiente');
  });
});

// ───────────── Errores upstream ─────────────
describe('Catálogos — errores de la API externa', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve 502 cuando la API externa responde 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 }),
    );

    const res = await request(app)
      .get('/formacion/catalogos/tipos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('Error al consultar catálogo externo');
  });

  it('devuelve 504 cuando la API externa no responde (timeout)', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new DOMException('The operation was aborted', 'AbortError')),
    );

    const res = await request(app)
      .get('/formacion/catalogos/tipos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(504);
    expect(res.body.detalle).toContain('Timeout');
  });
});

// ───────────── GET /formacion/catalogos/tipos ─────────────
describe('GET /formacion/catalogos/tipos', () => {
  it('devuelve tipos de formación desde mock', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/tipos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(3);
  });
});

// ───────────── GET /formacion/catalogos/categorias-militares ─────────────
describe('GET /formacion/catalogos/categorias-militares', () => {
  it('devuelve categorías militares desde mock', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/categorias-militares')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(11);
    expect(res.body.data[0]).toHaveProperty('codigo');
    expect(res.body.data[0]).toHaveProperty('nombre');
  });
});

// ───────────── GET /formacion/catalogos/aptitudes ─────────────
describe('GET /formacion/catalogos/aptitudes', () => {
  it('devuelve 400 sin parámetro categoria', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/aptitudes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Parámetro requerido');
  });

  it('devuelve aptitudes para categoría válida', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/aptitudes?categoria=CM-01')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// ───────────── GET /formacion/catalogos/idiomas ─────────────
describe('GET /formacion/catalogos/idiomas', () => {
  it('devuelve lista de idiomas desde mock', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/idiomas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(5);
  });
});

// ───────────── GET /formacion/catalogos/niveles-idioma ─────────────
describe('GET /formacion/catalogos/niveles-idioma', () => {
  it('devuelve niveles de idioma desde mock', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/niveles-idioma')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(6);
    expect(res.body.data[0]).toHaveProperty('codigo');
  });
});

// ───────────── GET /formacion/catalogos/instituciones ─────────────
describe('GET /formacion/catalogos/instituciones', () => {
  it('devuelve 400 sin parámetro idioma', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/instituciones')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Parámetro requerido');
  });

  it('devuelve instituciones para idioma válido', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/instituciones?idioma=Inglés')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
