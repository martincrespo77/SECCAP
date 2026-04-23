import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import type { Request, Response, NextFunction } from 'express';

/*
 * Tests de auditoría sobre flujos críticos (Fase 5.1).
 *
 * Verifican que los 4 flujos auditables clave dejan registro consistente,
 * con la forma de payload acordada (accion, endpoint, statusCode, resultado,
 * cantidadRegistros, filtrosAplicados), y que el endpoint /auditoria respeta
 * el shape de paginación y RBAC.
 *
 * Estrategia in-process: prisma mockeado, authenticate stub.
 */

const {
  auditCreateMock,
  auditFindManyMock,
  auditCountMock,
} = vi.hoisted(() => ({
  auditCreateMock: vi.fn(async (args: { data: Record<string, unknown> }) => args.data),
  auditFindManyMock: vi.fn(async (..._args: unknown[]): Promise<Array<Record<string, unknown>>> => []),
  auditCountMock: vi.fn(async (..._args: unknown[]): Promise<number> => 0),
}));

vi.mock('../prisma.js', () => ({
  prisma: {
    $queryRaw: vi.fn(async () => [{ '?column?': 1 }]),
    $disconnect: vi.fn(async () => undefined),
    auditLog: {
      create: auditCreateMock,
      findMany: auditFindManyMock,
      count: auditCountMock,
    },
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
  id: 11,
  username: 'consultor',
  nombreCompleto: 'Consultor Auditable',
  sessionId: 100,
  roles: ['consultor'],
  permisos: ['consulta:leer', 'consulta:detalle'],
});

const auditorHeader = JSON.stringify({
  id: 22,
  username: 'auditor',
  nombreCompleto: 'Auditor Auditable',
  sessionId: 200,
  roles: ['auditor'],
  permisos: ['auditoria:leer'],
});

const sinAuditoriaHeader = JSON.stringify({
  id: 33,
  username: 'consultor2',
  nombreCompleto: 'Sin permiso auditoría',
  sessionId: 300,
  roles: ['consultor'],
  permisos: ['consulta:leer'],
});

function lastAuditEntry(): Record<string, unknown> {
  const calls = auditCreateMock.mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  const last = calls[calls.length - 1] as unknown as [{ data: Record<string, unknown> }];
  return last[0].data;
}

beforeEach(() => {
  auditCreateMock.mockClear();
  auditFindManyMock.mockClear();
  auditCountMock.mockClear();
  vi.restoreAllMocks();
});

// ───────────── Flujo 1: consulta exitosa ─────────────
describe('Auditoría — flujo consulta exitosa', () => {
  it('registra accion=consulta:formacion con statusCode 200 y cantidadRegistros', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          items: [
            { id: 1, tipo_formacion: 'militar', apellido_nombre: 'A' },
            { id: 2, tipo_formacion: 'militar', apellido_nombre: 'B' },
          ],
          page: 1,
          page_size: 20,
          total: 2,
        }),
        { status: 200 },
      ),
    );

    const res = await request(app)
      .get('/formacion/consulta?tipo_formacion=militar&page=1&page_size=20')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    const audit = lastAuditEntry();
    expect(audit).toMatchObject({
      idUsuario: 11,
      accion: 'consulta:formacion',
      metodoHttp: 'GET',
      statusCode: 200,
      resultado: 'exito',
      cantidadRegistros: 2,
    });
    expect(String(audit.endpoint)).toContain('/formacion/consulta');
    expect(audit.filtrosAplicados).toMatchObject({ tipo_formacion: 'militar' });
    expect(typeof audit.duracionMs).toBe('number');
  });
});

// ───────────── Flujo 2: detalle exitoso ─────────────
describe('Auditoría — flujo detalle exitoso', () => {
  it('registra accion=consulta:detalle con id en filtros', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: { id: 42, tipo_formacion: 'idioma', apellido_nombre: 'X' },
        }),
        { status: 200 },
      ),
    );

    const res = await request(app)
      .get('/formacion/42')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(200);
    const audit = lastAuditEntry();
    expect(audit).toMatchObject({
      idUsuario: 11,
      accion: 'consulta:detalle',
      statusCode: 200,
      resultado: 'exito',
      cantidadRegistros: 1,
    });
    expect(String(audit.endpoint)).toContain('/formacion/42');
  });
});

// ───────────── Flujo 3: certificado denegado por RBAC ─────────────
describe('Auditoría — flujo certificado denegado (403)', () => {
  it('registra resultado=denegado y NO llama al upstream', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const res = await request(app)
      .get('/formacion/42/certificado')
      .set('X-Test-User', consultorHeader);

    expect(res.status).toBe(403);
    expect(fetchSpy).not.toHaveBeenCalled();
    const audit = lastAuditEntry();
    expect(audit).toMatchObject({
      idUsuario: 11,
      statusCode: 403,
      resultado: 'denegado',
    });
    expect(typeof audit.accion).toBe('string');
    expect(String(audit.endpoint)).toContain('/formacion/');
  });
});

// ───────────── Flujo 4: consulta de auditoría ─────────────
describe('Auditoría — endpoint /auditoria', () => {
  it('200 cuando el usuario tiene auditoria:leer y respeta shape paginado', async () => {
    auditFindManyMock.mockResolvedValueOnce([
      {
        id: 1n,
        idUsuario: 11,
        timestampUtc: new Date('2025-01-01T10:00:00Z'),
        accion: 'consulta:formacion',
        endpoint: '/formacion/consulta',
        metodoHttp: 'GET',
        filtrosAplicados: { tipo_formacion: 'militar' },
        statusCode: 200,
        resultado: 'exito',
        cantidadRegistros: 2,
        ipOrigen: '127.0.0.1',
        duracionMs: 12,
        usuario: { username: 'consultor', nombreCompleto: 'Consultor Auditable' },
      },
    ]);
    auditCountMock.mockResolvedValueOnce(1);

    const res = await request(app)
      .get('/auditoria?page=1&pageSize=20')
      .set('X-Test-User', auditorHeader);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      page: 1,
      pageSize: 20,
      total: 1,
    });
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBe(1);
    const item = res.body.items[0];
    expect(typeof item.id).toBe('string'); // BigInt serializado
    expect(item).toHaveProperty('accion', 'consulta:formacion');
    expect(item).toHaveProperty('resultado', 'exito');
  });

  it('403 cuando el usuario NO tiene auditoria:leer', async () => {
    const res = await request(app)
      .get('/auditoria')
      .set('X-Test-User', sinAuditoriaHeader);

    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({ error: 'Permiso insuficiente' });
    expect(res.body.detalle).toContain('auditoria:leer');
  });
});
