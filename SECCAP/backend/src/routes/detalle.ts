import { Router } from 'express';
import { fetchExterna, fetchExternaRaw, ExternalApiError } from '../services/external-api.js';
import { mapFormacion, type FormacionExterna } from '../services/mapper.js';
import { podarFormacion } from '../services/poda.js';
import { registrarAuditoria, auditFromReq } from '../services/auditoria.js';
import { authorize } from '../middleware/authorize.js';
import { logger } from '../logger.js';

export const detalleRouter = Router();

const ID_REGEX = /^[1-9]\d*$/;

interface DetalleUpstream {
  data: FormacionExterna;
}

// --- GET /formacion/:id ---
detalleRouter.get('/:id', authorize('consulta:leer'), async (req, res) => {
  const inicio = Date.now();
  const user = req.user!;
  const auditBase = auditFromReq(req);
  const id = req.params.id as string;

  // Validar id
  if (!ID_REGEX.test(id)) {
    const duracionMs = Date.now() - inicio;
    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:detalle',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 400,
      resultado: 'error_cliente',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });
    res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    return;
  }

  try {
    const upstream = await fetchExterna<DetalleUpstream>(
      `/externa/v1/formaciones/${id}`,
    );

    const mapeado = mapFormacion(upstream.data);
    const podado = podarFormacion(mapeado, user.permisos);
    const duracionMs = Date.now() - inicio;

    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:detalle',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 200,
      resultado: 'exito',
      cantidadRegistros: 1,
      duracionMs,
      ...auditBase,
    });

    res.json(podado);
  } catch (err) {
    const duracionMs = Date.now() - inicio;

    if (err instanceof ExternalApiError) {
      const status = err.status === 404 ? 404
        : err.status === 504 ? 504
        : err.status >= 500 ? 502
        : err.status;

      await registrarAuditoria({
        idUsuario: user.id,
        accion: 'consulta:detalle',
        endpoint: req.originalUrl,
        metodoHttp: 'GET',
        filtrosAplicados: { id },
        statusCode: status,
        resultado: status === 404 ? 'no_encontrado' : 'error_upstream',
        cantidadRegistros: 0,
        duracionMs,
        ...auditBase,
      });

      res.status(status).json({
        error: status === 404 ? 'Formación no encontrada' : 'Error al consultar detalle',
        detalle: err.message,
      });
      return;
    }

    logger.error({ err }, 'Error inesperado en detalle de formación');

    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:detalle',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 500,
      resultado: 'error_interno',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// --- GET /formacion/:id/certificado ---
// No usa authorize() como middleware porque el 403 denegado debe quedar auditado.
// La verificación de permiso se hace dentro del handler para poder llamar a
// registrarAuditoria() antes de responder.
detalleRouter.get('/:id/certificado', async (req, res) => {
  const inicio = Date.now();
  const user = req.user!;
  const auditBase = auditFromReq(req);
  const id = req.params.id as string;

  // Verificar permiso consulta:certificado (inline para poder auditar el 403)
  if (!user.permisos.includes('consulta:certificado')) {
    const duracionMs = Date.now() - inicio;
    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:certificado',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 403,
      resultado: 'denegado',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });
    res.status(403).json({
      error: 'Permiso insuficiente',
      detalle: 'Se requiere uno de: consulta:certificado',
    });
    return;
  }

  // Validar id
  if (!ID_REGEX.test(id)) {
    const duracionMs = Date.now() - inicio;
    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:certificado',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 400,
      resultado: 'error_cliente',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });
    res.status(400).json({ error: 'El id debe ser un número entero positivo' });
    return;
  }

  try {
    const upstream = await fetchExternaRaw(
      `/externa/v1/formaciones/${id}/certificado`,
    );

    const duracionMs = Date.now() - inicio;

    // Preservar headers del upstream
    const contentType = upstream.headers.get('content-type');
    const contentDisposition = upstream.headers.get('content-disposition');

    if (contentType) res.setHeader('Content-Type', contentType);
    if (contentDisposition) res.setHeader('Content-Disposition', contentDisposition);

    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:certificado',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 200,
      resultado: 'exito',
      cantidadRegistros: 1,
      duracionMs,
      ...auditBase,
    });

    // Pipe the body
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.status(200).send(buffer);
  } catch (err) {
    const duracionMs = Date.now() - inicio;

    if (err instanceof ExternalApiError) {
      const status = err.status === 404 ? 404
        : err.status === 504 ? 504
        : err.status >= 500 ? 502
        : err.status;

      await registrarAuditoria({
        idUsuario: user.id,
        accion: 'consulta:certificado',
        endpoint: req.originalUrl,
        metodoHttp: 'GET',
        filtrosAplicados: { id },
        statusCode: status,
        resultado: status === 404 ? 'no_encontrado' : 'error_upstream',
        cantidadRegistros: 0,
        duracionMs,
        ...auditBase,
      });

      res.status(status).json({
        error: status === 404 ? 'Certificado no encontrado' : 'Error al descargar certificado',
        detalle: err.message,
      });
      return;
    }

    logger.error({ err }, 'Error inesperado en descarga de certificado');

    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:certificado',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: { id },
      statusCode: 500,
      resultado: 'error_interno',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
