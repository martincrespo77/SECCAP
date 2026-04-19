import { Router } from 'express';
import {
  tiposFormacion,
  categoriasMilitares,
  aptitudesPorCategoria,
  idiomas,
  nivelesIdioma,
  instituciones,
} from '../data/catalogos.js';

export const catalogosRouter = Router();

// GET /externa/v1/catalogos/tipos-formacion
catalogosRouter.get('/tipos-formacion', (_req, res) => {
  res.json({ data: tiposFormacion });
});

// GET /externa/v1/catalogos/categorias-militares
catalogosRouter.get('/categorias-militares', (_req, res) => {
  res.json({ data: categoriasMilitares });
});

// GET /externa/v1/catalogos/aptitudes?categoria_militar=CM-01
catalogosRouter.get('/aptitudes', (req, res) => {
  const categoria = req.query.categoria_militar as string | undefined;
  if (!categoria) {
    res.status(400).json({ error: 'Se requiere el parámetro categoria_militar' });
    return;
  }
  const lista = aptitudesPorCategoria[categoria];
  if (!lista) {
    res.status(404).json({ error: `Categoría militar '${categoria}' no encontrada` });
    return;
  }
  res.json({ data: lista.map((nombre) => ({ nombre })) });
});

// GET /externa/v1/catalogos/idiomas
catalogosRouter.get('/idiomas', (_req, res) => {
  res.json({ data: idiomas.map((nombre) => ({ nombre })) });
});

// GET /externa/v1/catalogos/niveles-idioma
catalogosRouter.get('/niveles-idioma', (_req, res) => {
  res.json({ data: nivelesIdioma });
});

// GET /externa/v1/catalogos/instituciones?idioma=Inglés
catalogosRouter.get('/instituciones', (req, res) => {
  const idioma = req.query.idioma as string | undefined;
  if (!idioma) {
    res.status(400).json({ error: 'Se requiere el parámetro idioma' });
    return;
  }
  const lista = instituciones[idioma];
  if (!lista) {
    res.status(404).json({ error: `Idioma '${idioma}' no encontrado en catálogo de instituciones` });
    return;
  }
  res.json({ data: lista.map((nombre) => ({ nombre })) });
});
