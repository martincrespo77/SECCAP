import { api, toApiError } from './http.ts';
import type {
  AptitudItem,
  CategoriaMilitar,
  IdiomaItem,
  InstitucionItem,
  NivelIdiomaItem,
  TipoFormacion,
} from '../types/catalogos.ts';

interface ListResponse<T> {
  data: T[];
}

async function fetchLista<T>(url: string, params?: Record<string, string>): Promise<T[]> {
  try {
    const res = await api.get<ListResponse<T>>(url, { params });
    return res.data.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export function getTiposFormacion(): Promise<TipoFormacion[]> {
  return fetchLista<TipoFormacion>('/formacion/catalogos/tipos');
}

export function getCategoriasMilitares(): Promise<CategoriaMilitar[]> {
  return fetchLista<CategoriaMilitar>('/formacion/catalogos/categorias-militares');
}

export function getAptitudes(categoria: string): Promise<AptitudItem[]> {
  return fetchLista<AptitudItem>('/formacion/catalogos/aptitudes', { categoria });
}

export function getIdiomas(): Promise<IdiomaItem[]> {
  return fetchLista<IdiomaItem>('/formacion/catalogos/idiomas');
}

export function getNivelesIdioma(): Promise<NivelIdiomaItem[]> {
  return fetchLista<NivelIdiomaItem>('/formacion/catalogos/niveles-idioma');
}

export function getInstituciones(idioma: string): Promise<InstitucionItem[]> {
  return fetchLista<InstitucionItem>('/formacion/catalogos/instituciones', { idioma });
}
