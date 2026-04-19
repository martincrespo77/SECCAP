import { describe, it, expect, beforeAll, afterAll, vi, afterEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../prisma.js';

/*
 * Tests de integración: GET /formacion/consulta
 * Requieren:
 *   - PostgreSQL corriendo (contenedor seccap-pg) con seed aplicado
 *   - Mock-API corriendo en puerto 3002
 */

let consultorToken: string; // tiene consulta:leer + consulta:detalle
let auditorToken: string;   // tiene consulta:leer (sin consulta:detalle)

beforeAll(async () => {
  // Limpiar bloqueos residuales
  await prisma.sysUsuario.updateMany({
    where: { username: { in: ['consultor', 'auditor'] } },
    data: { intentosFallidos: 0, bloqueadoHasta: null },
  });

  const [consultorRes, auditorRes] = await Promise.all([
    request(app)
      .post('/auth/login')
      .send({ username: 'consultor', password: 'consultor123' }),
    request(app)
      .post('/auth/login')
      .send({ username: 'auditor', password: 'auditor123' }),
  ]);

  consultorToken = consultorRes.body.token;
  auditorToken = auditorRes.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ───────────── Auth y RBAC ─────────────
describe('Consulta — auth y RBAC', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/formacion/consulta?tipo_formacion=militar');
    expect(res.status).toBe(401);
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', 'Bearer token.invalido.xyz');
    expect(res.status).toBe(401);
  });
});

// ───────────── Validación de filtros ─────────────
describe('Consulta — validación de filtros', () => {
  it('devuelve 400 sin tipo_formacion', async () => {
    const res = await request(app)
      .get('/formacion/consulta')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Filtros inválidos');
    expect(res.body.detalle).toContain('tipo_formacion');
  });

  it('devuelve 400 con tipo_formacion inválido', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=invalido')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.detalle).toContain('Valor inválido');
  });

  it('devuelve 400 con fecha en formato incorrecto', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&fecha_vencimiento_desde=15-03-2020')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.detalle).toContain('AAAA-MM-DD');
  });

  it('devuelve 400 con parámetro booleano inválido', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&tiene_documentacion=quiza')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.detalle).toContain('true o false');
  });

  it('devuelve 400 con page=0', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&page=0')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.detalle).toContain('entero positivo');
  });

  it('devuelve 400 con page_size=0', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&page_size=0')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(400);
    expect(res.body.detalle).toContain('entero positivo');
  });
});

// ───────────── Consulta exitosa con tipo militar ─────────────
describe('Consulta — tipo militar', () => {
  it('devuelve formaciones militares con paginación', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('pageSize');
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);

    // Verificar que los items están mapeados a camelCase
    const item = res.body.items[0];
    expect(item).toHaveProperty('tipoFormacion');
    expect(item).toHaveProperty('apellidoNombre');
    expect(item).toHaveProperty('estadoVigencia');
    expect(item.tipoFormacion).toBe('militar');
  });

  it('filtra por categoría militar', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&categoria_militar=CM-01')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    for (const item of res.body.items) {
      expect(item.categoriaMilitar).toBe('CM-01');
    }
  });
});

// ───────────── Consulta tipo idioma ─────────────
describe('Consulta — tipo idioma', () => {
  it('devuelve formaciones de idioma', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=idioma')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const item of res.body.items) {
      expect(item.tipoFormacion).toBe('idioma');
    }
  });
});

// ───────────── Poda por permisos ─────────────
describe('Consulta — poda de campos sensibles', () => {
  it('consultor (consulta:detalle) ve DNI y legajo', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    const item = res.body.items[0];
    expect(item).toHaveProperty('dni');
    expect(item).toHaveProperty('legajo');
  });

  it('auditor (sin consulta:detalle) NO ve DNI ni legajo', async () => {
    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    const item = res.body.items[0];
    expect(item).not.toHaveProperty('dni');
    expect(item).not.toHaveProperty('legajo');
    // Pero sí ve los campos no sensibles
    expect(item).toHaveProperty('apellidoNombre');
    expect(item).toHaveProperty('grado');
  });
});

// ───────────── Auditoría ─────────────
describe('Consulta — registro de auditoría', () => {
  it('registra auditoría en consulta exitosa', async () => {
    // Limpiar registros previos de este test
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:formacion', resultado: 'exito' },
    });

    await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${consultorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:formacion', resultado: 'exito' },
    });

    expect(despues).toBeGreaterThan(antes);
  });

  it('registra auditoría en error de validación (400)', async () => {
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:formacion', resultado: 'error_cliente' },
    });

    await request(app)
      .get('/formacion/consulta')
      .set('Authorization', `Bearer ${consultorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:formacion', resultado: 'error_cliente' },
    });

    expect(despues).toBeGreaterThan(antes);
  });
});

// ───────────── Errores upstream ─────────────
describe('Consulta — errores de la API externa', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('devuelve 502 cuando la API externa responde 500', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 }),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(502);
    expect(res.body.error).toBe('Error al consultar formaciones');
  });

  it('devuelve 504 en timeout de la API externa', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new DOMException('The operation was aborted', 'AbortError')),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(504);
    expect(res.body.detalle).toContain('Timeout');
  });
});
