export interface FormacionDTO {
  id: number;
  tipoFormacion: string;
  dni?: string;
  legajo?: string;
  apellidoNombre: string;
  grado: string;
  unidad: string;
  categoriaMilitar?: string;
  aptitudCapacitacion?: string;
  compromisoServiciosVigente?: boolean;
  tituloCivil?: string;
  institucionCivil?: string;
  tipoAcreditacionIdioma?: string;
  idioma?: string;
  institucion?: string;
  nivelIdioma?: string;
  tieneDocumentacion: boolean;
  certificadoDescargable: boolean;
  estadoVigencia: string;
  fechaVencimiento?: string;
  fechaObtencion: string;
  observaciones?: string;
}

export interface ConsultaResponse {
  items: FormacionDTO[];
  page: number;
  pageSize: number;
  total: number;
}

export interface FiltrosConsulta {
  tipo_formacion: string;
  categoria_militar?: string;
  aptitud_capacitacion?: string;
  idioma?: string;
  nivel_idioma?: string;
  institucion?: string;
  page?: number;
  page_size?: number;
}
