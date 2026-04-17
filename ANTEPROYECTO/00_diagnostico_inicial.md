# FASE 0 — INICIALIZACIÓN Y DIAGNÓSTICO
# Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal (SECCAP)

## 1. Nombre de la Fase
**Inicialización y Diagnóstico del Anteproyecto — SECCAP**

## 2. Objetivo
Consolidar el contexto base del proyecto, identificar las condiciones de partida, relevar restricciones conocidas, detectar vacíos de información y establecer los supuestos iniciales de trabajo que servirán como cimiento para todas las fases subsiguientes del anteproyecto.

---

## 3. Desarrollo

### 3.1. Resumen Ejecutivo del Problema

La organización institucional —perteneciente al ámbito de Defensa Nacional— administra un volumen significativo de información relativa a las capacidades, aptitudes, formaciones, acreditaciones e idiomas de su personal. Esta información se encuentra almacenada en una **base de datos corporativa privada y de acceso restringido**, administrada por el Área de Personal.

Actualmente, la consulta de dicha información presenta las siguientes deficiencias:

- No existe una herramienta unificada que permita consultar de forma rápida, segura y estructurada las capacidades y aptitudes del personal.
- Las consultas se realizan mediante procedimientos manuales, contacto directo con el Área de Personal o acceso a sistemas internos no diseñados para consultas transversales.
- No hay mecanismo de **filtrado jerárquico** que permita combinar criterios como tipo de formación, categoría militar, aptitud específica, vigencia, unidad o grado.
- No existe registro de auditoría ni trazabilidad sobre quién consulta qué información y con qué propósito.
- La información sensible del personal queda expuesta a riesgos de acceso no autorizado por la ausencia de un esquema formal de control de acceso basado en roles (RBAC).

### 3.2. Contexto Organizacional

| Aspecto | Descripción |
|---|---|
| **Tipo de organización** | Institución del ámbito de Defensa Nacional (Ejército Argentino) |
| **Área requirente** | Área de Personal / Recursos Humanos institucional |
| **Naturaleza del dato** | Información de personal: formación profesional (civil y militar), aptitudes, capacitaciones, idiomas, acreditaciones, legajos, unidades, jerarquías |
| **Fuente de datos** | Base de datos corporativa privada, accesible únicamente a través de una API institucional de solo lectura |
| **Sensibilidad** | Alta — datos personales, formación militar, acreditaciones de seguridad |
| **Marco normativo** | Regulaciones internas de la institución, Ley de Protección de Datos Personales (Ley 25.326), normativa de seguridad de la información en Defensa |

### 3.3. Necesidad Detectada

Se requiere un **sistema intermedio de consulta segura** (en adelante **SECCAP** — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal) que:

1. Consuma la API institucional de solo lectura provista por el Área de Personal.
2. Filtre y presente únicamente los datos autorizados según el rol del usuario consultante.
3. Permita consultas por **filtros jerárquicos y dependientes** (tipo de formación → categoría → subcategoría/aptitud → filtros transversales).
4. Registre toda consulta en un sistema de auditoría local.
5. Opere bajo el principio de **mínimo privilegio** y **seguridad por diseño**.
6. No replique la base de datos institucional ni permita operaciones de escritura sobre ella.

### 3.4. Restricciones Conocidas

| ID | Restricción | Tipo | Fuente |
|---|---|---|---|
| REST-01 | El sistema es estrictamente **Read-Only** respecto a los datos de personal oficial | Funcional / Arquitectónica | Mandato institucional |
| REST-02 | No se permite conexión directa a la base de datos institucional; toda comunicación debe realizarse a través de la API provista | Técnica | Área de Personal |
| REST-03 | La base de datos local del nuevo sistema solo puede almacenar: usuarios internos, roles, configuraciones, catálogos auxiliares, auditoría y logs | Arquitectónica | Decisión de diseño |
| REST-04 | No se autoriza la replicación masiva de datos de personal en el sistema local | Seguridad / Normativa | Principio de mínimo privilegio |
| REST-05 | Los requerimientos funcionales no están completamente cerrados al inicio del proyecto | Metodológica | Naturaleza del proyecto |
| REST-06 | El frontend debe implementarse con tecnologías web modernas (React 19, TypeScript, Vite, Tailwind CSS) | Técnica | Decisión de stack |
| REST-07 | Toda consulta realizada debe quedar registrada con trazabilidad completa (usuario, filtros, fecha, resultado) | Seguridad / Auditoría | Requisito no funcional |

