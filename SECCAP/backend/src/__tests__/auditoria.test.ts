import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../prisma.js';

/*
 * Tests de integración: GET /auditoria
 * Requieren:
 *   - PostgreSQL corriendo (contenedor seccap-pg) con seed aplicado
 *   - Mock-API corriendo en puerto 3002 (para generar registros de auditoría)
 */

let consultorToken: string; // sin auditoria:leer
let auditorToken: string;   // con auditoria:leer
let adminToken: string;     // con auditoria:leer (admin tiene todo)

beforeAll(async () => {
  await prisma.sysUsuario.updateMany({
    where: { username: { in: ['consultor', 'auditor', 'admin'] } },
    data: { intentosFallidos: 0, bloqueadoHasta: null },
  });

  const [consultorRes, auditorRes, adminRes] = await Promise.all([
    request(app)
      .post('/auth/login')
      .send({ username: 'consultor', password: 'consultor123' }),
    request(app)
      .post('/auth/login')
      .send({ username: 'auditor', password: 'auditor123' }),
    request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' }),
  ]);

  consultorToken = consultorRes.body.token;
  auditorToken = auditorRes.body.token;
  adminToken = adminRes.body.token;

  // Generar al menos un registro de auditoría para las pruebas
  await request(app)
    .get('/formacion/consulta?tipo_formacion=militar')
    .set('Authorization', `Bearer ${consultorToken}`);
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ───────────── Auth y RBAC ─────────────
describe('Auditoría — auth y RBAC', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/auditoria');
    expect(res.status).toBe(401);
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', 'Bearer token.invalido.xyz');
    expect(res.status).toBe(401);
  });

  it('devuelve 403 para consultor (sin auditoria:leer)', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Permiso insuficiente');
  });
});

// ───────────── Consulta exitosa ─────────────
describe('Auditoría — consulta exitosa', () => {
  it('auditor puede consultar auditoría', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('pageSize');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('admin puede consultar auditoría', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('devuelve registros reales con campos esperados', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    const item = res.body.items[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('idUsuario');
    expect(item).toHaveProperty('timestampUtc');
    expect(item).toHaveProperty('accion');
    expect(item).toHaveProperty('endpoint');
    expect(item).toHaveProperty('metodoHttp');
    expect(item).toHaveProperty('statusCode');
    expect(item).toHaveProperty('resultado');
    expect(item).toHaveProperty('usuario');
  });

  it('no expone userAgent en la respuesta', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    const item = res.body.items[0];
    expect(item).not.toHaveProperty('userAgent');
  });
});

// ───────────── Orden descendente ─────────────
describe('Auditoría — orden', () => {
  it('devuelve registros en orden descendente por fecha', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    const items = res.body.items;
    if (items.length >= 2) {
      const fecha1 = new Date(items[0].timestampUtc).getTime();
      const fecha2 = new Date(items[1].timestampUtc).getTime();
      expect(fecha1).toBeGreaterThanOrEqual(fecha2);
    }
  });
});

// ───────────── Paginación ─────────────
describe('Auditoría — paginación', () => {
  it('respeta page_size', async () => {
    const res = await request(app)
      .get('/auditoria?page_size=2')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.pageSize).toBe(2);
    expect(res.body.items.length).toBeLessThanOrEqual(2);
  });

  it('devuelve 400 con page_size=0', async () => {
    const res = await request(app)
      .get('/auditoria?page_size=0')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
  });

  it('devuelve 400 con page no numérico', async () => {
    const res = await request(app)
      .get('/auditoria?page=abc')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
  });
});

// ───────────── Filtros ─────────────
describe('Auditoría — filtros', () => {
  it('filtra por acción', async () => {
    const res = await request(app)
      .get('/auditoria?accion=consulta:formacion')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    for (const item of res.body.items) {
      expect(item.accion).toBe('consulta:formacion');
    }
  });

  it('filtra por resultado', async () => {
    const res = await request(app)
      .get('/auditoria?resultado=exito')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    for (const item of res.body.items) {
      expect(item.resultado).toBe('exito');
    }
  });

  it('devuelve 400 con acción inválida', async () => {
    const res = await request(app)
      .get('/auditoria?accion=inventada')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
    expect(res.body.detalle).toBeDefined();
  });

  it('devuelve 400 con fecha_desde mal formateada', async () => {
    const res = await request(app)
      .get('/auditoria?fecha_desde=10-10-2025')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
  });

  it('devuelve 400 con id_usuario no numérico', async () => {
    const res = await request(app)
      .get('/auditoria?id_usuario=abc')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
    expect(res.body.detalle).toEqual(
      expect.arrayContaining([expect.stringContaining('id_usuario')]),
    );
  });

  it('devuelve 400 con usuario que contiene caracteres no permitidos', async () => {
    const res = await request(app)
      .get('/auditoria?usuario=' + encodeURIComponent('<script>'))
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
    expect(res.body.detalle).toEqual(
      expect.arrayContaining([expect.stringContaining('usuario')]),
    );
  });

  it('devuelve 400 con resultado inválido', async () => {
    const res = await request(app)
      .get('/auditoria?resultado=foo')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
  });

  it('en un 400 no se expone stack ni rutas internas', async () => {
    const res = await request(app)
      .get('/auditoria?accion=inventada')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(400);
    const body = JSON.stringify(res.body);
    expect(body).not.toMatch(/at .*\(.*:\d+:\d+\)/);
    expect(body).not.toContain('node_modules');
  });
});
