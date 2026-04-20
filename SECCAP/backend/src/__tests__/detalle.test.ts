import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { prisma } from '../prisma.js';

/*
 * Tests de integración: GET /formacion/:id  y  GET /formacion/:id/certificado
 * Requieren:
 *   - PostgreSQL corriendo (contenedor seccap-pg) con seed aplicado
 *   - Mock-API corriendo en puerto 3002
 */

let consultorToken: string; // consulta:leer + consulta:detalle + consulta:certificado
let auditorToken: string;   // consulta:leer (sin consulta:detalle, sin consulta:certificado)

beforeAll(async () => {
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

// ═══════════════════ DETALLE ═══════════════════

describe('Detalle — auth y RBAC', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/formacion/1');
    expect(res.status).toBe(401);
  });

  it('devuelve 401 con token inválido', async () => {
    const res = await request(app)
      .get('/formacion/1')
      .set('Authorization', 'Bearer token.invalido.xyz');
    expect(res.status).toBe(401);
  });
});

describe('Detalle — validación de id', () => {
  it('devuelve 400 con id no numérico', async () => {
    const res = await request(app)
      .get('/formacion/abc')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('entero positivo');
  });

  it('devuelve 400 con id=0', async () => {
    const res = await request(app)
      .get('/formacion/0')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(400);
  });
});

describe('Detalle — consulta exitosa', () => {
  it('devuelve 404 si el id no existe', async () => {
    const res = await request(app)
      .get('/formacion/99999')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toContain('no encontrada');
  });

  it('devuelve detalle de formación con campos mapeados', async () => {
    const res = await request(app)
      .get('/formacion/1')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('tipoFormacion', 'militar');
    expect(res.body).toHaveProperty('apellidoNombre');
    expect(res.body).toHaveProperty('grado');
    expect(res.body).toHaveProperty('estadoVigencia');
  });
});

describe('Detalle — poda de campos sensibles', () => {
  it('consultor (consulta:detalle) ve DNI y legajo', async () => {
    const res = await request(app)
      .get('/formacion/1')
      .set('Authorization', `Bearer ${consultorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('dni');
    expect(res.body).toHaveProperty('legajo');
  });

  it('auditor (sin consulta:detalle) NO ve DNI ni legajo', async () => {
    const res = await request(app)
      .get('/formacion/1')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(res.status).toBe(200);
    expect(res.body).not.toHaveProperty('dni');
    expect(res.body).not.toHaveProperty('legajo');
    expect(res.body).toHaveProperty('apellidoNombre');
  });
});

describe('Detalle — auditoría', () => {
  it('registra auditoría en consulta de detalle exitosa', async () => {
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:detalle', resultado: 'exito' },
    });

    await request(app)
      .get('/formacion/1')
      .set('Authorization', `Bearer ${consultorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:detalle', resultado: 'exito' },
    });

    expect(despues).toBeGreaterThan(antes);
  });
});

// ═══════════════════ CERTIFICADO ═══════════════════

describe('Certificado — auth y RBAC', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/formacion/1/certificado');
    expect(res.status).toBe(401);
  });

  it('devuelve 403 si el rol no tiene consulta:certificado', async () => {
    // auditor no tiene consulta:certificado
    const res = await request(app)
      .get('/formacion/1/certificado')
      .set('Authorization', `Bearer ${auditorToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Permiso insuficiente');
  });

  it('registra auditoría del 403 denegado de certificado', async () => {
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', statusCode: 403, resultado: 'denegado' },
    });

    await request(app)
      .get('/formacion/1/certificado')
      .set('Authorization', `Bearer ${auditorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', statusCode: 403, resultado: 'denegado' },
    });

    expect(despues).toBeGreaterThan(antes);
  });
});

describe('Certificado — descarga', () => {
  it('devuelve 404 si el registro no existe', async () => {
    const res = await request(app)
      .get('/formacion/99999/certificado')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(404);
  });

  it('devuelve 404 si el registro existe pero no tiene certificado', async () => {
    // id=3 tiene certificado_descargable: false
    const res = await request(app)
      .get('/formacion/3/certificado')
      .set('Authorization', `Bearer ${consultorToken}`);
    expect(res.status).toBe(404);
  });

  it('devuelve 200 con content-type PDF cuando el certificado existe', async () => {
    // id=1 tiene certificado_descargable: true
    const res = await request(app)
      .get('/formacion/1/certificado')
      .set('Authorization', `Bearer ${consultorToken}`)
      .buffer(true)
      .parse((res, cb) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => cb(null, Buffer.concat(chunks)));
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toContain('certificado_1.pdf');
    // El mock devuelve texto que empieza con %PDF
    expect(res.body.toString()).toContain('%PDF');
  });
});

describe('Certificado — auditoría', () => {
  it('registra auditoría en descarga exitosa', async () => {
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', resultado: 'exito' },
    });

    await request(app)
      .get('/formacion/1/certificado')
      .set('Authorization', `Bearer ${consultorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', resultado: 'exito' },
    });

    expect(despues).toBeGreaterThan(antes);
  });

  it('registra auditoría en 404 de certificado', async () => {
    const antes = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', resultado: 'no_encontrado' },
    });

    await request(app)
      .get('/formacion/99999/certificado')
      .set('Authorization', `Bearer ${consultorToken}`);

    const despues = await prisma.auditLog.count({
      where: { accion: 'consulta:certificado', resultado: 'no_encontrado' },
    });

    expect(despues).toBeGreaterThan(antes);
  });
});