### 3.5. Información Disponible y Confirmada

La siguiente información ha sido relevada y confirmada a partir del contexto del proyecto:

**Estructura de filtros de consulta:**
- Se identificaron **22 filtros funcionales principales** organizados en 7 niveles jerárquicos.
- Se relevó la estructura completa del bloque **Ámbito militar** con **11 categorías** y sus subfiltros dependientes (más de 100 capacitaciones/aptitudes individuales).
- Se relevó la estructura del bloque **Idioma** con 7 subfiltros (tipo de acreditación, idioma, institución, nivel, certificado, vigencia).
- Se definió la estructura jerárquica recomendada: `Tipo de formación → Categoría → Subcategoría/Aptitud → Filtros transversales`.
- Se propuso una tabla técnica de **26 campos esperados en API** con tipos de dato y operadores de búsqueda.
- Se identificaron **8 endpoints lógicos** para la integración.

**Arquitectura candidata:**
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS + Axios + React Router.
- Backend: Node.js 22 LTS + Express 5 + TypeScript (arquitectura candidata prioritaria; ver FASE 10).
- Base de datos local: PostgreSQL 16 — necesaria y mínima (usuarios, roles, permisos, auditoría, sesiones, configuraciones, caché de catálogos). No replica datos de personal.
- API externa: API institucional de RRHH (Read-Only, JSON).

### 3.6. Información Faltante (Vacíos Detectados)

| ID | Vacío | Impacto | Prioridad | Acción Requerida |
|---|---|---|---|---|
| VAC-01 | **Catálogo de formación civil (F-02)** — No se relevaron las subopciones del Ámbito civil | Impide definir filtros dependientes del bloque civil | Alta | Relevar con el Área de Personal |
| VAC-02 | **Contrato formal de la API** — No se dispone de documentación Swagger/OpenAPI ni especificación técnica de endpoints reales | Impide validar la tabla técnica de filtros propuesta contra datos reales | Crítica | Solicitar documentación técnica al área responsable |
| VAC-03 | **Modelo de autenticación de la API** — No está definido cómo se autenticará el sistema proxy ante la API institucional (tokens, API keys, OAuth, certificados) | Bloquea el diseño del módulo de integración | Alta | Definir con el área de infraestructura |
| VAC-04 | **Volumen de datos estimado** — Se desconoce la cantidad aproximada de registros de personal, formaciones y aptitudes que maneja la API | Afecta decisiones de rendimiento, paginación y caché | Media | Estimar con el Área de Personal |
| VAC-05 | **Política institucional de seguridad de la información** — No se ha confirmado formalmente qué normativas específicas aplican al tratamiento de estos datos | Puede condicionar decisiones de arquitectura y almacenamiento | Alta | Relevar normativa vigente |
| VAC-06 | **Stack definitivo del backend** — Se adoptó Node.js 22 + Express 5 + TS como arquitectura candidata prioritaria (FASE 10). Pendiente validación institucional | Afecta la planificación técnica y selección de frameworks | Media | Validar compatibilidad con infraestructura institucional |
| VAC-07 | **Nombres y cargos de stakeholders clave** — Se conocen los roles pero no las personas específicas | Necesario para formalización documental | Baja | Completar con datos reales |
| VAC-08 | **Disponibilidad del ambiente de pruebas de la API** — No se ha confirmado si existe un entorno de staging/sandbox para desarrollo | Puede retrasar la prueba de concepto | Alta | Confirmar con infraestructura |
| VAC-09 | **Reglas de negocio para cálculo de vigencias** — No está claro si las vigencias se calculan en el sistema o vienen resueltas desde la API | Afecta la lógica del backend proxy | Media | Definir con el cliente |
| VAC-10 | **Requisitos de exportación de datos** — No se ha definido si el sistema debe permitir exportar resultados (PDF, Excel, CSV) | Podría impactar el alcance funcional | Baja | Consultar con el cliente |

### 3.7. Supuestos Iniciales de Trabajo

