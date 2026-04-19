import { Router } from 'express';
import { fetchExterna, ExternalApiError } from '../services/external-api.js';
import { mapFormacion, type FormacionExterna } from '../services/mapper.js';
import { podarFormaciones } from '../services/poda.js';
import { registrarAuditoria, auditFromReq } from '../services/auditoria.js';
import { logger } from '../logger.js';

export const consultaRouter = Router();

// Tipos permitidos para tipo_formacion (RN-01: filtro raíz obligatorio)
const TIPOS_VALIDOS = ['militar', 'civil', 'idioma'];

// Query params que se reenvían a la API externa
const FILTROS_PERMITIDOS: Record<string, string> = {
  tipo_formacion: 'tipo_formacion',
  categoria_militar: 'categoria_militar',
  aptitud_capacitacion: 'aptitud_capacitacion',
  compromiso_servicios_vigente: 'compromiso_servicios_vigente',
  titulo_civil: 'titulo_civil',
  institucion_civil: 'institucion_civil',
  tipo_acreditacion_idioma: 'tipo_acreditacion_idioma',
  idioma: 'idioma',
  institucion: 'institucion',
  nivel_idioma: 'nivel_idioma',
  tiene_documentacion: 'tiene_documentacion',
  certificado_descargable: 'certificado_descargable',
  estado_vigencia: 'estado_vigencia',
  fecha_vencimiento_desde: 'fecha_vencimiento_desde',
  fecha_vencimiento_hasta: 'fecha_vencimiento_hasta',
  dni: 'dni',
  legajo: 'legajo',
  apellido_nombre: 'apellido_nombre',
  unidad: 'unidad',
  jerarquia: 'jerarquia',
  q: 'q',
  page: 'page',
  page_size: 'page_size',
};

// Regex para sanear valores de texto (prevenir inyección)
const TEXTO_SEGURO = /^[\p{L}\p{N}\s\-.,áéíóúüñÁÉÍÓÚÜÑ()/]+$/u;
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ENTERO_POSITIVO_REGEX = /^[1-9]\d*$/;
const BOOLEANO_REGEX = /^(true|false)$/;

interface UpstreamResponse {
  items: FormacionExterna[];
  page: number;
  page_size: number;
  total: number;
}

/**
 * Valida y sanea los query params entrantes.
 * Retorna los filtros limpios para reenviar al upstream, o un string de error.
 */
function validarFiltros(query: Record<string, unknown>): Record<string, string> | string {
  const filtros: Record<string, string> = {};

  // tipo_formacion es obligatorio (RN-01)
  if (!query.tipo_formacion) {
    return 'El parámetro tipo_formacion es obligatorio (militar, civil, idioma)';
  }

  for (const [param, upstream] of Object.entries(FILTROS_PERMITIDOS)) {
    const valor = query[param];
    if (valor === undefined || valor === '') continue;

    const str = String(valor);

    // Validaciones específicas por tipo de parámetro
    if (param === 'tipo_formacion') {
      if (!TIPOS_VALIDOS.includes(str)) {
        return `Valor inválido para tipo_formacion: ${str}. Permitidos: ${TIPOS_VALIDOS.join(', ')}`;
      }
    } else if (param === 'fecha_vencimiento_desde' || param === 'fecha_vencimiento_hasta') {
      if (!FECHA_REGEX.test(str)) {
        return `Formato inválido para ${param}: se espera AAAA-MM-DD`;
      }
    } else if (param === 'page' || param === 'page_size') {
      if (!ENTERO_POSITIVO_REGEX.test(str)) {
        return `${param} debe ser un número entero positivo`;
      }
    } else if (
      param === 'compromiso_servicios_vigente' ||
      param === 'tiene_documentacion' ||
      param === 'certificado_descargable'
    ) {
      if (!BOOLEANO_REGEX.test(str)) {
        return `${param} debe ser true o false`;
      }
    } else {
      // Campos de texto: sanear contra inyección
      if (str.length > 200) {
        return `${param} excede el largo máximo permitido (200 caracteres)`;
      }
      if (!TEXTO_SEGURO.test(str)) {
        return `${param} contiene caracteres no permitidos`;
      }
    }

    filtros[upstream] = str;
  }

  return filtros;
}

// --- GET /formacion/consulta ---
consultaRouter.get('/', async (req, res) => {
  const inicio = Date.now();
  const user = req.user!;
  const auditBase = auditFromReq(req);

  // 1. Validar y sanear filtros
  const filtrosOrError = validarFiltros(req.query as Record<string, unknown>);

  if (typeof filtrosOrError === 'string') {
    const duracionMs = Date.now() - inicio;
    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:formacion',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: req.query as Record<string, unknown>,
      statusCode: 400,
      resultado: 'error_cliente',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });

    res.status(400).json({
      error: 'Filtros inválidos',
      detalle: filtrosOrError,
    });
    return;
  }

  // 2. Consultar API externa
  try {
    const upstream = await fetchExterna<UpstreamResponse>(
      '/externa/v1/formaciones',
      filtrosOrError,
    );

    // 3. Mapear respuesta externa → DTO interno
    const mapeados = upstream.items.map(mapFormacion);

    // 4. Aplicar poda según permisos del usuario
    const podados = podarFormaciones(mapeados, user.permisos);

    const duracionMs = Date.now() - inicio;

    // 5. Auditoría de éxito
    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:formacion',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: filtrosOrError,
      statusCode: 200,
      resultado: 'exito',
      cantidadRegistros: upstream.total,
      duracionMs,
      ...auditBase,
    });

    // 6. Responder
    res.json({
      items: podados,
      page: upstream.page,
      pageSize: upstream.page_size,
      total: upstream.total,
    });
  } catch (err) {
    const duracionMs = Date.now() - inicio;

    if (err instanceof ExternalApiError) {
      const status = err.status === 504 ? 504 : err.status >= 500 ? 502 : err.status;

      await registrarAuditoria({
        idUsuario: user.id,
        accion: 'consulta:formacion',
        endpoint: req.originalUrl,
        metodoHttp: 'GET',
        filtrosAplicados: filtrosOrError,
        statusCode: status,
        resultado: 'error_upstream',
        cantidadRegistros: 0,
        duracionMs,
        ...auditBase,
      });

      res.status(status).json({
        error: 'Error al consultar formaciones',
        detalle: err.message,
      });
      return;
    }

    logger.error({ err }, 'Error inesperado en consulta de formaciones');

    await registrarAuditoria({
      idUsuario: user.id,
      accion: 'consulta:formacion',
      endpoint: req.originalUrl,
      metodoHttp: 'GET',
      filtrosAplicados: filtrosOrError,
      statusCode: 500,
      resultado: 'error_interno',
      cantidadRegistros: 0,
      duracionMs,
      ...auditBase,
    });

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
