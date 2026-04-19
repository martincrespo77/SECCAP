import { Router } from 'express';
import { fetchExterna, ExternalApiError } from '../services/external-api.js';
import { logger } from '../logger.js';

export const catalogosRouter = Router();

// Tipos que mapean las respuestas de la API externa
interface CatalogoItem {
  nombre: string;
  [key: string]: unknown;
}

interface CatalogoResponse {
  data: CatalogoItem[];
}

interface NivelIdioma {
  codigo: string;
  nombre: string;
}

interface NivelIdiomaResponse {
  data: NivelIdioma[];
}

interface TipoFormacion {
  id: string;
  nombre: string;
}

interface TiposFormacionResponse {
  data: TipoFormacion[];
}

interface CategoriaMilitar {
  codigo: string;
  nombre: string;
}

interface CategoriasMilitaresResponse {
  data: CategoriaMilitar[];
}

/**
 * Maneja errores de la API externa de forma uniforme.
 */
function handleExternalError(err: unknown, res: import('express').Response): void {
  if (err instanceof ExternalApiError) {
    const status = err.status === 504 ? 504 : err.status >= 500 ? 502 : err.status;
    res.status(status).json({
      error: 'Error al consultar catálogo externo',
      detalle: err.message,
    });
    return;
  }
  logger.error({ err }, 'Error inesperado en catálogos');
  res.status(500).json({ error: 'Error interno del servidor' });
}

// --- GET /formacion/catalogos/tipos ---
catalogosRouter.get('/tipos', async (_req, res) => {
  try {
    const upstream = await fetchExterna<TiposFormacionResponse>(
      '/externa/v1/catalogos/tipos-formacion',
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});

// --- GET /formacion/catalogos/categorias-militares ---
catalogosRouter.get('/categorias-militares', async (_req, res) => {
  try {
    const upstream = await fetchExterna<CategoriasMilitaresResponse>(
      '/externa/v1/catalogos/categorias-militares',
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});

// --- GET /formacion/catalogos/aptitudes?categoria=... ---
catalogosRouter.get('/aptitudes', async (req, res) => {
  const categoria = req.query.categoria as string | undefined;
  if (!categoria) {
    res.status(400).json({
      error: 'Parámetro requerido',
      detalle: 'Se requiere el parámetro "categoria" (código de categoría militar)',
    });
    return;
  }

  try {
    const upstream = await fetchExterna<CatalogoResponse>(
      '/externa/v1/catalogos/aptitudes',
      { categoria_militar: categoria },
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});

// --- GET /formacion/catalogos/idiomas ---
catalogosRouter.get('/idiomas', async (_req, res) => {
  try {
    const upstream = await fetchExterna<CatalogoResponse>(
      '/externa/v1/catalogos/idiomas',
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});

// --- GET /formacion/catalogos/niveles-idioma ---
catalogosRouter.get('/niveles-idioma', async (_req, res) => {
  try {
    const upstream = await fetchExterna<NivelIdiomaResponse>(
      '/externa/v1/catalogos/niveles-idioma',
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});

// --- GET /formacion/catalogos/instituciones?idioma=... ---
catalogosRouter.get('/instituciones', async (req, res) => {
  const idioma = req.query.idioma as string | undefined;
  if (!idioma) {
    res.status(400).json({
      error: 'Parámetro requerido',
      detalle: 'Se requiere el parámetro "idioma"',
    });
    return;
  }

  try {
    const upstream = await fetchExterna<CatalogoResponse>(
      '/externa/v1/catalogos/instituciones',
      { idioma },
    );
    res.json({ data: upstream.data });
  } catch (err) {
    handleExternalError(err, res);
  }
});
