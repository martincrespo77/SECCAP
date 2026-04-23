import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../prisma.js';

/*
 * Tests de integración: Auth y RBAC
 * Requieren PostgreSQL corriendo (contenedor seccap-pg) y seed aplicado.
 */

afterAll(async () => {
  await prisma.$disconnect();
});

// ───────────── POST /auth/login ─────────────
describe('POST /auth/login', () => {
  beforeAll(async () => {
    // Limpiar bloqueos residuales del usuario admin para que los tests sean idempotentes
    await prisma.sysUsuario.updateMany({
      where: { username: 'admin' },
      data: { intentosFallidos: 0, bloqueadoHasta: null },
    });
  });

  it('devuelve 200 y token con credenciales válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('expires_at');
    expect(res.body.user.username).toBe('admin');
    expect(res.body.user.roles).toContain('admin');
    expect(Array.isArray(res.body.user.permisos)).toBe(true);
  });

  it('devuelve 401 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });

  it('devuelve 401 cuando el usuario no existe', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'noexiste', password: '12345' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });

  it('devuelve 400 cuando faltan campos', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({});

    expect(res.status).toBe(400);
  });
});

// ───────────── GET /auth/me ─────────────
describe('GET /auth/me', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    token = res.body.token;
  });

  it('devuelve datos del usuario con token válido', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('admin');
    expect(res.body.roles).toContain('admin');
    expect(Array.isArray(res.body.permisos)).toBe(true);
  });

  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token de autenticación requerido');
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer token.invalido.xyz');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token inválido o expirado');
  });
});

// ───────────── POST /auth/logout ─────────────
describe('POST /auth/logout', () => {
  it('cierra sesión y revoca el token', async () => {
    // Login para obtener un token fresco
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username: 'consultor', password: 'consultor123' });
    const token = loginRes.body.token;

    // Logout
    const logoutRes = await request(app)
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(logoutRes.status).toBe(200);
    expect(logoutRes.body.message).toBe('Sesión cerrada correctamente');

    // El token revocado ya no debe funcionar
    const meRes = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(meRes.status).toBe(401);
    expect(meRes.body.error).toBe('Sesión expirada o revocada');
  });
});

// ───────────── RBAC — authorize middleware ─────────────
describe('RBAC - authorize middleware', () => {
  let adminToken: string;
  let auditorToken: string;

  beforeAll(async () => {
    // Limpiar bloqueos residuales
    await prisma.sysUsuario.updateMany({
      where: { username: { in: ['admin', 'auditor'] } },
      data: { intentosFallidos: 0, bloqueadoHasta: null },
    });

    const adminRes = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    adminToken = adminRes.body.token;

    const auditorRes = await request(app)
      .post('/auth/login')
      .send({ username: 'auditor', password: 'auditor123' });
    auditorToken = auditorRes.body.token;
  });

  /*
   * Para testear authorize sin crear rutas extra, montamos una ruta temporal
   * en el testRouter (montado bajo /__test antes del 404 global, solo cuando
   * VITEST=true). Esto verifica que el middleware authorize funciona correctamente.
   */
  beforeAll(async () => {
    const { authenticate } = await import('../middleware/authenticate.js');
    const { authorize } = await import('../middleware/authorize.js');
    const { testRouter } = await import('../app.js');

    testRouter.get(
      '/rbac/admin-only',
      authenticate,
      authorize('admin:usuarios'),
      (_req, res) => { res.json({ ok: true }); },
    );
  });

  it('admin accede a ruta protegida con permiso admin:usuarios', async () => {
    const res = await request(app)
      .get('/__test/rbac/admin-only')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('auditor recibe 403 en ruta que requiere admin:usuarios', async () => {
    const res = await request(app)
      .get('/__test/rbac/admin-only')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Permiso insuficiente');
  });
});
