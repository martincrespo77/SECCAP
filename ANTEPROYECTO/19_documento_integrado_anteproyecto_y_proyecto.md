# Titulo

**SECCAP - Documento Formal de Anteproyecto**

Sistema del Ejercito de Consulta Segura de Capacidades y Aptitudes del Personal del Ejercito Argentino.

> Portada institucional - espacio reservado para logo CPSGEA / Ejercito Argentino

| Campo | Detalle |
|---|---|
| Titulo | SECCAP - Documento Formal de Anteproyecto |
| Autor | CT Martin Exequiel CRESPO |
| Usuario | CT COLLADO |
| Promotor | CPSGEA |
| Version | V 0.1 |

## Indice

1. [Siglas y acronimos](#siglas-y-acronimos)
2. [Abstract](#abstract)
3. [Antecedentes](#antecedentes)
4. [Formulacion del problema](#formulacion-del-problema)
5. [Justificacion](#justificacion)
6. [Alcance](#alcance)
7. [Objetivos generales y especificos](#objetivos-generales-y-especificos)
8. [Marco referencial](#marco-referencial)
9. [Metodologias propuestas](#metodologias-propuestas)
10. [Nombres de los participantes (EdP, interesados)](#nombres-de-los-participantes-edp-interesados)
11. [Cronograma de alto nivel](#cronograma-de-alto-nivel)
12. [Analisis de propuesta](#analisis-de-propuesta)
13. [Desarrollo del anteproyecto](#desarrollo-del-anteproyecto)
14. [Caso de negocio](#caso-de-negocio)
15. [Modelo Canvas](#modelo-canvas)
16. [Plan de beneficios y cuantificacion](#plan-de-beneficios-y-cuantificacion)
17. [Referencias](#referencias)

## Siglas y acronimos

| Sigla | Significado |
|---|---|
| SECCAP | Sistema del Ejercito de Consulta Segura de Capacidades y Aptitudes del Personal |
| EA | Ejercito Argentino |
| CPSGEA | Centro de Produccion de Software de Gestion del Ejercito Argentino |
| EdP | Equipo del Proyecto |
| API | Application Programming Interface |
| RBAC | Role-Based Access Control |
| JWT | JSON Web Token |
| SPA | Single Page Application |
| PMBOK | Project Management Body of Knowledge |
| JEMGE | Jefe del Estado Mayor General del Ejercito |
| SubJEMGE | Subjefe del Estado Mayor General del Ejercito |
| CT | Coronel |

## Abstract

El presente documento formaliza el anteproyecto SECCAP, una propuesta del Ejercito Argentino para disponer de un sistema web de consulta segura sobre capacidades, aptitudes, formaciones e idiomas del personal. La solucion se desarrollara en el ambito del CPSGEA y utilizara recursos del propio Ejercito Argentino, sin costo economico directo adicional.

La propuesta se apoya en una arquitectura en capas, con un frontend web moderno, un backend proxy de seguridad e integracion, una base de datos local minima para control operativo y una API institucional de solo lectura como fuente de informacion. El objetivo no es crear un nuevo sistema de gestion de personal ni replicar la base de datos institucional, sino ofrecer una capa segura, trazable y controlada de consulta.

El documento expone el problema, la justificacion, los objetivos, el marco referencial, la metodologia, el caso de negocio, el modelo Canvas, el plan de beneficios, los participantes, el cronograma anual de alto nivel y el analisis general de la propuesta. Su enfoque es estrictamente prospectivo: describe lo que se implementara durante el ciclo de trabajo previsto, cuya etapa de implementacion tecnica comenzara en agosto de 2026.

## Antecedentes

Dentro del Ejercito Argentino, la informacion vinculada con capacidades, aptitudes, acreditaciones, formaciones e idiomas del personal constituye un insumo critico para la toma de decisiones operativas, administrativas y de conduccion. Sin embargo, esa informacion suele encontrarse distribuida en fuentes formales e informales, con diferentes niveles de acceso, criterios de consulta y trazabilidad.

En este contexto, el Area de Personal requiere una herramienta que permita consultar informacion relevante de manera centralizada, segura y auditable. La existencia de una API institucional de solo lectura representa una oportunidad concreta para desarrollar una solucion intermedia, sin alterar la base oficial y sin duplicar innecesariamente datos sensibles.

El anteproyecto se formula, por lo tanto, como una respuesta tecnica y organizacional a una necesidad real del Ejercito Argentino, con desarrollo previsto dentro del CPSGEA y soporte institucional sobre recursos ya disponibles.

## Formulacion del problema

El problema central puede expresarse de la siguiente manera:

> El Ejercito Argentino no dispone actualmente de un mecanismo unico, seguro, estructurado y auditable que permita consultar transversalmente las capacidades, aptitudes, formaciones e idiomas del personal, con filtrado adecuado, control de acceso por rol y trazabilidad completa del uso de la informacion.

Este problema se manifiesta en los siguientes aspectos:

1. Fragmentacion del acceso a la informacion.
2. Ausencia de filtros jerarquicos y dependientes que faciliten la consulta.
3. Carencia de control de acceso formal segun perfil de usuario.
4. Inexistencia de trazabilidad integral sobre las consultas realizadas.
5. Riesgo de exposicion de datos sensibles por falta de una capa intermedia de control.
6. Demoras operativas para usuarios que necesitan informacion consolidada y confiable.

## Justificacion

La propuesta se justifica en tres dimensiones principales.

**Justificacion operativa.** El sistema permitira ordenar y centralizar la consulta de informacion relevante del personal, reduciendo tiempos de busqueda y dependencia de canales manuales o informales.

**Justificacion de seguridad.** La solucion incorporara control de acceso por roles, validacion de consultas, trazabilidad obligatoria y criterios de minimo privilegio, alineando el uso de la informacion con un entorno institucional de alta sensibilidad.

**Justificacion arquitectonica.** El sistema se construira como una capa de consulta read-only sobre la fuente oficial, evitando modificar o replicar la base institucional del personal. Esto reduce riesgo, facilita la gobernanza del dato y permite una integracion mas conservadora y controlada.

## Alcance

El alcance del anteproyecto comprende el diseno, planificacion y futura implementacion de una solucion institucional de consulta segura para el Ejercito Argentino.

### Alcance incluido

1. Desarrollo de una interfaz web para consulta de informacion de capacidades, aptitudes, formaciones e idiomas del personal.
2. Implementacion de una capa backend proxy para integracion controlada con la API institucional de solo lectura.
3. Incorporacion de autenticacion, autorizacion por roles y auditoria de operaciones.
4. Uso de una base de datos local minima para usuarios, roles, sesiones, configuraciones y registros operativos.
5. Aplicacion de filtros jerarquicos y dependientes para ordenar la consulta de informacion.
6. Uso de mocks de API cuando resulte necesario desacoplar el avance de modulos respecto de la disponibilidad del servicio real.
7. Elaboracion de la documentacion funcional, tecnica y de gestion asociada al proyecto.

### Fuera de alcance

1. Modificacion, alta o baja de datos en la base institucional del Area de Personal.
2. Replicacion local de la base completa de personal del Ejercito Argentino.
3. Desarrollo de modulos ajenos al objetivo de consulta segura, como sistemas transaccionales de gestion integral del personal.
4. Incorporacion de funcionalidades no vinculadas al nucleo del proyecto sin aprobacion formal de cambio de alcance.

### Restriccion principal de alcance

SECCAP se concibe como una solucion de **consulta controlada** y no como reemplazo del sistema institucional de personal. Su funcion sera consumir informacion por medio de una API de solo lectura y presentarla segun reglas de acceso, trazabilidad y seguridad.

## Objetivos generales y especificos

### Objetivo general

Desarrollar un sistema web de consulta segura para el Ejercito Argentino que, integrandose con una API institucional de solo lectura del Area de Personal, permita buscar, filtrar y visualizar capacidades, aptitudes, formaciones y acreditaciones del personal, aplicando control de acceso por roles, filtrado jerarquico y registro de auditoria, sin replicar ni modificar la informacion de origen.

### Objetivos especificos

1. Diseñar e implementar una capa backend proxy para validar, transformar y proteger el acceso a la API institucional.
2. Implementar autenticacion y autorizacion basadas en roles para administrar el acceso al sistema.
3. Desarrollar una interfaz web moderna, clara y responsiva para la consulta de informacion.
4. Incorporar un modulo de auditoria y trazabilidad de operaciones.
5. Mantener una base local minima, destinada solo a usuarios, roles, sesiones, configuraciones y registros operativos.
6. Definir mecanismos de manejo de errores y contingencias frente a fallas o restricciones de integracion con la API institucional.
7. Producir la documentacion funcional, tecnica y de gestion necesaria para respaldar la ejecucion y posterior adopcion del sistema.

## Marco referencial

### Marco teorico

El proyecto se apoya en principios clasicos de ingenieria de software y seguridad de la informacion:

- arquitectura en capas,
- separacion de responsabilidades,
- control de acceso basado en roles,
- principio de minimo privilegio,
- trazabilidad de operaciones,
- integracion segura con sistemas externos,
- desacoplamiento entre interfaz, logica de negocio y fuente de datos.

### Marco conceptual

Los conceptos centrales del anteproyecto son:

- **consulta segura**, entendida como acceso controlado y auditado a informacion institucional;
- **backend proxy**, como componente intermedio de validacion, transformacion y proteccion;
- **read-only**, como restriccion que impide modificar la base oficial de personal;
- **filtros jerarquicos**, como mecanismo de consulta guiada y estructurada;
- **auditoria**, como registro verificable de las acciones realizadas por cada usuario;
- **segregacion de funciones**, para distinguir perfiles operativos, administrativos y de control.

### Marco tecnologico

La propuesta tecnologica del sistema contempla las siguientes capas y herramientas a utilizar:

| Capa | Tecnologia propuesta | Finalidad |
|---|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS | Interfaz web moderna y responsiva |
| Backend | Node.js + Express + TypeScript | Proxy de integracion, seguridad y logica de negocio |
| Persistencia local | PostgreSQL | Usuarios, roles, sesiones, configuracion y auditoria |
| Integracion | API institucional de solo lectura | Fuente oficial de datos del personal |
| Soporte de integracion | Mock de API | Validacion de contratos y avance de modulos cuando la API real no este disponible |

### Marco institucional

El sistema se desarrollara en el CPSGEA para el Ejercito Argentino, en coordinacion con el Area de Personal y con apoyo tecnico para el acceso a la API institucional. Su orientacion es institucional, no comercial, y su valor se mide en funcion del ordenamiento, la seguridad y la utilidad operativa de la informacion.

## Metodologias propuestas

El anteproyecto adopta una metodologia iterativa e incremental, con planificacion anual y comienzo de la implementacion tecnica en agosto de 2026.

La metodologia se apoyara en los siguientes criterios:

- relevamiento y definicion progresiva del problema;
- consolidacion temprana de alcance, actores y arquitectura;
- uso de practicas de gestion alineadas con PMBOK;
- avance por etapas funcionales;
- integracion por modulos;
- uso de mocks de API cuando sea necesario desacoplar el progreso tecnico de la disponibilidad del servicio real;
- validaciones parciales con referentes institucionales a medida que el sistema evolucione.

No se propone una metodologia rigida de cascada pura, porque el acceso a la API institucional, los contratos de integracion y los detalles operativos requieren validacion progresiva.

## Nombres de los participantes (EdP, interesados)

### Equipo del Proyecto (EdP)

| Integrante | Rol |
|---|---|
| CT Martin Exequiel CRESPO | Responsable del proyecto, analisis, arquitectura, desarrollo y documentacion |

### Interesados institucionales

| Interesado | Rol en el proyecto |
|---|---|
| CPSGEA | Promotor institucional y ambito de desarrollo del sistema |
| CT COLLADO | Cliente y referente tecnico-funcional; Jefe del Departamento de Informatica DGPB del Area de Personal; apoyo y asistencia tecnica para el acceso a la API de solo lectura |
| Ejercito Argentino | Institucion proveedora de recursos, infraestructura y marco de aplicacion |

### Usuarios previstos del sistema

| Usuario previsto | Participacion esperada |
|---|---|
| JEMGE | Consulta y apoyo a la decision |
| SubJEMGE | Consulta y apoyo a la decision |
| Director General de Personal | Consulta y supervision funcional |
| Administrador | Operacion y gestion de acceso al sistema |
| Auditor | Revision y control de trazabilidad |

> Sobre el termino "patrocinador": en este documento se adopta un criterio conservador. Se explicita al **CPSGEA** como promotor institucional y a **CT COLLADO** como cliente y referente tecnico-funcional. Si administrativamente el Ejercito Argentino exige la designacion formal de un patrocinador adicional, ese dato debera quedar asentado en la instancia institucional correspondiente.

## Cronograma de alto nivel

El cronograma se plantea para el ciclo anual 2026, con inicio de la implementacion tecnica en agosto y cierre previsto en noviembre.

| Periodo 2026 | Etapa | Objetivo principal |
|---|---|---|
| Marzo - Abril | Relevamiento y formulacion | Definir problema, necesidad, alcance preliminar y actores |
| Mayo - Junio | Consolidacion del anteproyecto | Formalizar objetivos, arquitectura, metodologia, viabilidad y caso de negocio |
| Julio | Preparacion tecnica e institucional | Ajustar definiciones, dependencias de integracion y condiciones de inicio |
| Agosto | Inicio de implementacion | Montaje de infraestructura base, base local y estrategia de integracion |
| Septiembre | Desarrollo del backend y seguridad | Implementar proxy, autenticacion, control por roles y auditoria |
| Octubre | Desarrollo del frontend e integracion funcional | Construir la interfaz de consulta y conectar modulos principales |
| Noviembre | Consolidacion, integracion final y documentacion de cierre | Afinar modulos, completar integracion institucional y dejar documentacion lista |

## Analisis de propuesta

### Fortalezas de la propuesta

- Responde a una necesidad institucional real del Ejercito Argentino.
- Aprovecha recursos ya disponibles del CPSGEA y del propio Ejercito Argentino.
- Propone una arquitectura conservadora y segura.
- Evita replicar informacion sensible.
- Permite escalar por modulos y por etapas.

### Restricciones y condicionantes

- La disponibilidad y contrato operativo de la API de solo lectura condicionaran parte del avance tecnico.
- Algunas definiciones institucionales de acceso, seguridad e infraestructura deberan resolverse antes o durante la etapa de implementacion.
- La ejecucion depende de la coordinacion efectiva entre el equipo del proyecto, el CPSGEA y el Area de Personal.

### Criterio general de factibilidad

La propuesta es razonable desde el punto de vista tecnico, operativo y economico, siempre que se mantenga el alcance previsto, se respeten los criterios de seguridad y se garantice la colaboracion institucional necesaria para la integracion.

## Desarrollo del anteproyecto

El desarrollo del anteproyecto se plantea como un proceso de consolidacion progresiva, no como una implementacion ya realizada. Ese proceso comprende:

1. definicion del problema y de la oportunidad institucional;
2. identificacion de objetivos y alcance;
3. caracterizacion de actores, usuarios e interesados;
4. definicion de arquitectura, capas y tecnologias a utilizar;
5. evaluacion de viabilidad;
6. formulacion del caso de negocio;
7. construccion del cronograma anual de trabajo;
8. elaboracion del marco metodologico y documental.

En ese sentido, el presente documento cumple la funcion de concentrar en una sola pieza formal la informacion principal del anteproyecto, evitando dispersarla en multiples anexos como parte del texto principal.

## Caso de negocio

### Necesidad institucional

El Ejercito Argentino necesita una herramienta que permita acceder, bajo control, a informacion relevante del personal para fines de decision, supervision y administracion, sin comprometer la fuente oficial de datos.

### Propuesta de valor

SECCAP aportara:

- una interfaz de consulta unica,
- un acceso controlado segun rol,
- una capa de seguridad intermedia,
- trazabilidad de consultas,
- una integracion institucional sin modificacion del origen.

### Decision de inversion

La decision de avanzar con el anteproyecto es favorable porque:

- el costo economico directo es nulo,
- los recursos ya pertenecen al Ejercito Argentino y al CPSGEA,
- la necesidad institucional es concreta,
- la solucion propuesta es tecnicamente proporcionada al problema.

## Modelo Canvas

> Canvas adaptado a un proyecto institucional, no comercial.

| Bloque | Contenido |
|---|---|
| Propuesta de valor | Consulta segura, trazable y centralizada de capacidades y aptitudes del personal |
| Segmentos de usuarios | JEMGE, SubJEMGE, Director General de Personal, Administrador, Auditor |
| Canales | Aplicacion web institucional y red interna del Ejercito Argentino |
| Relacion con usuarios | Soporte institucional, asistencia tecnica y capacitacion funcional |
| Actividades clave | Analisis, arquitectura, integracion con API, desarrollo por capas, seguridad y auditoria |
| Recursos clave | Recursos del Ejercito Argentino, CPSGEA, API institucional, infraestructura institucional |
| Socios clave | CPSGEA, Area de Personal, CT COLLADO, areas tecnicas del Ejercito Argentino |
| Estructura de costos | Costo economico directo cero con recursos institucionales existentes |
| Beneficio institucional | Mejor consulta, mayor control, mejor trazabilidad, menor dispersion informativa |

## Plan de beneficios y cuantificacion

### Beneficios esperados

| Beneficio | Tipo | Criterio de cuantificacion |
|---|---|---|
| Centralizacion de consultas | Operativo | Reemplazo del uso de canales dispersos por una unica via institucional |
| Mejora del control de acceso | Seguridad | Definicion de perfiles y restricciones de acceso por rol |
| Mejor trazabilidad | Control | Registro de operaciones de consulta y auditoria |
| Conservacion de la fuente oficial | Arquitectonico | Uso de API read-only sin replicacion de datos de personal |
| Aprovechamiento de recursos existentes | Economico | Uso de infraestructura y capacidades del EA y del CPSGEA |

### Cuantificacion adoptada

- **Costo economico directo del proyecto:** $0.
- **Infraestructura:** provista por el Ejercito Argentino y el CPSGEA.
- **Software base:** tecnologias de uso libre o sin costo directo adicional.
- **Inicio previsto de implementacion tecnica:** agosto de 2026.
- **Horizonte de consolidacion inicial:** noviembre de 2026.

### Aclaracion

En este documento no se incorpora cuantificacion de pruebas, horas de practica profesional ni detalle de ejecucion tecnica, porque eso pertenece a la etapa de implementacion y no al alcance formal de este anteproyecto.

## Referencias

- Republica Argentina. **Ley 25.326 - Proteccion de los Datos Personales**. Ano 2000.
- Project Management Institute. **A Guide to the Project Management Body of Knowledge (PMBOK Guide)**.
