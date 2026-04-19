import { Router } from 'express';
import { formaciones, type FormacionMock } from '../data/formaciones.js';

export const formacionesRouter = Router();

// --- Middleware de simulación de errores/timeout ---
formacionesRouter.use((req, res, next) => {
  const simError = req.headers['x-mock-error'] as string | undefined;
  if (simError === 'timeout') {
    // No responde — simula timeout del lado consumidor
    return;
  }
  if (simError === '500') {
    res.status(500).json({ error: 'Error interno simulado del servicio de personal' });
    return;
  }
  if (simError === '503') {
    res.status(503).json({ error: 'Servicio de personal temporalmente no disponible' });
    return;
  }
  next();
});

// GET /externa/v1/formaciones — consulta con filtros
formacionesRouter.get('/', (req, res) => {
  const q = req.query;

  // --- tipo_formacion es obligatorio (RN-01: filtro raíz) ---
  if (!q.tipo_formacion) {
    res.status(400).json({
      error: 'El parámetro tipo_formacion es obligatorio',
      detalle: 'Debe indicar militar, civil o idioma (RN-01)',
    });
    return;
  }

  const tiposValidos = ['militar', 'civil', 'idioma'];
  if (!tiposValidos.includes(q.tipo_formacion as string)) {
    res.status(400).json({
      error: 'Valor inválido para tipo_formacion',
      detalle: `Valores permitidos: ${tiposValidos.join(', ')}`,
    });
    return;
  }

  let resultado: FormacionMock[] = [...formaciones];

  // --- Filtro por tipo_formacion (ya validado arriba) ---
  resultado = resultado.filter((f) => f.tipo_formacion === q.tipo_formacion);

  // --- Filtros militares ---
  if (q.categoria_militar) {
    resultado = resultado.filter((f) => f.categoria_militar === q.categoria_militar);
  }
  if (q.aptitud_capacitacion) {
    const busqueda = (q.aptitud_capacitacion as string).toLowerCase();
    resultado = resultado.filter(
      (f) => f.aptitud_capacitacion?.toLowerCase().includes(busqueda),
    );
  }
  if (q.compromiso_servicios_vigente !== undefined) {
    const val = q.compromiso_servicios_vigente === 'true';
    resultado = resultado.filter((f) => f.compromiso_servicios_vigente === val);
  }

  // --- Filtros civiles (VAC-01: catálogo pendiente — filtros placeholder) ---
  if (q.titulo_civil) {
    const busqueda = (q.titulo_civil as string).toLowerCase();
    resultado = resultado.filter(
      (f) => f.titulo_civil?.toLowerCase().includes(busqueda),
    );
  }
  if (q.institucion_civil) {
    const busqueda = (q.institucion_civil as string).toLowerCase();
    resultado = resultado.filter(
      (f) => f.institucion_civil?.toLowerCase().includes(busqueda),
    );
  }

  // --- Filtros de idioma ---
  if (q.tipo_acreditacion_idioma) {
    resultado = resultado.filter((f) => f.tipo_acreditacion_idioma === q.tipo_acreditacion_idioma);
  }
  if (q.idioma) {
    resultado = resultado.filter((f) => f.idioma === q.idioma);
  }
  if (q.institucion) {
    const busqueda = (q.institucion as string).toLowerCase();
    resultado = resultado.filter((f) => f.institucion?.toLowerCase().includes(busqueda));
  }
  if (q.nivel_idioma) {
    resultado = resultado.filter((f) => f.nivel_idioma === q.nivel_idioma);
  }

  // --- Filtros transversales ---
  if (q.dni) {
    resultado = resultado.filter((f) => f.dni === q.dni);
  }
  if (q.legajo) {
    resultado = resultado.filter((f) => f.legajo === q.legajo);
  }
  if (q.apellido_nombre) {
    const busqueda = (q.apellido_nombre as string).toLowerCase();
    resultado = resultado.filter((f) => f.apellido_nombre.toLowerCase().includes(busqueda));
  }
  if (q.unidad) {
    resultado = resultado.filter((f) => f.unidad === q.unidad);
  }
  if (q.jerarquia) {
    resultado = resultado.filter((f) => f.grado === q.jerarquia);
  }
  if (q.estado_vigencia) {
    resultado = resultado.filter((f) => f.estado_vigencia === q.estado_vigencia);
  }
  if (q.tiene_documentacion !== undefined) {
    const val = q.tiene_documentacion === 'true';
    resultado = resultado.filter((f) => f.tiene_documentacion === val);
  }
  if (q.certificado_descargable !== undefined) {
    const val = q.certificado_descargable === 'true';
    resultado = resultado.filter((f) => f.certificado_descargable === val);
  }

  // Fechas de vencimiento
  if (q.fecha_vencimiento_desde) {
    const desde = q.fecha_vencimiento_desde as string;
    resultado = resultado.filter(
      (f) => f.fecha_vencimiento && f.fecha_vencimiento >= desde,
    );
  }
  if (q.fecha_vencimiento_hasta) {
    const hasta = q.fecha_vencimiento_hasta as string;
    resultado = resultado.filter(
      (f) => f.fecha_vencimiento && f.fecha_vencimiento <= hasta,
    );
  }

  // Búsqueda textual general (q)
  if (q.q) {
    const texto = (q.q as string).toLowerCase();
    resultado = resultado.filter((f) =>
      f.apellido_nombre.toLowerCase().includes(texto) ||
      f.aptitud_capacitacion?.toLowerCase().includes(texto) ||
      f.titulo_civil?.toLowerCase().includes(texto) ||
      f.idioma?.toLowerCase().includes(texto) ||
      f.institucion?.toLowerCase().includes(texto) ||
      f.institucion_civil?.toLowerCase().includes(texto) ||
      f.unidad.toLowerCase().includes(texto),
    );
  }

  // Paginación
  const page = Math.max(1, parseInt(q.page as string, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(q.page_size as string, 10) || 20));
  const start = (page - 1) * pageSize;
  const paginado = resultado.slice(start, start + pageSize);

  res.json({
    items: paginado,
    page,
    page_size: pageSize,
    total: resultado.length,
    source: 'mock-api-area-personal',
  });
});

// GET /externa/v1/formaciones/:id — detalle de un registro
formacionesRouter.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const registro = formaciones.find((f) => f.id === id);
  if (!registro) {
    res.status(404).json({ error: `Formación con id ${id} no encontrada` });
    return;
  }
  res.json({ data: registro });
});

// GET /externa/v1/formaciones/:id/certificado — descarga simulada
formacionesRouter.get('/:id/certificado', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const registro = formaciones.find((f) => f.id === id);
  if (!registro) {
    res.status(404).json({ error: `Formación con id ${id} no encontrada` });
    return;
  }
  if (!registro.certificado_descargable) {
    res.status(404).json({ error: 'No existe certificado descargable para este registro' });
    return;
  }
  // Simula un PDF devolviendo texto plano con content-type apropiado
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="certificado_${id}.pdf"`);
  res.send(`%PDF-1.4 mock certificado formacion id=${id} ${registro.apellido_nombre}`);
});
