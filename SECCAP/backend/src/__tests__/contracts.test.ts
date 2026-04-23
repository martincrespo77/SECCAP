import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Request, Response, NextFunction } from 'express';

/*
 * Contract tests mock/proxy (Fase 5.1).
 *
 * Validan que el proxy backend respeta el contrato esperado del mock externo
 * (entrada vía fetch) y el contrato del DTO interno aprobado (salida al
 * frontend), para los flujos críticos: lista de consulta, detalle,
 * certificado y catálogos principales.
 *
 * Estrategia in-process:
 *  - prisma → mock (auditoría no escribe en BD real, autenticación stub)
 *  - middleware authenticate → stub que inyecta req.user según header X-Test-User
 *  - globalThis.fetch → mock para simular el upstream del Área de Personal
 *
 * Las suites de integración real (consulta.test.ts, detalle.test.ts,
 * catalogos.test.ts) cubren el camino end-to-end con PostgreSQL + mock-api;
 * esta suite cubre puntualmente el contrato y los headers, sin depender de
 * que el mock-api esté arriba.
 */

vi.mock('../prisma.js', () => ({
  prisma: {
    $queryRaw: vi.fn(async () => [{ '?column?': 1 }]),
    $disconnect: vi.fn(async () => undefined),
    auditLog: { create: vi.fn(async () => ({})) },
    sysUsuario: { findUnique: vi.fn() },
  },
}));

vi.mock('../middleware/authenticate.js', () => ({
  authenticate: (req: Request, res: Response, next: NextFunction) => {
    const raw = req.header('X-Test-User');
    if (!raw) {
      res.status(401).json({ error: 'Token de autenticación requerido' });
      return;
    }
    try {
      req.user = JSON.parse(raw);
      next();
    } catch {
      res.status(401).json({ error: 'Token inválido o expirado' });
    }
  },
}));

import { app } from '../app.js';

const consultorHeader = JSON.stringify({
  id: 1,
  username: 'consultor',
  nombreCompleto: 'Consultor de Prueba',
  sessionId: 1,
  roles: ['consultor'],
  permisos: ['catalogos:leer', 'consulta:leer', 'consulta:detalle', 'consulta:certificado'],
});

const auditorHeader = JSON.stringify({
  id: 2,
  username: 'auditor',
  nombreCompleto: 'Auditor',
  sessionId: 2,
  roles: ['auditor'],
  permisos: ['consulta:leer', 'auditoria:leer'],
});

beforeEach(() => {
  vi.restoreAllMocks();
});

// ───────────── Contract: GET /formacion/consulta ─────────────
describe('Contract — lista de consulta', () => {
  const upstreamPayload = {
    items: [
      {
        id: 10,
        tipo_formacion: 'militar',
        dni: '20111222',
        legajo: 'L-001',
        apellido_nombre: 'Pérez, Juan',
        grado: 'Teniente',
        unidad: 'Unidad A',
        categoria_militar: 'CM-01',
        aptitud_capacitacion: 'Operaciones Especiales',
        compromiso_servicios_vigente: true,
        tiene_documentacion: true,
        certificado_descargable: true,
        estado_vigencia: 'vigente',
        fecha_obtencion: '2024-05-10',
      },
    ],
    page: 1,
    page_size: 20,
    total: 1,
  };

  it('mapea camelCase y respeta el contrato {items, page, pageSize, total}', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(upstreamPayload), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&page=1&page_size=20')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 20,
      total: 1,
    });
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body).not.toHaveProperty('page_size');

    const item = res.body.items[0];
    expect(item).toMatchObject({
      id: 10,
      tipoFormacion: 'militar',
      apellidoNombre: 'Pérez, Juan',
      categoriaMilitar: 'CM-01',
      estadoVigencia: 'vigente',
      certificadoDescargable: true,
    });
    expect(item).toHaveProperty('dni', '20111222');
    expect(item).toHaveProperty('legajo', 'L-001');
    expect(item).not.toHaveProperty('tipo_formacion');
    expect(item).not.toHaveProperty('apellido_nombre');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetchSpy.mock.calls[0][0]);
    expect(calledUrl).toContain('/externa/v1/formaciones');
    expect(calledUrl).toContain('tipo_formacion=militar');
  });

  it('poda dni/legajo cuando el usuario no tiene consulta:detalle', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(upstreamPayload), { status: 200 }),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('X-Test-User', auditorHeader);

    expect(res.status).toBe(200);
    const item = res.body.items[0];
    expect(item).not.toHaveProperty('dni');
    expect(item).not.toHaveProperty('legajo');
    expect(item).toHaveProperty('apellidoNombre');
  });

  it('traduce 500 upstream en 502 con shape {error, detalle}', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('boom', { status: 500 }),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(502);
    expect(res.body).toHaveProperty('error', 'Error al consultar formaciones');
    expect(res.body).toHaveProperty('detalle');
    expect(JSON.stringify(res.body)).not.toContain('boom');
  });
});