| ID | Supuesto | Justificación | Riesgo si es falso |
|---|---|---|---|
| SUP-01 | La API institucional devolverá datos en formato JSON con estructura predecible | Es el formato estándar para APIs REST modernas | Requeriría transformación adicional o cambio de enfoque de integración |
| SUP-02 | La API soportará al menos los filtros básicos de consulta (tipo de formación, categoría, persona) | Sin filtrado mínimo del lado de la API, toda la carga recaería en el proxy | Degradación severa de rendimiento y aumento de complejidad |
| SUP-03 | Existirá un token o mecanismo de autenticación para que el proxy consuma la API | Sin autenticación, la seguridad del flujo completo se compromete | Revisión completa del modelo de seguridad |
| SUP-04 | El cliente estará disponible para validaciones tempranas de requisitos y filtros | Necesario para el enfoque iterativo e incremental | Retrasos en la definición funcional |
| SUP-05 | Los catálogos de categorías militares y aptitudes se mantendrán relativamente estables durante el desarrollo | Cambios frecuentes en catálogos exigirían mecanismos de sincronización | Necesidad de un módulo de administración de catálogos |
| SUP-06 | La infraestructura institucional permitirá el despliegue del sistema web (servidor, dominio, certificados SSL) | Es condición sine qua non para la operación del sistema | El proyecto no alcanzaría la fase de implantación |
| SUP-07 | La base de datos local será exclusivamente para datos operativos del sistema (usuarios, roles, auditoría, configuración) | Alineado con la restricción de no replicar datos de personal | N/A — es una decisión de diseño, no un supuesto externo |
| SUP-08 | El equipo de desarrollo dispondrá de los conocimientos técnicos en React, TypeScript y la tecnología de backend seleccionada | Necesario para ejecutar el desarrollo en los plazos estimados | Capacitación adicional que impacta el cronograma |

---

## 4. Tablas y Matrices Consolidadas

### 4.1. Matriz de Estado de la Información

| Bloque de Información | Estado | Cobertura | Fuente |
|---|---|---|---|
| Estructura de filtros — Ámbito militar | **Confirmado** | ~95% (catálogos detallados) | Relevamiento de pantallas del sistema actual |
| Estructura de filtros — Idioma | **Confirmado** | ~90% | Relevamiento de pantallas del sistema actual |
| Estructura de filtros — Ámbito civil | **Pendiente** | ~10% (solo se sabe que existe) | VAC-01 |
| Arquitectura candidata | **Propuesta técnica** | ~80% (falta definir backend) | Análisis técnico del equipo |
| Tabla técnica de campos API | **Propuesta técnica** | Propuesta — requiere validación | Mapeo funcional-técnico |
| Endpoints lógicos | **Propuesta técnica** | ~70% (propuesta, sin swagger real) | Diseño preliminar |
| Stack tecnológico frontend | **Confirmado** | 100% | Decisión de diseño |
| Stack tecnológico backend | **Candidata prioritaria definida** | ~85% (Node.js 22 + Express 5 + TS; pendiente validación institucional) | VAC-06 |
| Requisitos no funcionales | **Identificados — no formalizados** | ~60% | Contexto del proyecto |
| Modelo de seguridad | **Identificado — no formalizado** | ~50% (RBAC conceptual) | Decisión de diseño |

### 4.2. Resumen de Decisiones Tomadas Hasta la Fecha

| ID | Decisión | Justificación |
|---|---|---|
| DEC-01 | El sistema no se conectará directamente a la base de datos institucional | Restricción de seguridad institucional; principio de mínima superficie de ataque |
| DEC-02 | Se adoptará un modelo iterativo e incremental | Requisitos no cerrados; dependencia de API externa; necesidad de validación temprana |
| DEC-03 | La base de datos local será mínima (usuarios, roles, auditoría, config) | Evitar replicación innecesaria de datos sensibles |
| DEC-04 | Los filtros de consulta serán jerárquicos y dependientes | Evitar combinaciones inválidas y mejorar la experiencia de usuario |
| DEC-05 | El frontend usará React 19 + TypeScript + Vite + Tailwind CSS | Estándar moderno, ecosistema maduro, idoneidad para dashboards y formularios complejos |
| DEC-06 | Toda consulta debe registrarse en auditoría local | Requisito de trazabilidad y cumplimiento normativo |

---

## 5. Observaciones

