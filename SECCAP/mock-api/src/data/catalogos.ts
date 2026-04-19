// Catálogos estáticos del mock — basados en el relevamiento del anteproyecto.
// Estos datos simulan lo que devolvería la API institucional real.

export const tiposFormacion = [
  { codigo: 'militar', nombre: 'Ámbito militar' },
  { codigo: 'civil', nombre: 'Ámbito civil' },
  { codigo: 'idioma', nombre: 'Idioma' },
];

export interface CategoriaMilitar {
  codigo: string;
  nombre: string;
}

export const categoriasMilitares: CategoriaMilitar[] = [
  { codigo: 'CM-01', nombre: 'Aptitudes Especiales Operacionales' },
  { codigo: 'CM-02', nombre: 'Aptitudes Especiales según Ambiente Geográfico' },
  { codigo: 'CM-03', nombre: 'Aptitudes Especiales Técnicas' },
  { codigo: 'CM-04', nombre: 'Capacitación Especial de las Aptitudes Especiales' },
  { codigo: 'CM-05', nombre: 'Capacitación Especial de Instrucción o Docentes' },
  { codigo: 'CM-06', nombre: 'Capacitación Especial de Rol de Combate' },
  { codigo: 'CM-07', nombre: 'Especial Particular' },
  { codigo: 'CM-08', nombre: 'Especial Avanzada' },
  { codigo: 'CM-09', nombre: 'Especial Superior' },
  { codigo: 'CM-10', nombre: 'Especialidad Complementaria' },
  { codigo: 'CM-11', nombre: 'Otras' },
];

export const aptitudesPorCategoria: Record<string, string[]> = {
  'CM-01': [
    'Antiaérea', 'Asalto Aéreo', 'Buzo de Ejército', 'Cazador de Montaña',
    'Cazador de Monte', 'Cazador Patagónico', 'Comando', 'En Ciberdefensa',
    'Paracaidista Militar (Distintivo Dorado)', 'Paracaidista Militar (Distintivo Plateado)',
    'Tropas Blindadas', 'Tropas Mecanizadas',
  ],
  'CM-02': [
    'Capacidad Antártica', 'De Montaña (Cóndor Dorado)', 'De Montaña (Cóndor Plateado)',
    'De Monte (Dorado)', 'De Monte (Plateado)',
  ],
  'CM-03': [
    'Auxiliar de Inteligencia Avanzado', 'Auxiliar de Inteligencia Básico',
    'Aviador de Ejército (Dorado)', 'Aviador de Ejército (Plateado)',
    'Inteligencia (Distintivo Dorado)', 'Inteligencia (Distintivo Plateado)',
    'En Inteligencia Estratégica Militar',
  ],
  'CM-04': [
    'Aeronavegante', 'Aeronavegante (Mec Av)', 'Apertura Manual',
    'Buceo con Equipos de Circuito Cerrado', 'Buceo de Búsqueda y Salvamento',
    'Buceo de Gran Profundidad (ARA)', 'Buceo de Profundidad (ARA)',
    'Buceo en Altura', 'Buceo en la Antártida', 'Escalador Militar',
    'Escalador Militar Básico', 'Especialista de Combate en el Monte',
    'Esquiador Militar', 'Esquiador Militar - 1ra', 'Esquiador Militar - 2da',
    'Esquiador Militar - 3ra', 'Esquiador Militar Básico', 'Fuerzas Especiales',
    'Guía de Paracaidista', 'Jefe de Lanzamiento', 'Medicina Hiperbárica',
    'Preparación de Mezclas y Buceo con Mezclas Gaseosas', 'Tripulante',
    'Vuelo Antártico', 'Vuelo en Montaña',
  ],
  'CM-05': [
    'Auxiliar de Equitación', 'Instructor de Adiestramiento Físico',
    'Instructor de Blindados', 'Instructor de Equitación',
    'Instructor de Mecanizados', 'Instructor de Tiro', 'Instructor de Vuelo',
    'Instructor en Técnicas Operativas de Naciones Unidas',
    'Instructor/Subinstructor Antártico', 'Instructor/Subinstructor de Andinismo',
    'Instructor/Subinstructor de Buzo de Ejército',
    'Instructor/Subinstructor de Cazador de Montaña',
    'Instructor/Subinstructor de Cazador de Monte',
    'Instructor/Subinstructor de Cazador Patagónico',
    'Instructor/Subinstructor de Comandos', 'Instructor/Subinstructor de Esquí',
    'Instructor/Subinstructor de Monte',
    'Instructor/Subinstructor de Redes Radioeléctricas Tácticas y SITEA',
    'Instructor/Subinstructor de Técnicas Básicas de Paracaidismo',
    'Instructor/Subinstructor de Tropas Montadas', 'Suboficial Instructor',
  ],
  'CM-06': [
    'Adquisición de Blancos', 'Antenista Militar', 'Dirección de los Fuegos',
    'Exploración', 'Exploración y Reconocimiento Anfibio', 'Guerra Electrónica',
    'Observación Adelantada', 'Radiotelegrafista Militar', 'Timonel de Ejército',
  ],
  'CM-07': [
    'Oficial de Gestión de la Información', 'Oficial de Material',
    'Oficial de Personal', 'Técnico en Servicio de Estado Mayor',
    'Técnico en Servicio Geográfico',
  ],
  'CM-08': [
    'Oficial Asesor de Estado Mayor', 'Oficial Asesor de Estado Mayor Especial',
    'Oficial de Estado Mayor', 'Oficial de Estado Mayor Conjunto',
    'Oficial de Estado Mayor de País Extranjero', 'Oficial Ingeniero Militar',
  ],
  'CM-09': [
    'Curso Conjunto de Estrategia y Conducción Superior',
    'Curso de Dirección de Estudios Militares',
    'Postgrado del Magíster en Defensa Nacional',
  ],
  'CM-10': ['Avanzada', 'Básica', 'Superior'],
  'CM-11': ['Aptitud Física Individual', 'Aptitudes Aplicativas al Combate'],
};