// ───────────── Contract: GET /formacion/:id ─────────────
describe('Contract — detalle de formación', () => {
  const detalleUpstream = {
    data: {
      id: 42,
      tipo_formacion: 'idioma',
      dni: '30222333',
      legajo: 'L-042',
      apellido_nombre: 'Gómez, Ana',
      grado: 'Capitán',
      unidad: 'Unidad B',
      idioma: 'Inglés',
      nivel_idioma: 'B2',
      institucion: 'Cultural',
      tiene_documentacion: true,
      certificado_descargable: true,
      estado_vigencia: 'vigente',
      fecha_obtencion: '2023-11-01',
    },
  };

  it('responde DTO mapeado para detalle existente', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(detalleUpstream), { status: 200 }),
    );

    const res = await request(app)
      .get('/formacion/42')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: 42,
      tipoFormacion: 'idioma',
      apellidoNombre: 'Gómez, Ana',
      idioma: 'Inglés',
      nivelIdioma: 'B2',
      certificadoDescargable: true,
    });
    expect(res.body).not.toHaveProperty('tipo_formacion');
  });

  it('traduce 404 upstream a 404 controlado con mensaje propio', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('not found', { status: 404 }),
    );

    const res = await request(app)
      .get('/formacion/9999')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Formación no encontrada' });
  });

  it('rechaza id no numérico con 400 y JSON estable', async () => {
    const res = await request(app)
      .get('/formacion/abc')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });
});

// ───────────── Contract: GET /formacion/:id/certificado ─────────────
describe('Contract — descarga de certificado', () => {
  it('preserva Content-Type y Content-Disposition del upstream', async () => {
    const pdfBytes = Buffer.from('%PDF-1.4 fake');
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(pdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="certificado-42.pdf"',
        },
      }),
    );

    const res = await request(app)
      .get('/formacion/42/certificado')
      .set('X-Test-User', consultorHeader)
      .buffer(true);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    expect(res.headers['content-disposition']).toContain('filename="certificado-42.pdf"');
    const body: Buffer | string = res.body;
    const len = Buffer.isBuffer(body) ? body.length : (body as string).length;
    expect(len).toBeGreaterThan(0);
  });

  it('responde 403 JSON cuando el usuario no tiene consulta:certificado', async () => {
    const res = await request(app)
      .get('/formacion/42/certificado')
      .set('X-Test-User', auditorHeader);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'Permiso insuficiente' });
    expect(res.body.detalle).toContain('consulta:certificado');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('traduce 404 upstream a 404 propio con mensaje específico', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('nope', { status: 404 }),
    );

    const res = await request(app)
      .get('/formacion/9999/certificado')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'Certificado no encontrado' });
  });
});

// ───────────── Contract: catálogos principales ─────────────
describe('Contract — catálogos principales', () => {
  it('GET /formacion/catalogos/tipos respeta {data:[{codigo,nombre}]}', async () => {
    const upstream = {
      data: [
        { codigo: 'militar', nombre: 'Ámbito militar' },
        { codigo: 'civil', nombre: 'Ámbito civil' },
        { codigo: 'idioma', nombre: 'Idioma' },
      ],
    };
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify(upstream), { status: 200 }),
    );

    const res = await request(app)
      .get('/formacion/catalogos/tipos')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(3);
    for (const t of res.body.data) {
      expect(t).toHaveProperty('codigo');
      expect(t).toHaveProperty('nombre');
    }
    // El frontend aprobado consume `codigo`, NO `id` (regresión Fase 4.2)
    expect(res.body.data[0]).not.toHaveProperty('id');
  });

  it('GET /formacion/catalogos/aptitudes exige el parámetro categoria', async () => {
    const res = await request(app)
      .get('/formacion/catalogos/aptitudes')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ error: 'Parámetro requerido' });
  });

  it('GET /formacion/catalogos/aptitudes reenvía a upstream con el parámetro', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ nombre: 'Apt A' }] }), { status: 200 }),
    );

    const res = await request(app)
      .get('/formacion/catalogos/aptitudes?categoria=CM-01')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toHaveProperty('nombre', 'Apt A');
    const calledUrl = String(fetchSpy.mock.calls[0][0]);
    expect(calledUrl).toContain('/externa/v1/catalogos/aptitudes');
    expect(calledUrl).toContain('categoria_militar=CM-01');
  });

  it('GET /formacion/catalogos/instituciones exige idioma y reenvía bien', async () => {
    const sinParam = await request(app)
      .get('/formacion/catalogos/instituciones')
      .set('X-Test-User', consultorHeader);
    expect(sinParam.status).toBe(400);

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [{ nombre: 'Cultural' }] }), { status: 200 }),
    );

    const ok = await request(app)
      .get('/formacion/catalogos/instituciones?idioma=Inglés')
      .set('X-Test-User', consultorHeader);

    expect(ok.status).toBe(200);
    expect(ok.body.data[0]).toHaveProperty('nombre', 'Cultural');
    const calledUrl = String(fetchSpy.mock.calls[0][0]);
    expect(calledUrl).toContain('/externa/v1/catalogos/instituciones');
    expect(calledUrl).toMatch(/idioma=Ingl%C3%A9s|idioma=Inglés/);
  });

  it('traduce timeout upstream (AbortError) a 504 controlado en catálogos', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(() =>
      Promise.reject(new DOMException('aborted', 'AbortError')),
    );

    const res = await request(app)
      .get('/formacion/catalogos/tipos')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(504);
    expect(res.body).toHaveProperty('error', 'Error al consultar catálogo externo');
    expect(res.body.detalle).toContain('Timeout');
  });
});