1. **Madurez del contexto:** El proyecto cuenta con un análisis de contexto significativamente avanzado en lo referente a la estructura de filtros militares e idiomas. Sin embargo, el bloque de formación civil permanece sin relevar, lo cual constituye un vacío funcional que debe cerrarse antes de la fase de requisitos funcionales.

2. **Dependencia crítica:** Todo el diseño del sistema depende de que la API institucional exista, esté documentada y sea accesible. Si la API no expone los campos mapeados en la tabla técnica propuesta, habrá que reformular el modelo de consulta. Este es el **riesgo técnico más significativo** del proyecto.

3. **Separación clara entre análisis y propuesta:** En este diagnóstico se ha diferenciado explícitamente entre información confirmada (relevamiento de pantallas, decisiones de diseño ya tomadas) y propuestas técnicas (tabla de campos API, endpoints lógicos, arquitectura candidata). Esta separación se mantendrá en todas las fases subsiguientes.

4. **Stack de backend:** Se adoptó Node.js 22 + Express 5 + TypeScript como arquitectura candidata prioritaria (ver FASE 10). Si la institución exige PHP, la arquitectura desacoplada permite la sustitución sin afectar el diseño.

5. **Marco de ejecución:** El proyecto SECCAP inicia su ejecución formal en el contexto de una Práctica Profesional Supervisada (PPS). Este encuadre establece el punto de arranque institucional y académico, sin limitar el alcance integral del sistema.

6. **Naturaleza académica:** Este anteproyecto debe ser defendible académicamente. Cada afirmación técnica deberá estar respaldada por el contexto relevado, un principio de ingeniería de software reconocido, o una justificación formal de la decisión tomada.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad | Fase Afectada |
|---|---|---|---|---|
| PEN-01 | Relevar catálogo de formación civil | Equipo + Área de Personal | Alta | FASE 5 (Requisitos Funcionales) |
| PEN-02 | Obtener documentación técnica de la API (Swagger/OpenAPI) | Director de Proyecto | Crítica | FASE 7 (Reglas de Negocio), FASE 10 (Arquitectura) |
| PEN-03 | Definir modelo de autenticación para consumo de API | Equipo + Infraestructura | Alta | FASE 10 (Arquitectura) |
| PEN-04 | Confirmar existencia de ambiente de staging/sandbox | Director de Proyecto | Alta | FASE 10 (Arquitectura) |
| PEN-05 | Validar con la institución la compatibilidad del stack candidato (Node.js 22 + Express 5) | Equipo de desarrollo | Media | FASE 10 (Arquitectura) |
| PEN-06 | Relevar normativa de seguridad de la información aplicable | Director de Proyecto | Alta | FASE 6 (RNF), FASE 11 (Viabilidad) |
| PEN-07 | Completar nombres y cargos de stakeholders | Director de Proyecto | Baja | FASE 4 (Stakeholders) |
| PEN-08 | Confirmar requisitos de exportación de datos | Equipo + Cliente | Baja | FASE 5 (Requisitos Funcionales) |

---

## 7. Entregable Generado

**"Diagnóstico Inicial del Anteproyecto"** — Documento `00_diagnostico_inicial.md`

Contenido entregado:
- ✅ Resumen ejecutivo del problema
- ✅ Contexto organizacional
- ✅ Necesidad detectada
- ✅ Restricciones conocidas (7 identificadas)
- ✅ Información disponible y confirmada
- ✅ Listado de información faltante (10 vacíos)
- ✅ Supuestos iniciales de trabajo (8 supuestos)
- ✅ Matriz de estado de la información
- ✅ Decisiones tomadas hasta la fecha (6 decisiones)
- ✅ Observaciones técnicas
- ✅ Pendientes priorizados (8 pendientes)

---

## 8. Próxima Fase Recomendada

**FASE 1 — Definición del Problema u Oportunidad**

En esta fase se redactará con precisión el problema real que da origen al proyecto, centrado en la necesidad organizacional (no en la solución técnica). Se desarrollará:
- Descripción formal del problema.
- Impacto actual en la organización.
- Oportunidad de mejora.
- Consecuencias de no resolver el problema.
- Actores afectados.

> **Precondición:** No existen dependencias bloqueantes para iniciar la FASE 1. Los vacíos detectados (VAC-01 a VAC-10) no impiden la definición del problema sino que serán referenciados como parte de la incertidumbre del entorno.
