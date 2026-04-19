/**
 * Mapper: transforma la respuesta cruda de la API externa
 * al DTO interno que el proxy expone al frontend.
 *
 * Anti-Corruption Layer semántico — desacopla el contrato
 * externo del contrato del proxy.
 */

// Forma cruda que llega de la API externa / mock
export interface FormacionExterna {
  id: number;
  tipo_formacion: string;
  dni: string;
  legajo: string;
  apellido_nombre: string;
  grado: string;
  unidad: string;
  categoria_militar?: string;
  aptitud_capacitacion?: string;
  compromiso_servicios_vigente?: boolean;
  titulo_civil?: string;
  institucion_civil?: string;
  tipo_acreditacion_idioma?: string;
  idioma?: string;
  institucion?: string;
  nivel_idioma?: string;
  tiene_documentacion: boolean;
  certificado_descargable: boolean;
  estado_vigencia: string;
  fecha_vencimiento?: string;
  fecha_obtencion: string;
  observaciones?: string;
}

// DTO limpio que expone el proxy al frontend
export interface FormacionDTO {
  id: number;
  tipoFormacion: string;
  // Persona — campos sensibles (sujetos a poda)
  dni?: string;
  legajo?: string;
  apellidoNombre: string;
  grado: string;
  unidad: string;
  // Militar
  categoriaMilitar?: string;
  aptitudCapacitacion?: string;
  compromisoServiciosVigente?: boolean;
  // Civil
  tituloCivil?: string;
  institucionCivil?: string;
  // Idioma
  tipoAcreditacionIdioma?: string;
  idioma?: string;
  institucion?: string;
  nivelIdioma?: string;
  // Estado
  tieneDocumentacion: boolean;
  certificadoDescargable: boolean;
  estadoVigencia: string;
  fechaVencimiento?: string;
  fechaObtencion: string;
  observaciones?: string;
}

/**
 * Mapea un registro externo al DTO interno.
 * Solo renombra a camelCase y mantiene la estructura.
 * La poda se aplica después, por separado.
 */
export function mapFormacion(ext: FormacionExterna): FormacionDTO {
  return {
    id: ext.id,
    tipoFormacion: ext.tipo_formacion,
    dni: ext.dni,
    legajo: ext.legajo,
    apellidoNombre: ext.apellido_nombre,
    grado: ext.grado,
    unidad: ext.unidad,
    categoriaMilitar: ext.categoria_militar,
    aptitudCapacitacion: ext.aptitud_capacitacion,
    compromisoServiciosVigente: ext.compromiso_servicios_vigente,
    tituloCivil: ext.titulo_civil,
    institucionCivil: ext.institucion_civil,
    tipoAcreditacionIdioma: ext.tipo_acreditacion_idioma,
    idioma: ext.idioma,
    institucion: ext.institucion,
    nivelIdioma: ext.nivel_idioma,
    tieneDocumentacion: ext.tiene_documentacion,
    certificadoDescargable: ext.certificado_descargable,
    estadoVigencia: ext.estado_vigencia,
    fechaVencimiento: ext.fecha_vencimiento,
    fechaObtencion: ext.fecha_obtencion,
    observaciones: ext.observaciones,
  };
}
