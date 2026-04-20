import { Router } from 'express';
import { prisma } from '../prisma.js';
import { logger } from '../logger.js';

export const auditoriaRouter = Router();

const ENTERO_POSITIVO = /^[1-9]\d*$/;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TEXTO_SEGURO = /^[\p{L}\p{N}\s\-.,:/áéíóúüñÁÉÍÓÚÜÑ()_]+$/u;

const ACCIONES_VALIDAS = [
  'consulta:formacion',
  'consulta:detalle',
  'consulta:certificado',
  'catalogos',
  'auth:login',
];

const RESULTADOS_VALIDOS = [
  'exito',
  'error_cliente',
  'error_upstream',
  'error_interno',
  'no_encontrado',
  'denegado',
];

// --- GET /auditoria ---
auditoriaRouter.get('/', async (req, res) => {
  try {
    const query = req.query as Record<string, string | undefined>;
    const errores: string[] = [];

    // Paginación
    let page = 1;
    let pageSize = 20;

    if (query.page) {
      if (!ENTERO_POSITIVO.test(query.page)) {
        errores.push('page debe ser un número entero positivo');
      } else {
        page = parseInt(query.page, 10);
      }
    }

    if (query.page_size) {
      if (!ENTERO_POSITIVO.test(query.page_size)) {
        errores.push('page_size debe ser un número entero positivo');
      } else {
        pageSize = Math.min(parseInt(query.page_size, 10), 100);
      }
    }

    // Filtros
    if (query.fecha_desde && !FECHA_REGEX.test(query.fecha_desde)) {
      errores.push('fecha_desde debe tener formato AAAA-MM-DD');
    }
    if (query.fecha_hasta && !FECHA_REGEX.test(query.fecha_hasta)) {
      errores.push('fecha_hasta debe tener formato AAAA-MM-DD');
    }
    if (query.accion && !ACCIONES_VALIDAS.includes(query.accion)) {
      errores.push(`accion inválida. Permitidas: ${ACCIONES_VALIDAS.join(', ')}`);
    }
    if (query.resultado && !RESULTADOS_VALIDOS.includes(query.resultado)) {
      errores.push(`resultado inválido. Permitidos: ${RESULTADOS_VALIDOS.join(', ')}`);
    }
    if (query.id_usuario && !ENTERO_POSITIVO.test(query.id_usuario)) {
      errores.push('id_usuario debe ser un número entero positivo');
    }
    if (query.usuario && !TEXTO_SEGURO.test(query.usuario)) {
      errores.push('usuario contiene caracteres no permitidos');
    }
    if (query.usuario && query.usuario.length > 50) {
      errores.push('usuario excede el largo máximo (50 caracteres)');
    }
    if (query.endpoint && !TEXTO_SEGURO.test(query.endpoint)) {
      errores.push('endpoint contiene caracteres no permitidos');
    }
    if (query.endpoint && query.endpoint.length > 200) {
      errores.push('endpoint excede el largo máximo (200 caracteres)');
    }

    if (errores.length > 0) {
      res.status(400).json({ error: 'Filtros inválidos', detalle: errores });
      return;
    }

    // Construir where
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (query.fecha_desde || query.fecha_hasta) {
      where.timestampUtc = {};
      if (query.fecha_desde) {
        where.timestampUtc.gte = new Date(`${query.fecha_desde}T00:00:00Z`);
      }
      if (query.fecha_hasta) {
        where.timestampUtc.lte = new Date(`${query.fecha_hasta}T23:59:59.999Z`);
      }
    }

    if (query.accion) where.accion = query.accion;
    if (query.resultado) where.resultado = query.resultado;
    if (query.endpoint) where.endpoint = { contains: query.endpoint };
    if (query.id_usuario) where.idUsuario = parseInt(query.id_usuario, 10);

    if (query.usuario) {
      where.usuario = { username: { contains: query.usuario, mode: 'insensitive' } };
    }

    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestampUtc: 'desc' },
        skip,
        take: pageSize,
        select: {
          id: true,
          idUsuario: true,
          timestampUtc: true,
          accion: true,
          endpoint: true,
          metodoHttp: true,
          filtrosAplicados: true,
          statusCode: true,
          resultado: true,
          cantidadRegistros: true,
          ipOrigen: true,
          duracionMs: true,
          usuario: {
            select: { username: true, nombreCompleto: true },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Serializar BigInt id a string para JSON
    const itemsSafe = items.map((item) => ({
      ...item,
      id: item.id.toString(),
    }));

    res.json({
      items: itemsSafe,
      page,
      pageSize,
      total,
    });
  } catch (err) {
    logger.error({ err }, 'Error al consultar auditoría');
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
