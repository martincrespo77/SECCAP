export interface TipoFormacion {
  codigo: string;
  nombre: string;
}

export interface CategoriaMilitar {
  codigo: string;
  nombre: string;
}

export interface AptitudItem {
  nombre: string;
  [key: string]: unknown;
}

export interface IdiomaItem {
  nombre: string;
  [key: string]: unknown;
}

export interface NivelIdiomaItem {
  codigo: string;
  nombre: string;
}

export interface InstitucionItem {
  nombre: string;
  [key: string]: unknown;
}
