// Dataset mock de formaciones — registros ficticios pero realistas.
// Simula lo que devolvería la API institucional del Área de Personal.

export interface FormacionMock {
  id: number;
  tipo_formacion: 'militar' | 'civil' | 'idioma';
  // persona
  dni: string;
  legajo: string;
  apellido_nombre: string;
  grado: string;
  unidad: string;
  // militar
  categoria_militar?: string;
  aptitud_capacitacion?: string;
  compromiso_servicios_vigente?: boolean;
  // civil (VAC-01: catálogo pendiente de relevamiento — campos placeholder)
  titulo_civil?: string;
  institucion_civil?: string;
  // idioma
  tipo_acreditacion_idioma?: string;
  idioma?: string;
  institucion?: string;
  nivel_idioma?: string;
  // estado
  tiene_documentacion: boolean;
  certificado_descargable: boolean;
  estado_vigencia: 'vigente' | 'vencido' | 'proximo_a_vencer' | 'sin_vencimiento';
  fecha_vencimiento?: string; // ISO date
  fecha_obtencion: string;    // ISO date
  observaciones?: string;
}

const hoy = new Date();
const dias = (n: number) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
};

export const formaciones: FormacionMock[] = [
  // --- Militares ---
  {
    id: 1, tipo_formacion: 'militar',
    dni: '30123456', legajo: 'EA-10001', apellido_nombre: 'GONZALEZ, Juan Carlos',
    grado: 'Mayor', unidad: 'Ca Cdo 601',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'Comando',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2020-03-15',
  },
  {
    id: 2, tipo_formacion: 'militar',
    dni: '30123456', legajo: 'EA-10001', apellido_nombre: 'GONZALEZ, Juan Carlos',
    grado: 'Mayor', unidad: 'Ca Cdo 601',
    categoria_militar: 'CM-04', aptitud_capacitacion: 'Fuerzas Especiales',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2021-06-20',
  },
  {
    id: 3, tipo_formacion: 'militar',
    dni: '31456789', legajo: 'EA-10002', apellido_nombre: 'RODRIGUEZ, María Laura',
    grado: 'Capitán', unidad: 'Esc Com',
    categoria_militar: 'CM-03', aptitud_capacitacion: 'En Inteligencia Estratégica Militar',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: false,
    estado_vigencia: 'vigente', fecha_obtencion: '2022-11-10',
  },
  {
    id: 4, tipo_formacion: 'militar',
    dni: '28987654', legajo: 'EA-10003', apellido_nombre: 'MARTINEZ, Pedro Alejandro',
    grado: 'Teniente Coronel', unidad: 'CGE',
    categoria_militar: 'CM-08', aptitud_capacitacion: 'Oficial de Estado Mayor',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2018-12-01',
  },
  {
    id: 5, tipo_formacion: 'militar',
    dni: '32654321', legajo: 'EA-10004', apellido_nombre: 'LOPEZ, Ana Beatriz',
    grado: 'Teniente Primero', unidad: 'Bat Ing 1',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'En Ciberdefensa',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2023-05-20',
  },
  {
    id: 6, tipo_formacion: 'militar',
    dni: '29345678', legajo: 'EA-10005', apellido_nombre: 'FERNANDEZ, Carlos Alberto',
    grado: 'Coronel', unidad: 'CGES',
    categoria_militar: 'CM-09', aptitud_capacitacion: 'Curso Conjunto de Estrategia y Conducción Superior',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2017-08-10',
  },
  {
    id: 7, tipo_formacion: 'militar',
    dni: '33789012', legajo: 'EA-10006', apellido_nombre: 'DIAZ, Roberto Emilio',
    grado: 'Sargento Primero', unidad: 'RIM 1',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'Cazador de Montaña',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: false,
    estado_vigencia: 'vigente', fecha_obtencion: '2019-02-28',
  },
  {
    id: 8, tipo_formacion: 'militar',
    dni: '34567890', legajo: 'EA-10007', apellido_nombre: 'PERALTA, Martín Ignacio',
    grado: 'Teniente', unidad: 'RI Mec 11',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'Tropas Mecanizadas',
    compromiso_servicios_vigente: true,
    tiene_documentacion: false, certificado_descargable: false,
    estado_vigencia: 'vigente', fecha_obtencion: '2024-01-15',
  },
  {
    id: 9, tipo_formacion: 'militar',
    dni: '27890123', legajo: 'EA-10008', apellido_nombre: 'SANCHEZ, Hugo Daniel',
    grado: 'Suboficial Mayor', unidad: 'Esc Inf',
    categoria_militar: 'CM-05', aptitud_capacitacion: 'Instructor de Tiro',
    compromiso_servicios_vigente: false,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vencido', fecha_vencimiento: '2024-06-30', fecha_obtencion: '2015-03-20',
  },
  {
    id: 10, tipo_formacion: 'militar',
    dni: '35678901', legajo: 'EA-10009', apellido_nombre: 'TORRES, Luciana Soledad',
    grado: 'Subteniente', unidad: 'Dir Intlg',
    categoria_militar: 'CM-03', aptitud_capacitacion: 'Auxiliar de Inteligencia Básico',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'proximo_a_vencer', fecha_vencimiento: dias(60), fecha_obtencion: '2022-07-10',
  },
  {
    id: 11, tipo_formacion: 'militar',
    dni: '30111222', legajo: 'EA-10010', apellido_nombre: 'ACOSTA, Ramón Esteban',
    grado: 'Sargento Ayudante', unidad: 'RIM 2',
    categoria_militar: 'CM-02', aptitud_capacitacion: 'Capacidad Antártica',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2021-01-05',
  },
  {
    id: 12, tipo_formacion: 'militar',
    dni: '31222333', legajo: 'EA-10011', apellido_nombre: 'VEGA, Claudia Patricia',
    grado: 'Capitán', unidad: 'Esc Art',
    categoria_militar: 'CM-06', aptitud_capacitacion: 'Dirección de los Fuegos',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: false,
    estado_vigencia: 'vigente', fecha_obtencion: '2023-09-14',
  },
  {
    id: 13, tipo_formacion: 'militar',
    dni: '28444555', legajo: 'EA-10012', apellido_nombre: 'HERRERA, Domingo Oscar',
    grado: 'Mayor', unidad: 'Bat Com 601',
    categoria_militar: 'CM-04', aptitud_capacitacion: 'Aeronavegante',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2020-11-22',
  },
  {
    id: 14, tipo_formacion: 'militar',
    dni: '33555666', legajo: 'EA-10013', apellido_nombre: 'MOLINA, Federico José',
    grado: 'Teniente Primero', unidad: 'RC Tan 1',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'Tropas Blindadas',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2022-04-08',
  },
  {
    id: 15, tipo_formacion: 'militar',
    dni: '34666777', legajo: 'EA-10014', apellido_nombre: 'ROMERO, Silvia Adriana',
    grado: 'Teniente', unidad: 'Ca Cdo 602',
    categoria_militar: 'CM-01', aptitud_capacitacion: 'Paracaidista Militar (Distintivo Dorado)',
    compromiso_servicios_vigente: true,
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_obtencion: '2023-02-17',
  },

  // --- Idiomas ---
  {
    id: 16, tipo_formacion: 'idioma',
    dni: '30123456', legajo: 'EA-10001', apellido_nombre: 'GONZALEZ, Juan Carlos',
    grado: 'Mayor', unidad: 'Ca Cdo 601',
    tipo_acreditacion_idioma: 'ea', idioma: 'Inglés',
    institucion: 'Instituto de Idiomas del Ejército', nivel_idioma: 'B2',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(400), fecha_obtencion: '2023-01-15',
  },
  {
    id: 17, tipo_formacion: 'idioma',
    dni: '31456789', legajo: 'EA-10002', apellido_nombre: 'RODRIGUEZ, María Laura',
    grado: 'Capitán', unidad: 'Esc Com',
    tipo_acreditacion_idioma: 'ea', idioma: 'Inglés',
    institucion: 'Instituto de Idiomas del Ejército', nivel_idioma: 'C1-C2',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(730), fecha_obtencion: '2022-06-20',
  },
  {
    id: 18, tipo_formacion: 'idioma',
    dni: '31456789', legajo: 'EA-10002', apellido_nombre: 'RODRIGUEZ, María Laura',
    grado: 'Capitán', unidad: 'Esc Com',
    tipo_acreditacion_idioma: 'otras', idioma: 'Portugués',
    institucion: 'Centro Cultural Brasil-Argentina', nivel_idioma: 'B1',
    tiene_documentacion: true, certificado_descargable: false,
    estado_vigencia: 'proximo_a_vencer', fecha_vencimiento: dias(45), fecha_obtencion: '2021-08-10',
  },
  {
    id: 19, tipo_formacion: 'idioma',
    dni: '28987654', legajo: 'EA-10003', apellido_nombre: 'MARTINEZ, Pedro Alejandro',
    grado: 'Teniente Coronel', unidad: 'CGE',
    tipo_acreditacion_idioma: 'ea', idioma: 'Francés',
    institucion: 'Ejército Argentino', nivel_idioma: 'A2-B1',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vencido', fecha_vencimiento: '2025-01-15', fecha_obtencion: '2019-01-15',
  },
  {
    id: 20, tipo_formacion: 'idioma',
    dni: '32654321', legajo: 'EA-10004', apellido_nombre: 'LOPEZ, Ana Beatriz',
    grado: 'Teniente Primero', unidad: 'Bat Ing 1',
    tipo_acreditacion_idioma: 'ea', idioma: 'Inglés',
    institucion: 'Instituto de Idiomas del Ejército', nivel_idioma: 'B1',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(200), fecha_obtencion: '2024-03-10',
  },
  {
    id: 21, tipo_formacion: 'idioma',
    dni: '29345678', legajo: 'EA-10005', apellido_nombre: 'FERNANDEZ, Carlos Alberto',
    grado: 'Coronel', unidad: 'CGES',
    tipo_acreditacion_idioma: 'otras', idioma: 'Alemán',
    institucion: 'Goethe-Institut', nivel_idioma: 'A1-A2',
    tiene_documentacion: false, certificado_descargable: false,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2016-05-20',
  },
  {
    id: 22, tipo_formacion: 'idioma',
    dni: '35678901', legajo: 'EA-10009', apellido_nombre: 'TORRES, Luciana Soledad',
    grado: 'Subteniente', unidad: 'Dir Intlg',
    tipo_acreditacion_idioma: 'ea', idioma: 'Inglés',
    institucion: 'Ejército Argentino', nivel_idioma: 'A2-B1',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(500), fecha_obtencion: '2024-06-01',
  },
  {
    id: 23, tipo_formacion: 'idioma',
    dni: '33789012', legajo: 'EA-10006', apellido_nombre: 'DIAZ, Roberto Emilio',
    grado: 'Sargento Primero', unidad: 'RIM 1',
    tipo_acreditacion_idioma: 'ea', idioma: 'Portugués',
    institucion: 'Instituto de Idiomas del Ejército', nivel_idioma: 'B2',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(365), fecha_obtencion: '2023-04-12',
  },
  {
    id: 24, tipo_formacion: 'idioma',
    dni: '30111222', legajo: 'EA-10010', apellido_nombre: 'ACOSTA, Ramón Esteban',
    grado: 'Sargento Ayudante', unidad: 'RIM 2',
    tipo_acreditacion_idioma: 'otras', idioma: 'Ruso',
    institucion: 'Centro de Estudios Rusos', nivel_idioma: 'A0',
    tiene_documentacion: false, certificado_descargable: false,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2020-09-01',
  },
  {
    id: 25, tipo_formacion: 'idioma',
    dni: '34666777', legajo: 'EA-10014', apellido_nombre: 'ROMERO, Silvia Adriana',
    grado: 'Teniente', unidad: 'Ca Cdo 602',
    tipo_acreditacion_idioma: 'ea', idioma: 'Inglés',
    institucion: 'Instituto de Idiomas del Ejército', nivel_idioma: 'B2',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(300), fecha_obtencion: '2024-02-28',
  },

  // --- Civiles (VAC-01: catálogo civil pendiente de relevamiento — registros placeholder) ---
  {
    id: 26, tipo_formacion: 'civil',
    dni: '30123456', legajo: 'EA-10001', apellido_nombre: 'GONZALEZ, Juan Carlos',
    grado: 'Mayor', unidad: 'Ca Cdo 601',
    titulo_civil: 'Licenciado en Administración de Empresas',
    institucion_civil: 'Universidad de Buenos Aires',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2016-12-15',
  },
  {
    id: 27, tipo_formacion: 'civil',
    dni: '31456789', legajo: 'EA-10002', apellido_nombre: 'RODRIGUEZ, María Laura',
    grado: 'Capitán', unidad: 'Esc Com',
    titulo_civil: 'Ingeniera en Sistemas de Información',
    institucion_civil: 'Universidad Tecnológica Nacional',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2019-03-20',
  },
  {
    id: 28, tipo_formacion: 'civil',
    dni: '28987654', legajo: 'EA-10003', apellido_nombre: 'MARTINEZ, Pedro Alejandro',
    grado: 'Teniente Coronel', unidad: 'CGE',
    titulo_civil: 'Abogado',
    institucion_civil: 'Universidad Nacional de Córdoba',
    tiene_documentacion: true, certificado_descargable: false,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2014-08-10',
  },
  {
    id: 29, tipo_formacion: 'civil',
    dni: '32654321', legajo: 'EA-10004', apellido_nombre: 'LOPEZ, Ana Beatriz',
    grado: 'Teniente Primero', unidad: 'Bat Ing 1',
    titulo_civil: 'Técnica Superior en Ciberseguridad',
    institucion_civil: 'Instituto Universitario del Ejército',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'vigente', fecha_vencimiento: dias(500), fecha_obtencion: '2023-11-05',
  },
  {
    id: 30, tipo_formacion: 'civil',
    dni: '29345678', legajo: 'EA-10005', apellido_nombre: 'FERNANDEZ, Carlos Alberto',
    grado: 'Coronel', unidad: 'CGES',
    titulo_civil: 'Magíster en Estrategia y Geopolítica',
    institucion_civil: 'Escuela Superior de Guerra',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2018-06-30',
  },
  {
    id: 31, tipo_formacion: 'civil',
    dni: '33789012', legajo: 'EA-10006', apellido_nombre: 'DIAZ, Roberto Emilio',
    grado: 'Sargento Primero', unidad: 'RIM 1',
    titulo_civil: 'Técnico en Electrónica',
    institucion_civil: 'Instituto de Formación Técnica Nro 8',
    tiene_documentacion: false, certificado_descargable: false,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2012-12-20',
  },
  {
    id: 32, tipo_formacion: 'civil',
    dni: '35678901', legajo: 'EA-10009', apellido_nombre: 'TORRES, Luciana Soledad',
    grado: 'Subteniente', unidad: 'Dir Intlg',
    titulo_civil: 'Licenciada en Psicología',
    institucion_civil: 'Universidad Nacional de La Plata',
    tiene_documentacion: true, certificado_descargable: true,
    estado_vigencia: 'sin_vencimiento', fecha_obtencion: '2022-04-18',
  },
];