export const idiomas = [
  'Inglés', 'Portugués', 'Francés', 'Alemán', 'Italiano',
  'Chino Mandarín', 'Ruso', 'Árabe', 'Japonés', 'Coreano',
];

export const nivelesIdioma = [
  { codigo: 'A0', nombre: 'A0 Principiante' },
  { codigo: 'A1-A2', nombre: 'A1-A2 Básico' },
  { codigo: 'A2-B1', nombre: 'A2-B1 Pre-intermedio' },
  { codigo: 'B1', nombre: 'B1 Intermedio' },
  { codigo: 'B2', nombre: 'B2 Intermedio-Alto' },
  { codigo: 'C1-C2', nombre: 'C1-C2 Avanzado' },
];

export const instituciones: Record<string, string[]> = {
  'Inglés': ['Ejército Argentino', 'Instituto de Idiomas del Ejército', 'Cambridge Assessment', 'ETS (TOEFL)'],
  'Portugués': ['Ejército Argentino', 'Instituto de Idiomas del Ejército', 'Centro Cultural Brasil-Argentina'],
  'Francés': ['Ejército Argentino', 'Instituto de Idiomas del Ejército', 'Alliance Française'],
  'Alemán': ['Ejército Argentino', 'Instituto de Idiomas del Ejército', 'Goethe-Institut'],
  'Italiano': ['Ejército Argentino', 'Instituto de Idiomas del Ejército', 'Dante Alighieri'],
  'Chino Mandarín': ['Ejército Argentino', 'Instituto Confucio'],
  'Ruso': ['Ejército Argentino', 'Centro de Estudios Rusos'],
  'Árabe': ['Ejército Argentino', 'Centro de Estudios Árabes'],
  'Japonés': ['Ejército Argentino', 'Fundación Japón'],
  'Coreano': ['Ejército Argentino', 'Centro Cultural Coreano'],
};

export const unidades = [
  'RIM 1', 'RIM 2', 'RIM 3', 'RI 4', 'RI 5', 'RI 6', 'RI 7',
  'GAM 1', 'GA 1', 'GA 2', 'RC 2', 'RC 3', 'RC 4',
  'Esc Inf', 'Esc Cab', 'Esc Art', 'Esc Ing', 'Esc Com',
  'CGE', 'CGES', 'Dir Per', 'Dir Intlg', 'Esc Mnt', 'Esc GIM',
  'Bat Com 601', 'Bat Ing 1', 'Bat Ing 2', 'Ca Cdo 601', 'Ca Cdo 602',
  'RI Mec 11', 'RI Mec 12', 'RI Mec 25', 'RC Tan 1', 'RC Tan 2',
];

export const grados = [
  'Teniente General', 'General de División', 'General de Brigada',
  'Coronel', 'Teniente Coronel', 'Mayor',
  'Capitán', 'Teniente Primero', 'Teniente', 'Subteniente',
  'Suboficial Mayor', 'Suboficial Principal', 'Sargento Ayudante',
  'Sargento Primero', 'Sargento', 'Cabo Primero', 'Cabo', 'Voluntario',
];
