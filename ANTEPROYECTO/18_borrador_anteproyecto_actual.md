# BORRADOR DEL ANTEPROYECTO - ESTADO ACTUAL

Proyecto: SECCAP - Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal
Fecha de generación: 14/04/2026
Origen: consolidación automática de los archivos actuales de la carpeta ANTEPROYECTO/.
Uso: este archivo sirve para revisión integral del estado actual del anteproyecto en un solo documento.

## Archivos fuente incluidos
- 00_diagnostico_inicial.md
- 01_definicion_problema.md
- 02_objetivos.md
- 03_alcance.md
- 04_stakeholders_actores.md
- 05_requisitos_funcionales.md
- 06_requisitos_no_funcionales.md
- 07_reglas_negocio.md
- 08_casos_de_uso.md
- 09_modelo_analisis.md
- 10_arquitectura_tecnologias.md
- 11_viabilidad.md
- 12_planificacion_cronograma.md
- 13_recursos_presupuesto.md
- 14_riesgos_suposiciones.md
- 15_metricas_exito.md
- 16_gobierno_documental.md
- 17_consolidacion_final.md
- trazabilidad_anteproyecto.md

---

# Archivo fuente: 00_diagnostico_inicial.md

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

---

# Archivo fuente: 01_definicion_problema.md

# FASE 1 — DEFINICIÓN DEL PROBLEMA U OPORTUNIDAD
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Definición del Problema u Oportunidad**

## 2. Objetivo
Redactar con precisión el problema real que da origen al proyecto, centrado en la necesidad organizacional —no en la solución—, identificando su impacto, la oportunidad de mejora, las consecuencias de no resolverlo y los actores directamente afectados.

---

## 3. Desarrollo

### 3.1. Descripción del Problema

La institución de Defensa Nacional administra información crítica sobre las capacidades, aptitudes, formaciones profesionales, acreditaciones e idiomas de su personal. Esta información, almacenada en una base de datos corporativa privada y de acceso restringido, constituye un insumo esencial para la toma de decisiones operativas, la asignación de funciones, la planificación de capacitaciones y el cumplimiento de requisitos reglamentarios.

**El problema central radica en la inexistencia de un mecanismo unificado, seguro y estructurado que permita consultar esta información de forma transversal, oportuna y controlada.**

En la situación actual:

1. **Fragmentación del acceso:** La información de capacidades y aptitudes se consulta mediante procedimientos heterogéneos —solicitudes al Área de Personal, acceso a planillas dispersas, consultas verbales o correos electrónicos—, sin un canal único ni estandarizado.

2. **Ausencia de filtrado inteligente:** No existe un sistema que permita cruzar criterios de búsqueda (tipo de formación, categoría militar, aptitud específica, vigencia, idioma, unidad, grado) de forma jerárquica y dependiente. Las consultas actuales son lineales, manuales y propensas a errores de interpretación.

3. **Carencia de control de acceso diferenciado:** No se dispone de un esquema formal de roles que determine quién puede consultar qué información. Cualquier persona con acceso al canal informal puede potencialmente obtener datos que exceden su nivel de autorización.

4. **Inexistencia de trazabilidad y auditoría:** No se registra quién consulta qué información, cuándo, con qué filtros ni con qué resultado. Esto impide la rendición de cuentas y dificulta la detección de accesos indebidos.

5. **Exposición de datos sensibles:** Al no existir una capa intermedia que filtre y sancione los datos devueltos según el perfil del consultante, existe riesgo de exposición de información personal y militar que debería estar protegida bajo el principio de mínimo privilegio.

6. **Ineficiencia operativa:** Los tiempos de respuesta para obtener información consolidada sobre las capacidades del personal son significativamente mayores a lo aceptable para la operatoria institucional, generando cuellos de botella en procesos dependientes.

### 3.2. Impacto Actual en la Organización

| Dimensión | Impacto Observado |
|---|---|
| **Operativa** | Demoras en la obtención de información para asignación de funciones, conformación de equipos y planificación de misiones que requieren personal con aptitudes específicas |
| **Seguridad de la información** | Riesgo de acceso no autorizado a datos personales y militares sensibles por ausencia de RBAC y auditoría |
| **Toma de decisiones** | Decisiones basadas en información parcial, desactualizada o no verificada debido a la fragmentación de fuentes |
| **Cumplimiento normativo** | Incumplimiento potencial de regulaciones de protección de datos personales (Ley 25.326) y normativa interna de seguridad de la información en el ámbito de Defensa |
| **Administrativa** | Carga de trabajo excesiva en el Área de Personal, que actúa como intermediario manual para toda consulta |
| **Trazabilidad** | Imposibilidad de auditar el uso de información de personal, lo cual compromete la rendición de cuentas institucional |

### 3.3. Oportunidad de Mejora

El hecho de que la institución disponga de una **API de solo lectura** sobre la base de datos de personal constituye una **oportunidad técnica concreta** para resolver el problema sin comprometer la integridad ni la seguridad de los datos de origen.

La oportunidad se articula en los siguientes ejes:

> **Nota importante:** La oportunidad no consiste en reemplazar el sistema institucional de RRHH ni en construir un nuevo sistema de gestión de personal. Se trata de desarrollar una **solución de consulta controlada** (SECCAP) que consuma la API Read-Only existente, agregando una capa de seguridad (RBAC), trazabilidad (auditoría) y experiencia de usuario (filtros jerárquicos) que hoy no existen.

1. **Centralización controlada:** Construir un punto único de consulta que consuma la API institucional, eliminando la dispersión actual de canales informales.

2. **Filtrado inteligente y jerárquico:** Implementar un sistema de filtros dependientes que guíe al usuario a través de la estructura real de los datos (tipo de formación → categoría → aptitud → filtros transversales), reduciendo errores y mejorando la precisión de las consultas.

3. **Seguridad por diseño:** Incorporar desde el inicio un esquema RBAC que determine, por rol, qué datos puede consultar cada usuario, cumpliendo con el principio de mínimo privilegio.

4. **Auditoría y trazabilidad completa:** Registrar localmente toda operación de consulta, permitiendo verificar retrospectivamente quién accedió a qué información.

5. **Eficiencia operativa:** Reducir los tiempos de respuesta de horas o días (consulta manual) a segundos (consulta automatizada sobre API), liberando recursos del Área de Personal.

6. **No intrusión:** La naturaleza Read-Only del sistema garantiza que los datos de origen permanecen intactos, sin riesgo de modificación accidental o maliciosa.

### 3.4. Consecuencias de No Resolver el Problema

| ID | Consecuencia | Gravedad |
|---|---|---|
| CNR-01 | Se mantiene la exposición de datos sensibles sin control de acceso formal | **Crítica** |
| CNR-02 | Se perpetúa la imposibilidad de auditar consultas sobre información de personal | **Alta** |
| CNR-03 | El Área de Personal sigue actuando como intermediario manual, con sobrecarga creciente a medida que aumentan las consultas | **Alta** |
| CNR-04 | Las decisiones operativas continúan basándose en información parcial, desactualizada o no verificable | **Alta** |
| CNR-05 | Se incrementa el riesgo de incumplimiento normativo ante posibles auditorías internas o externas | **Alta** |
| CNR-06 | La API institucional existente permanece subutilizada, desperdiciando una inversión tecnológica ya realizada | **Media** |
| CNR-07 | Se dificulta la planificación de capacitaciones, la detección de brechas formativas y la consulta de vigencias de acreditaciones | **Media** |

### 3.5. Actores Afectados

| Actor | Relación con el Problema | Efecto |
|---|---|---|
| **Área de Personal / RRHH** | Gestora y custodia de la información. Actualmente, intermediaria manual obligada de toda consulta | Sobrecarga operativa; responsabilidad difusa sobre el uso de la información |
| **Jefes de Unidad / Dependencia** | Necesitan información de capacidades para asignación de funciones y conformación de equipos | Demora en la obtención de datos; decisiones con información incompleta |
| **Oficiales de Planeamiento** | Requieren datos transversales sobre aptitudes para planificación de misiones y ejercicios | Incapacidad de realizar consultas cruzadas eficientes |
| **Personal consultado (sujeto de datos)** | Sus datos personales y profesionales son objeto de las consultas | Exposición potencial de información sensible sin trazabilidad |
| **Área de Seguridad de la Información** | Responsable de velar por el cumplimiento de políticas de protección de datos | Imposibilidad de controlar y auditar el flujo de consultas |
| **Dirección / Comandancia** | Autoridad que requiere información consolidada para decisiones estratégicas | Visibilidad limitada sobre las capacidades reales del personal |
| **Área de Informática / Infraestructura** | Proveedores de la API y del soporte tecnológico | Deben habilitar acceso controlado a la nueva aplicación |

---

## 4. Tablas y Matrices

### 4.1. Matriz Problema - Impacto - Actor

| Aspecto del Problema | Impacto Principal | Actor Más Afectado |
|---|---|---|
| Fragmentación del acceso | Ineficiencia operativa | Área de Personal, Jefes de Unidad |
| Ausencia de filtrado inteligente | Consultas imprecisas o incompletas | Oficiales de Planeamiento |
| Sin control de acceso diferenciado | Exposición de datos sensibles | Personal consultado, Área de Seguridad |
| Sin trazabilidad ni auditoría | Incumplimiento normativo | Dirección, Área de Seguridad |
| Exposición de datos sensibles | Riesgo legal y normativo | Personal consultado, Dirección |
| Ineficiencia operativa | Demoras en decisiones | Todos los actores |

---

## 5. Observaciones

1. **Centrado en el problema, no en la solución:** Esta fase describe exclusivamente la necesidad organizacional. La solución técnica se desarrollará en fases posteriores (FASE 10 en adelante).

2. **El problema es multidimensional:** Combina aspectos operativos (ineficiencia), de seguridad (exposición de datos), normativos (cumplimiento legal), y de gestión (toma de decisiones con información deficiente). Esta multidimensionalidad justifica la complejidad del proyecto.

3. **La oportunidad es concreta:** La existencia de la API institucional de solo lectura no es un supuesto —es una condición confirmada del entorno— y constituye el habilitador técnico principal del proyecto.

4. **Coherencia con la FASE 0:** Los vacíos y supuestos detectados en el diagnóstico inicial no contradicen la definición del problema aquí presentada; por el contrario, refuerzan la necesidad de un enfoque iterativo.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F1-01 | Validar con el cliente que la descripción del problema refleja fielmente la realidad institucional | Director de Proyecto | Alta |
| PEN-F1-02 | Confirmar el volumen de consultas manuales actuales para cuantificar el impacto operativo | Equipo + Área de Personal | Media |
| PEN-F1-03 | Verificar si existen antecedentes de incidentes de seguridad o auditorías fallidas por falta de trazabilidad | Director de Proyecto | Media |

---

## 7. Entregable Generado

**"Definición del Problema y Oportunidad"** — Documento `01_definicion_problema.md`

Contenido entregado:
- ✅ Descripción formal del problema (6 dimensiones identificadas)
- ✅ Impacto actual en la organización (6 dimensiones)
- ✅ Oportunidad de mejora (6 ejes)
- ✅ Consecuencias de no resolverlo (7 consecuencias priorizadas)
- ✅ Actores afectados (7 actores identificados con relación y efecto)
- ✅ Matriz Problema - Impacto - Actor
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 2 — Objetivos del Proyecto**

Se definirán el objetivo general y los objetivos específicos, alineados directamente con el problema aquí descrito. Los objetivos deberán ser alcanzables, medibles y coherentes con el alcance que se delimitará en la FASE 3.

> **Precondición:** No existen dependencias bloqueantes. El problema está definido con suficiente precisión para derivar objetivos verificables.

---

# Archivo fuente: 02_objetivos.md

# FASE 2 — OBJETIVOS DEL PROYECTO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Objetivos del Proyecto**

## 2. Objetivo
Definir el objetivo general y los objetivos específicos del proyecto, de forma que sean alcanzables, medibles, verificables y directamente alineados con el problema definido en la FASE 1.

---

## 3. Desarrollo

### 3.1. Objetivo General

Desarrollar un sistema web de consulta segura (SECCAP) que, integrándose de forma segura con la API institucional de solo lectura del Área de Personal, permita buscar, filtrar y visualizar las capacidades, aptitudes, formaciones y acreditaciones del personal, aplicando control de acceso basado en roles, filtrado jerárquico de datos y registro completo de auditoría, sin replicar ni modificar la información de origen.

### 3.2. Objetivos Específicos

| ID | Objetivo Específico | Dimensión | Verificabilidad | Vinculación al Problema |
|---|---|---|---|---|
| OE-01 | Diseñar e implementar una **capa backend proxy** que consuma la API institucional de RRHH, valide los filtros recibidos del frontend, transforme las respuestas y devuelva únicamente los campos autorizados según el rol del usuario consultante | Integración / Seguridad | Demostrable mediante pruebas de integración y pruebas de control de acceso | Resuelve la fragmentación del acceso y la ausencia de filtrado controlado |
| OE-02 | Implementar un **sistema de autenticación y control de acceso basado en roles (RBAC)** que determine, para cada perfil de usuario, qué tipos de consultas puede realizar y qué campos puede visualizar | Seguridad | Verificable mediante matriz de permisos por rol y pruebas de autorización | Resuelve la carencia de control de acceso diferenciado |
| OE-03 | Desarrollar una **interfaz web moderna y responsiva** que permita al usuario construir consultas mediante filtros jerárquicos y dependientes (tipo de formación → categoría → aptitud → filtros transversales), visualizar resultados en tablas paginadas y acceder al detalle de cada registro | Usabilidad / Funcionalidad | Verificable mediante pruebas de usabilidad y validación de filtros dependientes | Resuelve la ausencia de filtrado inteligente |
| OE-04 | Diseñar e implementar un **módulo de auditoría y trazabilidad** que registre localmente toda operación de consulta, almacenando como mínimo: usuario solicitante, filtros aplicados, fecha y hora, resultado obtenido (éxito/fallo) y cantidad de registros devueltos | Trazabilidad / Cumplimiento | Verificable mediante inspección de registros de auditoría y pruebas de integridad | Resuelve la inexistencia de trazabilidad |
| OE-05 | Establecer un **modelo de persistencia local mínima** que almacene exclusivamente datos operativos del sistema (usuarios internos, roles, configuraciones, catálogos auxiliares, auditoría y logs), sin replicar la base de datos de personal institucional | Arquitectura / Seguridad | Verificable mediante inspección del esquema de base de datos y auditoría de tablas | Cumple la restricción de no replicación de datos sensibles |
| OE-06 | Implementar un **mecanismo de manejo de errores y contingencia** ante fallos de la API externa (timeouts, respuestas inválidas, caídas de servicio), que garantice una experiencia de usuario informativa y evite la exposición de datos técnicos internos | Resiliencia / Seguridad | Verificable mediante pruebas de caída simulada y validación de respuestas de error | Mitiga el riesgo de dependencia de la API externa |
| OE-07 | Producir la **documentación técnica y de gestión** del proyecto conforme a estándares PMBOK adaptados a software, incluyendo: requisitos, casos de uso, arquitectura, plan de pruebas, plan de implantación y criterios de aceptación | Documentación / Gestión | Verificable mediante revisión documental y checklist de entregables | Sostiene la defendibilidad académica y la trazabilidad del proyecto |

### 3.3. Alineación Objetivos – Problema

| Aspecto del Problema (FASE 1) | Objetivo(s) que lo Resuelve(n) |
|---|---|
| Fragmentación del acceso | OE-01, OE-03 |
| Ausencia de filtrado inteligente | OE-03 |
| Sin control de acceso diferenciado | OE-02 |
| Sin trazabilidad ni auditoría | OE-04 |
| Exposición de datos sensibles | OE-01, OE-02, OE-05 |
| Ineficiencia operativa | OE-01, OE-03, OE-06 |

> **Validación de cobertura:** Cada aspecto del problema es cubierto por al menos un objetivo específico. No existen objetivos huérfanos (sin vinculación al problema).

---

## 4. Tablas y Matrices

### 4.1. Matriz de Trazabilidad Objetivo → Restricción

| Objetivo | Restricciones que Respeta |
|---|---|
| OE-01 | REST-01 (Read-Only), REST-02 (solo vía API), REST-04 (no replicación) |
| OE-02 | REST-07 (auditoría obligatoria) |
| OE-03 | REST-06 (tecnologías modernas) |
| OE-04 | REST-03 (BD local solo para auditoría), REST-07 (auditoría obligatoria) |
| OE-05 | REST-03 (BD local mínima), REST-04 (no replicación) |
| OE-06 | REST-02 (dependencia de API) |
| OE-07 | REST-05 (requisitos no cerrados — documentación iterativa) |

---

## 5. Observaciones

1. **Se definieron 7 objetivos específicos**, dentro del rango solicitado (4-8). Cada uno es verificable mediante un criterio concreto y trazable a un aspecto del problema.

2. **No se incluyeron objetivos sobre modificación de datos de personal**, coherente con la restricción Read-Only (REST-01). Esto refuerza el alcance del proyecto.

3. **OE-06 (manejo de errores)** no es un requisito funcional directo del usuario, sino una necesidad arquitectónica derivada de la dependencia de una API externa. Se incluye como objetivo porque su ausencia constituiría un riesgo operativo significativo.

4. **OE-07 (documentación)** es un objetivo legítimo en el contexto de una Práctica Profesional Supervisada, donde la producción documental es evaluada académicamente.

5. Los objetivos son **intencionalmente independientes del stack tecnológico** del backend (PHP o Node.js), dado que esa decisión permanece abierta (VAC-06). Esto permite que los objetivos se mantengan válidos independientemente de la tecnología seleccionada.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F2-01 | Validar con el cliente que los 7 objetivos específicos reflejan sus expectativas | Director de Proyecto | Alta |
| PEN-F2-02 | Definir métricas cuantitativas para cada objetivo (se desarrollarán en FASE 15) | Equipo | Media |
| PEN-F2-03 | Confirmar si la exportación de datos (PDF/Excel/CSV) constituye un objetivo adicional o es parte de OE-03 | Equipo + Cliente | Baja |

---

## 7. Entregable Generado

**"Objetivos del Proyecto"** — Documento `02_objetivos.md`

Contenido entregado:
- ✅ 1 objetivo general redactado como oración verificable
- ✅ 7 objetivos específicos con verificabilidad y vinculación al problema
- ✅ Matriz de alineación Objetivos → Problema
- ✅ Matriz de trazabilidad Objetivo → Restricción
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 3 — Alcance y Fuera de Alcance**

Se delimitará con precisión qué incluye y qué no incluye el proyecto, estableciendo los límites funcionales, técnicos y organizacionales que condicionan el desarrollo. El alcance deberá ser coherente con los objetivos aquí definidos.

> **Precondición:** No existen dependencias bloqueantes. Los objetivos están definidos con suficiente precisión para derivar el alcance.

---

## 9. Encuadre de Ejecución

Los objetivos OE-01 a OE-07 definen el alcance del **proyecto integral SECCAP**. La ejecución formal del proyecto se inicia en el marco de una Práctica Profesional Supervisada, que funciona como hito de arranque académico e institucional.

---

# Archivo fuente: 03_alcance.md

# FASE 3 — ALCANCE Y FUERA DE ALCANCE
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Definición de Alcance del Anteproyecto**

## 2. Objetivo
Delimitar con precisión qué incluye y qué no incluye el proyecto, estableciendo los límites funcionales, técnicos y organizacionales. Evitar ambigüedad y crecimiento descontrolado del alcance (scope creep).

---

## 3. Desarrollo

### 3.1. Alcance Funcional

El sistema deberá cubrir las siguientes capacidades funcionales:

| ID | Funcionalidad | Descripción | Objetivo Vinculado |
|---|---|---|---|
| AF-01 | **Autenticación de usuarios** | Pantalla de login con validación de credenciales y establecimiento de sesión segura | OE-02 |
| AF-02 | **Gestión de roles y permisos** | Administración de roles internos del sistema (administrador, consultor, auditor) con permisos diferenciados por función | OE-02 |
| AF-03 | **Módulo de consulta con filtros jerárquicos** | Interfaz de búsqueda que implemente filtros dependientes: tipo de formación → categoría → subcategoría/aptitud → filtros transversales (vigencia, documentación, persona, unidad) | OE-03 |
| AF-04 | **Consumo de API institucional** | El backend proxy recibe los filtros validados, construye la consulta a la API de RRHH, obtiene la respuesta y la transforma según el rol del usuario | OE-01 |
| AF-05 | **Visualización de resultados** | Tabla paginada y ordenable con los registros devueltos por la consulta. Soporte para ordenamiento por columnas relevantes | OE-03 |
| AF-06 | **Vista de detalle** | Pantalla de detalle de un registro individual, mostrando los campos autorizados según el rol del usuario consultante | OE-03 |
| AF-07 | **Registro de auditoría** | Almacenamiento local de cada operación de consulta: usuario, filtros, fecha/hora, resultado, cantidad de registros | OE-04 |
| AF-08 | **Manejo de errores de integración** | Mensajes informativos al usuario ante fallos de la API (timeout, error de conexión, respuesta inválida), sin exponer datos técnicos internos | OE-06 |
| AF-09 | **Dashboard principal** | Pantalla de inicio post-login con acceso a las funcionalidades habilitadas según el rol del usuario | OE-03 |
| AF-10 | **Carga de catálogos** | Obtención y presentación de catálogos dependientes (categorías, aptitudes, idiomas, niveles) desde la API o desde caché local si aplica | OE-01 |

### 3.2. Alcance Técnico

| Componente | Alcance | Detalle |
|---|---|---|
| **Frontend** | Desarrollo completo | Aplicación SPA (Single Page Application) con React 19, TypeScript, Vite, Tailwind CSS, Axios, React Router |
| **Backend Proxy** | Desarrollo completo | Capa de validación, consulta a API, transformación de respuestas, control de acceso y auditoría |
| **Base de datos local** | Diseño e implementación | Esquema mínimo: tablas de usuarios, roles, permisos, auditoría, configuraciones, catálogos auxiliares |
| **Integración con API** | Desarrollo del adaptador | Módulo de comunicación con la API institucional: autenticación, envío de queries, parsing de respuestas, manejo de errores |
| **Seguridad** | Implementación transversal | RBAC, sesiones/tokens, sanitización de inputs, protección contra inyecciones, cabeceras de seguridad |
| **Documentación técnica** | Producción completa | Requisitos, casos de uso, arquitectura, plan de pruebas, plan de implantación |
| **Pruebas** | Ejecución y documentación | Pruebas unitarias, de integración, de seguridad (RBAC), y de aceptación del usuario (UAT) |

### 3.3. Alcance Organizacional

| Aspecto | Dentro del Alcance |
|---|---|
| **Usuarios del sistema** | Personal autorizado del área requirente y áreas designadas por la Dirección |
| **Ambiente de operación** | Infraestructura institucional (servidor interno o nube institucional) |
| **Capacitación** | Capacitación básica a los usuarios finales y operadores del sistema |
| **Soporte post-implantación** | Período limitado de soporte definido en el plan de implantación |
| **Documentación de usuario** | Manual de usuario básico y guía de operación |

### 3.4. Fuera de Alcance

| ID | Exclusión | Justificación |
|---|---|---|
| FA-01 | **Modificación de datos en la base de datos institucional** | El sistema es estrictamente Read-Only. La API es de solo lectura (REST-01) |
| FA-02 | **Carga o actualización de aptitudes, formaciones o acreditaciones del personal** | La carga se realiza en el sistema de origen; este sistema solo consulta |
| FA-03 | **Extracción masiva de datos (Data Warehouse / ETL)** | El sistema no replicará la base institucional. Cada consulta se resuelve en tiempo real consumiendo la API (REST-04) |
| FA-04 | **Desarrollo o modificación de la API institucional** | La API es provista por el Área de Personal/Informática. El proyecto la consume tal como está |
| FA-05 | **Gestión de personal (altas, bajas, modificaciones, licencias, destinos)** | Fuera del dominio funcional del sistema. Corresponde a otros sistemas institucionales |
| FA-06 | **Módulo de evaluaciones de desempeño** | No forma parte de la necesidad planteada. Su incorporación requeriría un cambio de alcance formal |
| FA-07 | **Integración con otros sistemas institucionales** además de la API de RRHH especificada | Solo se integra con la API identificada. Otras integraciones requieren evaluación separada |
| FA-08 | **Aplicación móvil nativa** | El sistema será una aplicación web responsiva, no una app nativa para dispositivos móviles |
| FA-09 | **Algoritmos de inteligencia artificial o machine learning** | No se contempla análisis predictivo ni clasificación automatizada de aptitudes |
| FA-10 | **Implementación de notificaciones push o alertas automáticas** | Puede ser considerado en fases futuras, pero no forma parte del alcance inicial |

### 3.5. Restricciones y Límites

| ID | Restricción/Límite | Tipo |
|---|---|---|
| LIM-01 | El alcance funcional se ajustará iterativamente conforme se cierren requisitos (REST-05) | Metodológica |
| LIM-02 | Las funcionalidades dependientes de campos que la API no exponga quedarán como **funcionalidad condicionada** | Técnica |
| LIM-03 | El número de usuarios concurrentes estará limitado por la capacidad del servidor institucional y los límites de la API | Infraestructura |
| LIM-04 | La precisión y completitud de los resultados depende directamente de la calidad de los datos de origen | Calidad de datos |
| LIM-05 | El sistema no puede garantizar disponibilidad si la API institucional no está operativa | Dependencia externa |
| LIM-06 | El proyecto se ejecuta dentro del marco temporal de ~14 semanas, con inicio formal vinculado a la Práctica Profesional Supervisada | Temporal |

### 3.6. Priorización Funcional del Proyecto

El SECCAP prioriza las siguientes líneas de trabajo para su primer tramo de ejecución:

1. **Documentación formal completa** (anteproyecto, requisitos, arquitectura, plan de pruebas, plan de implantación, cierre).
2. **Infraestructura base** (repositorio, setup de proyectos frontend y backend, BD local, PoC de API).
3. **Núcleo funcional del backend** (autenticación, RBAC, integración con API, auditoría).
4. **Núcleo funcional del frontend** (login, consulta con filtros jerárquicos, resultados, detalle autorizado según rol).
5. **Pruebas esenciales** (control de acceso, integración con API, UAT básica).
6. **Despliegue en entorno institucional de pruebas**, con pase a producción sujeto a validación.

Las funcionalidades complementarias (exportación, descarga documental, health check, administración avanzada) se implementarán según disponibilidad de tiempo o quedarán documentadas como trabajo futuro.

### 3.7. Criterios de Control de Cambios del Alcance

Cualquier solicitud que implique:
- Agregar módulos funcionales no listados en AF-01 a AF-10.
- Incorporar escritura sobre la base de datos externa.
- Integrar con sistemas adicionales.
- Cambiar la naturaleza del sistema (de consulta segura a gestión).

Deberá seguir el procedimiento formal de **Solicitud de Cambio**, que incluye:
1. Descripción del cambio solicitado.
2. Justificación.
3. Análisis de impacto en cronograma, costos y riesgos.
4. Aprobación formal por el patrocinador y el director del proyecto.

---

## 4. Tablas y Matrices

### 4.1. Matriz de Trazabilidad Alcance → Objetivos

| Funcionalidad (AF) | Objetivo(s) Cubierto(s) |
|---|---|
| AF-01 Autenticación | OE-02 |
| AF-02 Gestión de roles | OE-02 |
| AF-03 Filtros jerárquicos | OE-03 |
| AF-04 Consumo de API | OE-01 |
| AF-05 Visualización | OE-03 |
| AF-06 Vista de detalle | OE-03 |
| AF-07 Auditoría | OE-04 |
| AF-08 Manejo de errores | OE-06 |
| AF-09 Dashboard | OE-03 |
| AF-10 Catálogos | OE-01 |

> **Validación:** Todos los objetivos específicos (OE-01 a OE-07) están cubiertos por al menos una funcionalidad. OE-05 (persistencia local mínima) y OE-07 (documentación) son transversales y no mapean a una funcionalidad de usuario puntual sino a decisiones de arquitectura y gestión.

---

## 5. Observaciones

1. **Alcance intencionalmente conservador:** Se priorizó un alcance realista para ~14 semanas, priorizando un sistema funcional de consulta antes que un sistema ambicioso incompleto.

2. **Funcionalidad condicionada (LIM-02):** Varias capacidades dependen de que la API exponga los campos necesarios. Si el contrato de la API (VAC-02) revela limitaciones, se deberán recortar funcionalidades sin que ello signifique un fracaso del proyecto sino un ajuste iterativo.

3. **Exportación de datos:** Deliberadamente no se incluyó como funcionalidad confirmada (ver PEN-F2-03). Si el cliente la define como necesaria, se incorporará como AF-11 mediante solicitud de cambio.

4. **Coherencia total con FASE 0, 1 y 2:** Cada funcionalidad incluida es trazable a un objetivo (FASE 2), que a su vez responde a un aspecto del problema (FASE 1), dentro de las restricciones identificadas (FASE 0).

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F3-01 | Confirmar si la exportación de resultados (PDF/Excel/CSV) entra en alcance | Equipo + Cliente | Media |
| PEN-F3-02 | Verificar si el cliente requiere algún tipo de reporte o vista consolidada más allá de la tabla de resultados | Director de Proyecto | Media |
| PEN-F3-03 | Validar el alcance organizacional: confirmar qué áreas/usuarios tendrán acceso al sistema | Director de Proyecto + Área de Personal | Alta |

---

## 7. Entregable Generado

**"Definición de Alcance del Anteproyecto"** — Documento `03_alcance.md`

Contenido entregado:
- ✅ Alcance funcional (10 funcionalidades identificadas)
- ✅ Alcance técnico (7 componentes)
- ✅ Alcance organizacional
- ✅ Fuera de alcance (10 exclusiones justificadas)
- ✅ Restricciones y límites (6 identificados)
- ✅ Criterios de control de cambios
- ✅ Matriz de trazabilidad Alcance → Objetivos

---

## 8. Próxima Fase Recomendada

**FASE 4 — Stakeholders y Actores**

Se identificarán formalmente los interesados del proyecto y los actores del sistema, con su rol, interés, influencia y expectativa. Esta información es insumo directo para los casos de uso (FASE 8).

> **Precondición:** No existen dependencias bloqueantes. Los actores afectados ya fueron identificados preliminarmente en FASE 1 (§3.5).

---

# Archivo fuente: 04_stakeholders_actores.md

# FASE 4 — STAKEHOLDERS Y ACTORES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Mapa de Stakeholders y Actores**

## 2. Objetivo
Identificar formalmente a los interesados del proyecto (stakeholders) y los actores del sistema, clasificándolos por rol, interés, influencia, expectativa y relación con el proyecto. Los actores del sistema servirán como insumo directo para la especificación de casos de uso (FASE 8).

---

## 3. Desarrollo

### 3.1. Tabla de Stakeholders

| ID | Stakeholder | Rol | Interés | Influencia | Expectativa | Relación con el Proyecto |
|---|---|---|---|---|---|---|
| STK-01 | **Patrocinador del Proyecto** (Jefe/Director del Área de Personal) | Autoridad que valida y aprueba el proyecto | Alto | Alta | Obtener una herramienta que optimice la consulta de capacidades del personal bajo su responsabilidad | Sponsor. Aprueba alcance, cambios y entregables finales |
| STK-02 | **Director del Proyecto** (Practicante PPS) | Responsable de planificar, ejecutar y entregar el proyecto | Alto | Alta | Cumplir los objetivos del proyecto dentro del marco académico y temporal de la PPS | Líder técnico y de gestión. Ejecutor principal |
| STK-03 | **Tutor Académico** | Supervisor académico de la PPS | Medio | Media | Que el proyecto cumpla estándares académicos de ingeniería de software | Evaluador. Valida la calidad técnica y documental |
| STK-04 | **Responsable del Área de Informática / Infraestructura** | Proveedor de la API institucional y del soporte técnico | Alto | Alta | Que el nuevo sistema no comprometa la seguridad de la infraestructura existente; que no genere carga excesiva sobre la API | Proveedor técnico. Habilita acceso a la API, ambientes y recursos |
| STK-05 | **Jefes de Unidad / Dependencia** | Usuarios finales de nivel intermedio | Alto | Media | Consultar ágilmente las capacidades del personal bajo su mando para asignación de funciones y misiones | Usuarios directos del sistema |
| STK-06 | **Oficiales de Planeamiento** | Usuarios finales con necesidad de consultas transversales | Alto | Baja | Obtener información cruzada sobre aptitudes del personal para planificación operativa | Usuarios directos del sistema |
| STK-07 | **Personal administrativo del Área de Personal** | Operadores actuales de las consultas manuales | Medio | Baja | Reducir la carga de trabajo manual que les genera atender consultas por canales informales | Beneficiarios indirectos; pueden ser usuarios del sistema |
| STK-08 | **Área de Seguridad de la Información** | Responsable de políticas de protección de datos | Alto | Alta | Que el sistema cumpla con las normativas de seguridad, trazabilidad y mínimo privilegio | Regulador interno. Puede requerir auditorías y revisiones |
| STK-09 | **Personal sujeto de consulta** | Personas cuya información es consultada | Bajo (pasivo) | Baja | Que sus datos sean tratados con confidencialidad y solo accedidos por personal autorizado | Sujetos de datos. No interactúan con el sistema |
| STK-10 | **Dirección / Comandancia** | Nivel superior de toma de decisiones | Medio | Alta | Visibilidad consolidada sobre capacidades del personal para decisiones estratégicas | Consumidor indirecto de la información |

### 3.2. Matriz de Influencia / Interés

```
                    INFLUENCIA
                  Baja         Alta
              ┌───────────┬───────────┐
    Alto      │ STK-05    │ STK-01    │
              │ STK-06    │ STK-02    │
  INTERÉS     │           │ STK-04    │
              │           │ STK-08    │
              ├───────────┼───────────┤
    Bajo      │ STK-07    │ STK-03    │
              │ STK-09    │ STK-10    │
              └───────────┴───────────┘
```

**Estrategia por cuadrante:**

| Cuadrante | Stakeholders | Estrategia |
|---|---|---|
| Alto interés / Alta influencia | STK-01, STK-02, STK-04, STK-08 | **Gestionar de cerca.** Comunicación constante, participación en validaciones, aprobaciones formales |
| Alto interés / Baja influencia | STK-05, STK-06 | **Mantener informados.** Participan en validaciones de usabilidad y UAT |
| Bajo interés / Alta influencia | STK-03, STK-10 | **Mantener satisfechos.** Reportes periódicos, entregables formales |
| Bajo interés / Baja influencia | STK-07, STK-09 | **Monitorear.** Comunicación mínima, considerar si algo cambia su nivel de interés |

### 3.3. Actores del Sistema

Los actores del sistema son las entidades (humanas o no) que interactúan directamente con el sistema y que serán modelados en los casos de uso (FASE 8).

| ID | Actor | Tipo | Descripción | Funcionalidades Accesibles |
|---|---|---|---|---|
| ACT-01 | **Administrador del Sistema** | Humano — Primario | Usuario con máximos privilegios. Gestiona usuarios, roles, configuraciones y accede a logs de auditoría | AF-01, AF-02, AF-03, AF-04, AF-05, AF-06, AF-07, AF-09, AF-10 |
| ACT-02 | **Consultor** | Humano — Primario | Usuario autorizado a realizar consultas sobre capacidades y aptitudes del personal. Sus resultados están filtrados por rol | AF-01, AF-03, AF-04, AF-05, AF-06, AF-09, AF-10 |
| ACT-03 | **Auditor** | Humano — Primario | Usuario con acceso a los registros de auditoría y trazabilidad del sistema. Puede consultar quién accedió a qué información | AF-01, AF-07, AF-09 |
| ACT-04 | **API Institucional de RRHH** | Sistema externo — Secundario | Sistema proveedor de datos. Recibe consultas parametrizadas del backend proxy y devuelve información de personal en formato JSON | AF-04, AF-10 |
| ACT-05 | **Módulo de Auditoría Local** | Componente interno del sistema | Subsistema interno que registra automáticamente cada operación de consulta. No es un actor externo sino un componente arquitectónico del SECCAP | AF-07 |

### 3.4. Relación Stakeholders → Actores

| Stakeholder | Actor del Sistema | Justificación |
|---|---|---|
| STK-02 (Director del Proyecto) | ACT-01 (Administrador) | Durante el desarrollo y pruebas, el director actuará como administrador |
| STK-05 (Jefes de Unidad) | ACT-02 (Consultor) | Su función principal es consultar capacidades del personal |
| STK-06 (Oficiales de Planeamiento) | ACT-02 (Consultor) | Consultas transversales sobre aptitudes |
| STK-07 (Personal administrativo) | ACT-02 (Consultor) o ACT-01 (Administrador) | Según nivel de acceso asignado |
| STK-08 (Área de Seguridad) | ACT-03 (Auditor) | Requiere acceso a registros de auditoría |
| STK-04 (Área de Informática) | — (no es usuario directo) | Provee la API; no interactúa con el frontend |
| STK-01, STK-03, STK-09, STK-10 | — (no son usuarios directos) | Son interesados del proyecto, no actores del sistema |

---

## 4. Tablas y Matrices

### 4.1. Matriz de Permisos Preliminar por Actor

| Funcionalidad | ACT-01 Admin | ACT-02 Consultor | ACT-03 Auditor |
|---|---|---|---|
| AF-01 Login | ✅ | ✅ | ✅ |
| AF-02 Gestión de roles | ✅ | ❌ | ❌ |
| AF-03 Filtros jerárquicos | ✅ | ✅ | ❌ |
| AF-04 Consumo API | ✅ | ✅ (filtrado por rol) | ❌ |
| AF-05 Visualización resultados | ✅ | ✅ (campos según rol) | ❌ |
| AF-06 Vista de detalle | ✅ | ✅ (campos según rol) | ❌ |
| AF-07 Auditoría | ✅ | ❌ | ✅ |
| AF-08 Manejo errores | ✅ | ✅ | ✅ |
| AF-09 Dashboard | ✅ (completo) | ✅ (parcial) | ✅ (solo auditoría) |
| AF-10 Catálogos | ✅ | ✅ | ❌ |

---

## 5. Observaciones

1. **Nombres de stakeholders pendientes:** Los nombres y cargos reales continúan como PENDIENTE (VAC-07). Los stakeholders están identificados por rol funcional, lo cual es suficiente para las fases de análisis.

2. **Actor ACT-04 (API externa):** Es un actor no humano pero fundamental para el modelado de casos de uso. Toda interacción del sistema con la API debe pasar por el backend proxy, nunca directamente desde el frontend.

3. **Rol de Auditor (ACT-03):** Se separó del Administrador intencionalmente para aplicar el principio de **segregación de funciones** — quien administra el sistema no debería ser quien audita su uso.

4. **Escalabilidad de roles:** La matriz de permisos es preliminar. El RBAC definitivo se detallará en la fase de reglas de negocio (FASE 7) y se validará en las pruebas de seguridad.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F4-01 | Completar nombres y cargos reales de STK-01, STK-04 y STK-08 | Director de Proyecto | Baja |
| PEN-F4-02 | Validar con el cliente si existen otros tipos de usuarios más allá de Administrador, Consultor y Auditor | Equipo + Cliente | Media |
| PEN-F4-03 | Confirmar si la Dirección/Comandancia (STK-10) requiere un rol de «solo dashboards» con datos agregados | Director de Proyecto | Baja |

---

## 7. Entregable Generado

**"Mapa de Stakeholders y Actores"** — Documento `04_stakeholders_actores.md`

Contenido entregado:
- ✅ Tabla de 10 stakeholders identificados
- ✅ Matriz de Influencia/Interés con estrategia por cuadrante
- ✅ 5 actores del sistema (3 humanos, 2 sistemas)
- ✅ Relación Stakeholders → Actores
- ✅ Matriz de permisos preliminar por actor
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 5 — Requisitos Funcionales**

Se formalizarán los requisitos funcionales del sistema, organizados por módulos, con prioridad, dependencias y reglas asociadas. Se usarán como referencia las funcionalidades del alcance (AF-01 a AF-10) y la estructura de filtros relevada en el contexto.

> **Precondición:** No existen dependencias bloqueantes. Los stakeholders y actores están identificados.

---

# Archivo fuente: 05_requisitos_funcionales.md

# FASE 5 — REQUISITOS FUNCIONALES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Matriz de Requisitos Funcionales**

## 2. Objetivo
Definir formalmente qué debe hacer el sistema, organizando los requisitos funcionales por módulos, con prioridad, dependencias y reglas funcionales asociadas.

---

## 3. Desarrollo

### 3.1. Módulos Funcionales del Sistema

| ID Módulo | Nombre | Descripción |
|---|---|---|
| MOD-01 | **Autenticación y Sesión** | Login, logout, gestión de sesión y recuperación de acceso |
| MOD-02 | **Control de Acceso (RBAC)** | Gestión de roles, permisos y restricción de funcionalidades por perfil |
| MOD-03 | **Consulta con Filtros Jerárquicos** | Interfaz de búsqueda con filtros dependientes y transversales |
| MOD-04 | **Integración con API Institucional** | Comunicación del backend proxy con la API de RRHH |
| MOD-05 | **Visualización de Resultados** | Tabla de resultados paginada, ordenable y detalle individual |
| MOD-06 | **Auditoría y Trazabilidad** | Registro local de operaciones de consulta |
| MOD-07 | **Administración Básica del Sistema** | Gestión de usuarios internos, roles y configuraciones del SECCAP (no del personal institucional) |
| MOD-08 | **Gestión de Catálogos** | Carga y presentación de catálogos dependientes (categorías, aptitudes, idiomas) |
| MOD-09 | **Manejo de Errores** | Respuesta controlada ante fallos de integración |

### 3.2. Matriz de Requisitos Funcionales

#### MOD-01 — Autenticación y Sesión

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-01 | El sistema debe permitir a un usuario iniciar sesión con credenciales (usuario y contraseña) | Esencial | — | ACT-01, ACT-02, ACT-03 | Las credenciales deben validarse contra la base local |
| RF-02 | El sistema debe cerrar la sesión del usuario al solicitar logout | Esencial | RF-01 | ACT-01, ACT-02, ACT-03 | Debe invalidarse el token/sesión del lado del servidor |
| RF-03 | El sistema debe expirar la sesión automáticamente tras un período configurable de inactividad | Esencial | RF-01 | Todos | Tiempo configurable por el administrador (SUPUESTO: 30 min por defecto) |
| RF-04 | El sistema debe bloquear el acceso tras N intentos fallidos consecutivos de login | Esencial | RF-01 | Todos | N configurable (SUPUESTO: 5 intentos; bloqueo temporal de 15 min) |

#### MOD-02 — Control de Acceso (RBAC)

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-05 | El sistema debe asignar a cada usuario uno o más roles que determinen sus permisos | Esencial | RF-01 | ACT-01 | Roles mínimos: Administrador, Consultor, Auditor |
| RF-06 | El sistema debe restringir el acceso a funcionalidades según el rol del usuario autenticado | Esencial | RF-05 | Todos | Según matriz de permisos (FASE 4, §4.1) |
| RF-07 | El sistema debe filtrar los campos visibles en los resultados de consulta según el rol del usuario | Esencial | RF-05 | ACT-02 | Un consultor no debe ver campos que excedan su autorización |
| RF-08 | El sistema debe impedir que un usuario sin rol de Administrador gestione usuarios o roles | Esencial | RF-05 | ACT-01 | Principio de mínimo privilegio |

#### MOD-03 — Consulta con Filtros Jerárquicos

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-09 | El sistema debe presentar como primer filtro el **tipo de formación profesional** (civil, militar, idioma) | Esencial | RF-06 | ACT-02 | Este filtro es la raíz del árbol de consulta (F-01) |
| RF-10 | Al seleccionar "Ámbito militar", el sistema debe habilitar los filtros de **categoría militar** y **compromiso de servicios** | Esencial | RF-09 | ACT-02 | Filtros dependientes de F-01 = militar (F-03, F-04) |
| RF-11 | Al seleccionar una categoría militar, el sistema debe cargar dinámicamente el catálogo de **aptitudes/capacitaciones** correspondiente a esa categoría | Esencial | RF-10 | ACT-02 | Filtro F-05 depende de F-04; no se muestra sin categoría previa |
| RF-12 | Al seleccionar "Idioma", el sistema debe habilitar los filtros de **tipo de acreditación, idioma, institución, nivel, certificado y vigencia** | Esencial | RF-09 | ACT-02 | Filtros IDI-01 a IDI-07 |
| RF-13 | Al seleccionar "Ámbito civil", el sistema debe habilitar los filtros correspondientes a formación civil | Deseable | RF-09 | ACT-02 | **PENDIENTE:** Catálogo civil no relevado (VAC-01) |
| RF-14 | El sistema debe permitir aplicar **filtros transversales** (vigencia, documentación, persona, unidad, jerarquía) combinables con cualquier tipo de formación | Esencial | RF-09 | ACT-02 | Filtros F-06 a F-08, F-16 a F-22 |
| RF-15 | El sistema debe ofrecer un campo de **búsqueda textual general** que busque coincidencias parciales en campos de texto relevantes | Deseable | RF-09 | ACT-02 | Filtro F-15 (campo `q` o `search`) |
| RF-16 | El sistema debe permitir buscar personal por **DNI** con búsqueda exacta | Esencial | RF-14 | ACT-02 | Filtro F-17 |
| RF-17 | El sistema debe permitir buscar personal por **legajo** con búsqueda exacta | Esencial | RF-14 | ACT-02 | Filtro F-18 |
| RF-18 | El sistema debe permitir buscar personal por **apellido y nombre** con búsqueda parcial | Esencial | RF-14 | ACT-02 | Filtro F-16 |
| RF-19 | El sistema debe permitir filtrar por **unidad/dependencia** y **jerarquía/grado** | Deseable | RF-14 | ACT-02 | Filtros F-19, F-20 |
| RF-20 | El sistema debe deshabilitar filtros que no apliquen según el tipo de formación seleccionado | Esencial | RF-09 | ACT-02 | Evitar combinaciones inválidas |

#### MOD-04 — Integración con API Institucional

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-21 | El backend proxy debe autenticarse ante la API institucional utilizando el mecanismo definido (token, API key, certificado) | Esencial | — | ACT-04 | **PENDIENTE:** Mecanismo no definido (VAC-03) |
| RF-22 | El backend proxy debe construir la consulta a la API a partir de los filtros validados recibidos del frontend | Esencial | RF-09..RF-20 | ACT-04 | Los filtros deben ser sanitizados antes de enviarse |
| RF-23 | El backend proxy debe transformar la respuesta de la API antes de devolverla al frontend, eliminando campos no autorizados para el rol del usuario | Esencial | RF-07 | ACT-04 | Filtrado de campos por rol |
| RF-24 | El backend proxy debe implementar timeout configurable para las llamadas a la API externa | Esencial | RF-21 | ACT-04 | SUPUESTO: timeout por defecto de 30 segundos |
| RF-25 | El backend proxy debe registrar cada consulta realizada a la API en el módulo de auditoría | Esencial | RF-21 | ACT-04, ACT-05 | Vinculación directa con MOD-06 |

#### MOD-05 — Visualización de Resultados

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-26 | El sistema debe mostrar los resultados en una **tabla paginada** con cantidad configurable de registros por página | Esencial | RF-22 | ACT-02 | Paginación del lado del cliente o servidor según capacidad de la API |
| RF-27 | La tabla debe permitir **ordenamiento por columnas** (al menos: apellido, unidad, grado, tipo de aptitud) | Esencial | RF-26 | ACT-02 | — |
| RF-28 | El sistema debe permitir acceder a una **vista de detalle** de un registro individual desde la tabla de resultados | Esencial | RF-26 | ACT-02 | La vista de detalle mostrará campos adicionales según el rol |
| RF-29 | La vista de detalle debe indicar si el registro tiene **documentación respaldatoria** disponible | Deseable | RF-28 | ACT-02 | Filtro F-06 |
| RF-30 | El sistema debe permitir la **descarga del certificado/documento respaldatorio** cuando esté disponible | Deseable | RF-29 | ACT-02 | Funcionalidad sujeta a disponibilidad del recurso documental en la API institucional y a autorización explícita del rol consultante. Requiere endpoint de descarga en la API (propuesto: `GET /formacion/{id}/certificado`) |

#### MOD-06 — Auditoría y Trazabilidad

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-31 | El sistema debe registrar en la base local cada operación de consulta con: usuario, filtros aplicados, fecha/hora, resultado (éxito/fallo), cantidad de registros devueltos | Esencial | RF-22 | ACT-05 | Registro automático, no opcional |
| RF-32 | El sistema debe registrar intentos de acceso fallidos (login incorrecto, acceso no autorizado) | Esencial | RF-01, RF-06 | ACT-05 | Para detección de intentos de intrusión |
| RF-33 | El sistema debe proveer una **interfaz de consulta de logs de auditoría** accesible solo para el rol Auditor y Administrador | Esencial | RF-31 | ACT-01, ACT-03 | Filtros por fecha, usuario, tipo de operación |
| RF-34 | Los registros de auditoría **no deben ser modificables ni eliminables** por ningún usuario del sistema | Esencial | RF-31 | — | Integridad de la auditoría |

#### MOD-07 — Administración del Sistema

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-35 | El sistema debe permitir al Administrador **crear, editar y desactivar usuarios** internos | Esencial | RF-05 | ACT-01 | No se eliminan registros; se desactivan |
| RF-36 | El sistema debe permitir al Administrador **asignar y revocar roles** a los usuarios | Esencial | RF-05 | ACT-01 | — |
| RF-37 | El sistema debe permitir al Administrador **configurar parámetros** del sistema (timeout, intentos de login, tiempo de sesión) | Deseable | — | ACT-01 | — |

#### MOD-08 — Gestión de Catálogos

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-38 | El sistema debe obtener los catálogos de **categorías militares** desde la API o desde caché local | Esencial | RF-21 | ACT-04 | Propuesto: `GET /formacion/catalogos/categorias-militares` |
| RF-39 | El sistema debe obtener los catálogos de **aptitudes/capacitaciones** de forma dependiente a la categoría seleccionada | Esencial | RF-38 | ACT-04 | Propuesto: `GET /formacion/catalogos/aptitudes?categoria=...` |
| RF-40 | El sistema debe obtener los catálogos de **idiomas** y **niveles de idioma** | Esencial | RF-21 | ACT-04 | Propuestos: `GET /formacion/catalogos/idiomas`, `.../niveles-idioma` |
| RF-41 | Los catálogos pueden ser **almacenados temporalmente en caché** con una política de expiración configurable | Deseable | RF-38..RF-40 | ACT-01 | Reduce consultas repetitivas a la API |

#### MOD-09 — Manejo de Errores

| ID | Requisito | Prioridad | Dependencia | Actor(es) | Regla Asociada |
|---|---|---|---|---|---|
| RF-42 | Ante un timeout de la API externa, el sistema debe mostrar un mensaje informativo al usuario sin exponer datos técnicos | Esencial | RF-24 | ACT-02 | Ej: "El servicio de consulta no está disponible temporalmente" |
| RF-43 | Ante una respuesta inválida de la API, el sistema debe registrar el error en auditoría y mostrar mensaje genérico | Esencial | RF-22 | ACT-02, ACT-05 | No mostrar stack traces, IPs ni detalles internos |
| RF-44 | El sistema debe proveer una **página de estado** accesible para el Administrador que indique la conectividad con la API | Deseable | RF-21 | ACT-01 | Health check básico |

---

## 4. Tablas y Matrices

### 4.1. Resumen de Requisitos por Módulo y Prioridad

| Módulo | Total RF | Esenciales | Deseables |
|---|---|---|---|
| MOD-01 Autenticación | 4 | 4 | 0 |
| MOD-02 RBAC | 4 | 4 | 0 |
| MOD-03 Filtros | 12 | 10 | 2 |
| MOD-04 Integración API | 5 | 5 | 0 |
| MOD-05 Visualización | 5 | 3 | 2 |
| MOD-06 Auditoría | 4 | 4 | 0 |
| MOD-07 Administración | 3 | 2 | 1 |
| MOD-08 Catálogos | 4 | 3 | 1 |
| MOD-09 Errores | 3 | 2 | 1 |
| **Total** | **44** | **37** | **7** |

> **Nota sobre prioridades:** Los requisitos **Esenciales** conforman el núcleo funcional del SECCAP y deben implementarse con prioridad. Los requisitos **Deseables** complementan la funcionalidad y se abordarán según disponibilidad de tiempo y dependencias externas (ej. endpoints de API, catálogos no relevados).

### 4.2. Dependencias Críticas entre Módulos

```
MOD-01 (Autenticación)
   └──► MOD-02 (RBAC)
           ├──► MOD-03 (Filtros)
           │       └──► MOD-04 (Integración API)
           │               ├──► MOD-05 (Visualización)
           │               ├──► MOD-06 (Auditoría)
           │               └──► MOD-09 (Errores)
           ├──► MOD-07 (Administración)
           └──► MOD-08 (Catálogos)
                   └──► MOD-04 (Integración API)
```

---

## 5. Observaciones

1. **44 requisitos funcionales identificados**, de los cuales 37 son esenciales y 7 deseables. El volumen es coherente con la complejidad del sistema y el marco temporal de ~14 semanas.

2. **RF-13 (filtros civiles) está condicionado** al relevamiento del catálogo civil (VAC-01). Se incluye como "Deseable" hasta que se cierre ese vacío.

3. **RF-21 (autenticación ante API)** depende del VAC-03. El mecanismo se implementará conforme se defina con el área de infraestructura.

4. **RF-30 (descarga de certificados)** supone que la API expone un endpoint de descarga. Si no existe, este requisito se descarta o reformula.

5. Los IDs de filtro (F-01 a F-22, IDI-01 a IDI-07) referenciados provienen del análisis de filtros del `Contexto.md`, garantizando trazabilidad con el relevamiento original.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F5-01 | Relevar catálogo de formación civil para completar RF-13 | Equipo + Área de Personal | Alta |
| PEN-F5-02 | Confirmar con la API qué filtros soporta nativamente vs. cuáles debe resolver el proxy | Equipo + Área de Informática | Crítica |
| PEN-F5-03 | Definir si RF-30 (descarga de certificados) es viable según el contrato de API | Equipo | Media |
| PEN-F5-04 | Validar la priorización Esencial/Deseable con el cliente | Director de Proyecto | Alta |

---

## 7. Entregable Generado

**"Matriz de Requisitos Funcionales"** — Documento `05_requisitos_funcionales.md`

Contenido:
- ✅ 9 módulos funcionales identificados
- ✅ 44 requisitos funcionales con prioridad, dependencia, actor y regla
- ✅ Resumen por módulo y prioridad
- ✅ Diagrama de dependencias entre módulos
- ✅ Trazabilidad con estructura de filtros del contexto

---

## 8. Próxima Fase Recomendada

**FASE 6 — Requisitos No Funcionales**

Se definirán los atributos de calidad que el sistema debe exhibir: seguridad, rendimiento, disponibilidad, trazabilidad, mantenibilidad, usabilidad, escalabilidad, compatibilidad y observabilidad.

> **Precondición:** No existen dependencias bloqueantes.

---

# Archivo fuente: 06_requisitos_no_funcionales.md

# FASE 6 — REQUISITOS NO FUNCIONALES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Matriz de Requisitos No Funcionales**

## 2. Objetivo
Definir cómo debe comportarse el sistema en términos de atributos de calidad. Cada requisito no funcional (RNF) incluirá un criterio de aceptación o métrica inicial verificable.

---

## 3. Desarrollo

### 3.1. Seguridad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-01 | Todo acceso al sistema debe requerir autenticación previa | 0% de endpoints funcionales accesibles sin sesión válida | Esencial |
| RNF-02 | Las contraseñas deben almacenarse con hashing seguro (bcrypt, Argon2 o equivalente), nunca en texto plano | Verificable por inspección del esquema y código de almacenamiento | Esencial |
| RNF-03 | Las comunicaciones entre frontend y backend deben utilizar HTTPS (TLS 1.2 o superior) | Certificado SSL válido en producción; rechazo de conexiones HTTP | Esencial |
| RNF-04 | El sistema debe implementar protección contra los principales vectores OWASP Top 10: inyección SQL, XSS, CSRF, exposición de datos sensibles | Resultado limpio en escaneo OWASP básico o checklist manual | Esencial |
| RNF-05 | Los tokens de sesión deben tener tiempo de expiración configurable y ser invalidables del lado del servidor | Verificable por pruebas de sesión expirada y logout | Esencial |
| RNF-06 | Las respuestas de error no deben exponer información técnica interna (stack traces, rutas de servidor, versiones) | 0% de respuestas de error con datos técnicos expuestos en pruebas de pentest básico | Esencial |
| RNF-07 | El backend proxy no debe reenviar al frontend campos de la API que el rol del usuario no tenga autorización de ver | Verificable por pruebas de control de acceso con distintos roles | Esencial |

### 3.2. Rendimiento

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-08 | El tiempo de respuesta de una consulta típica (filtros + resultados) no debe superar los **5 segundos** incluyendo la latencia de la API externa | Medible con pruebas de rendimiento en ambiente controlado | Esencial |
| RNF-09 | La carga de catálogos (categorías, aptitudes, idiomas) debe completarse en menos de **2 segundos** | Medible con pruebas de tiempos de la UI | Deseable |
| RNF-10 | El sistema debe soportar al menos **10 consultas concurrentes** sin degradación perceptible del rendimiento | Verificable con pruebas de carga básicas | Deseable |
| RNF-11 | El frontend debe renderizar la tabla de resultados (hasta 50 registros) en menos de **1 segundo** después de recibir los datos | Medible con herramientas de performance del navegador | Deseable |

### 3.3. Disponibilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-12 | El sistema propio (frontend + backend + BD local) debe tener una disponibilidad objetivo del **99%** en horario laboral institucional | Registro de uptime durante el período de operación | Deseable |
| RNF-13 | La indisponibilidad de la API externa no debe causar la caída del sistema; debe mostrar un mensaje informativo y permitir acceso a funciones locales (auditoría, administración) | Verificable por prueba de desconexión simulada de la API | Esencial |

### 3.4. Trazabilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-14 | El **100% de las operaciones de consulta** a la API deben quedar registradas en el log de auditoría | Auditable por comparación entre consultas ejecutadas y registros almacenados | Esencial |
| RNF-15 | Cada registro de auditoría debe contener como mínimo: ID de usuario, timestamp, filtros aplicados, resultado (éxito/fallo), cantidad de registros devueltos | Verificable por inspección del esquema y de registros reales | Esencial |
| RNF-16 | Los registros de auditoría deben ser **inmutables** una vez almacenados | Verificable por pruebas de intento de modificación/eliminación desde todos los roles | Esencial |

### 3.5. Mantenibilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-17 | El código fuente debe seguir convenciones de estilo consistentes y documentadas | Linter configurado (ESLint para frontend; equivalente para backend). 0 errores de lint en CI | Deseable |
| RNF-18 | La arquitectura debe permitir reemplazar el proveedor de la API externa sin modificar el frontend ni la lógica de negocio | Verificable por diseño: capa de integración desacoplada mediante interfaz/adaptador | Esencial |
| RNF-19 | Los cambios de esquema de base de datos deben realizarse mediante **migraciones versionadas** | 100% de cambios de esquema ejecutados vía migraciones, nunca manuales | Deseable |
| RNF-20 | El sistema debe utilizar **versionado semántico** (SemVer) para sus releases | Verificable por inspección del historial de versiones | Deseable |

### 3.6. Usabilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-21 | La interfaz debe ser **responsiva** y funcional en resoluciones desde 1024x768 en adelante | Verificable por pruebas en distintas resoluciones de pantalla | Esencial |
| RNF-22 | El usuario debe poder completar una consulta típica (seleccionar filtros y obtener resultados) en **menos de 5 clics** | Verificable por pruebas de usabilidad o recorrido de la UI | Deseable |
| RNF-23 | Los mensajes de error deben ser **comprensibles para el usuario final** (sin jerga técnica) | Verificable por revisión de todos los mensajes de la UI | Esencial |
| RNF-24 | La interfaz debe seguir principios de diseño consistente: misma disposición de controles, misma paleta de colores, misma tipografía | Verificable por revisión visual y guía de estilo de Tailwind CSS | Deseable |

### 3.7. Escalabilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-25 | La arquitectura debe permitir agregar nuevos tipos de formación o categorías de aptitudes **sin modificar la estructura del sistema** | Verificable: agregar un nuevo catálogo no requiere cambios en tablas ni en lógica core | Deseable |
| RNF-26 | El sistema debe permitir la incorporación futura de nuevos roles **sin refactorización mayor** | Verificable por diseño: RBAC basado en tabla de permisos, no hardcodeado | Deseable |

### 3.8. Compatibilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-27 | La aplicación web debe ser compatible con los navegadores **Chrome (últimas 2 versiones), Firefox (últimas 2 versiones) y Edge (últimas 2 versiones)** | Verificable por pruebas funcionales en cada navegador | Esencial |
| RNF-28 | Las comunicaciones con la API institucional deben utilizar **HTTP/HTTPS con formato JSON** como estándar de intercambio | Verificable por inspección de las llamadas al API | Esencial |

### 3.9. Observabilidad

| ID | Requisito No Funcional | Criterio de Aceptación | Prioridad |
|---|---|---|---|
| RNF-29 | El backend debe registrar **logs técnicos** (errores, warnings, información de arranque) en archivos o sistema de logging centralizado | Verificable: archivo de log accesible con entradas formateadas | Deseable |
| RNF-30 | El sistema debe proveer un **endpoint de health check** para monitoreo básico del estado del servicio | Verificable: `GET /health` retorna estado 200 con información de conectividad a BD y API | Deseable |

---

## 4. Tablas y Matrices

### 4.1. Resumen de RNF por Categoría

| Categoría | Total RNF | Esenciales | Deseables |
|---|---|---|---|
| Seguridad | 7 | 7 | 0 |
| Rendimiento | 4 | 1 | 3 |
| Disponibilidad | 2 | 1 | 1 |
| Trazabilidad | 3 | 3 | 0 |
| Mantenibilidad | 4 | 1 | 3 |
| Usabilidad | 4 | 2 | 2 |
| Escalabilidad | 2 | 0 | 2 |
| Compatibilidad | 2 | 2 | 0 |
| Observabilidad | 2 | 0 | 2 |
| **Total** | **30** | **17** | **13** |

### 4.2. Trazabilidad RNF → Objetivos

| RNF | Objetivo Vinculado |
|---|---|
| RNF-01 a RNF-07 (Seguridad) | OE-02 (RBAC), OE-01 (Proxy seguro) |
| RNF-08 a RNF-11 (Rendimiento) | OE-03 (Interfaz ágil), OE-06 (Resiliencia) |
| RNF-12, RNF-13 (Disponibilidad) | OE-06 (Manejo de errores) |
| RNF-14 a RNF-16 (Trazabilidad) | OE-04 (Auditoría) |
| RNF-17 a RNF-20 (Mantenibilidad) | OE-07 (Documentación), OE-01 (Desacoplamiento) |
| RNF-21 a RNF-24 (Usabilidad) | OE-03 (Interfaz moderna) |
| RNF-25, RNF-26 (Escalabilidad) | OE-01 (Arquitectura), OE-05 (Persistencia) |
| RNF-27, RNF-28 (Compatibilidad) | OE-03 (Frontend), OE-01 (Integración) |
| RNF-29, RNF-30 (Observabilidad) | OE-06 (Resiliencia) |

---

## 5. Observaciones

1. **Seguridad como prioridad absoluta:** Los 7 RNF de seguridad son esenciales, sin excepciones. Esto es coherente con la naturaleza sensible de los datos y el principio de seguridad por diseño.

2. **Métricas de rendimiento conservadoras:** El umbral de 5 segundos para una consulta (RNF-08) contempla la latencia de la API externa. Si la API es rápida, los tiempos reales serán significativamente menores.

3. **RNF-18 (reemplazo de proveedor de API)** es un requisito de diseño arquitectónico clave. Implementar un adaptador/interfaz para la comunicación con la API permite que, si el contrato de la API cambia, solo se modifique el adaptador sin afectar capas superiores.

4. **No se incluyeron métricas de capacidad extrema** (miles de usuarios concurrentes, terabytes de datos) porque el contexto institucional no lo justifica. El sistema atiende un grupo acotado de usuarios autorizados.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F6-01 | Confirmar la latencia real de la API para ajustar los umbrales de rendimiento (RNF-08, RNF-09) | Equipo + Área de Informática | Media |
| PEN-F6-02 | Validar los requisitos de compatibilidad con el navegador estándar institucional | Director de Proyecto | Baja |
| PEN-F6-03 | Definir la política de retención de logs de auditoría (¿cuánto tiempo se conservan?) | Equipo + Cliente | Media |

---

## 7. Entregable Generado

**"Matriz de Requisitos No Funcionales"** — Documento `06_requisitos_no_funcionales.md`

Contenido:
- ✅ 30 RNF organizados en 9 categorías
- ✅ Cada RNF con criterio de aceptación verificable
- ✅ Resumen por categoría y prioridad (17 esenciales, 13 deseables)
- ✅ Trazabilidad RNF → Objetivos

---

## 8. Próxima Fase Recomendada

**FASE 7 — Reglas de Negocio y Lógica de Consulta**

Se definirán las reglas que condicionan el comportamiento del sistema: filtros dependientes, validaciones, permisos por rol, vigencias, descarga documental, auditoría obligatoria y consistencia de catálogos.

> **Precondición:** Requisitos funcionales y no funcionales definidos. No existen dependencias bloqueantes.

---

# Archivo fuente: 07_reglas_negocio.md

# FASE 7 — REGLAS DE NEGOCIO Y LÓGICA DE CONSULTA
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Reglas de Negocio del Módulo de Consulta**

## 2. Objetivo
Definir las reglas que condicionan el comportamiento del sistema: lógica de filtros dependientes, validaciones, permisos por rol, vigencias, descarga documental, restricciones, consistencia de catálogos y auditoría obligatoria.

---

## 3. Desarrollo

### 3.1. Reglas de Filtros Dependientes

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-01 | **Filtro raíz obligatorio** | El usuario debe seleccionar el Tipo de formación profesional (F-01: civil, militar, idioma) antes de que se habiliten los filtros específicos del bloque correspondiente | RF-09 |
| RN-02 | **Habilitación condicional — Ámbito militar** | Si F-01 = `militar`, se habilitan únicamente: Compromiso de servicios (F-03), Categoría militar (F-04) y filtros transversales. Los filtros de idioma se deshabilitan | RF-10 |
| RN-03 | **Habilitación condicional — Idioma** | Si F-01 = `idioma`, se habilitan únicamente: Tipo de acreditación (IDI-01), Idioma (IDI-02), Institución (IDI-03), Nivel (IDI-04), Certificado (IDI-05), Vigencia (IDI-06, IDI-07) y filtros transversales. Los filtros militares se deshabilitan | RF-12 |
| RN-04 | **Habilitación condicional — Ámbito civil** | Si F-01 = `civil`, se habilitan los filtros correspondientes al catálogo civil (**PENDIENTE:** catálogo no relevado, VAC-01) y filtros transversales | RF-13 |
| RN-05 | **Dependencia categoría → aptitud** | El filtro de Capacitación/Aptitud específica (F-05) solo se muestra cuando se ha seleccionado una Categoría militar (F-04). El catálogo cargado corresponde exclusivamente a la categoría elegida | RF-11 |
| RN-06 | **Filtros transversales siempre disponibles** | Los filtros de persona (DNI, legajo, apellido, nombre), unidad, jerarquía, vigencia y documentación están disponibles independientemente del tipo de formación seleccionado, siempre que la API los soporte | RF-14 |
| RN-07 | **Limpieza en cascada** | Si el usuario cambia el tipo de formación (F-01), todos los filtros dependientes que hubieran sido completados deben resetearse automáticamente | RF-20 |

### 3.2. Reglas de Validación

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-08 | **Validación de filtros en backend** | Todo filtro recibido por el backend proxy debe ser validado antes de construir la consulta a la API. Valores no pertenecientes al catálogo vigente deben ser rechazados | RF-22 |
| RN-09 | **Sanitización de entradas** | Todos los campos de texto libre (apellido, nombre, búsqueda general) deben ser sanitizados para prevenir inyecciones (SQL, XSS, etc.) | RF-22, RNF-04 |
| RN-10 | **DNI y legajo: formato numérico** | Los campos de búsqueda por DNI y legajo solo aceptan valores numéricos. El sistema debe rechazar entradas alfanuméricas | RF-16, RF-17 |
| RN-11 | **Longitud máxima de campos de texto** | Los campos de texto libre no pueden exceder los 100 caracteres para prevenir abuso | RF-15, RF-18 |
| RN-12 | **Consulta no vacía** | El sistema no debe permitir ejecutar una consulta sin al menos un filtro activo (más allá del tipo de formación). Esto previene consultas masivas no acotadas | RF-09 |

### 3.3. Reglas de Permisos por Rol

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-13 | **Administrador: acceso al SECCAP completo** | El rol Administrador puede acceder a todas las funcionalidades del SECCAP, incluyendo gestión de usuarios internos del sistema, consultas sin restricción de campos y logs de auditoría. **Nota:** esto no implica acceso a funciones de gestión de personal, que están fuera del alcance del sistema | RF-05, RF-06 |
| RN-14 | **Consultor: campos filtrados por rol** | El rol Consultor puede ejecutar consultas, pero los campos visibles en los resultados están restringidos según una lista blanca definida por el Administrador. El control por rol aplica a: funcionalidades accesibles, campos visibles en resultados y detalle, acceso a documentos descargables y operaciones sensibles | RF-07 |
| RN-15 | **Auditor: solo lectura de logs** | El rol Auditor solo puede acceder al módulo de auditoría (RF-33). No puede ejecutar consultas sobre personal ni gestionar usuarios | RF-33 |
| RN-16 | **Denegación por defecto** | Cualquier funcionalidad no explícitamente asignada a un rol se considera **denegada**. El sistema opera con lógica de lista blanca, no de lista negra | RF-06, RNF-07 |
| RN-17 | **Restricción de campos sensibles** | Campos que se consideraran sensibles (ej.: datos personales específicos) solo serán visibles para roles con autorización explícita. La definición de campos sensibles es **configurable** por el Administrador | RF-07 |

### 3.4. Reglas de Vigencias

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-18 | **Cálculo de vigencia** | Si la API devuelve `fecha_vencimiento`, el sistema debe calcular el estado de vigencia como: `vigente` (fecha futura), `vencido` (fecha pasada), `proximo_a_vencer` (vence en ≤90 días). Si la API devuelve `estado_vigencia` ya calculado, se utiliza directamente | RF-14 |
| RN-19 | **Vigencia no aplica a todas las aptitudes** | No todas las aptitudes militares tienen fecha de vencimiento. Si el campo `fecha_vencimiento` es nulo, el estado es `sin_vencimiento` y no se muestra en filtros de vigencia temporal | RF-14 |
| RN-20 | **Indicador visual de vigencia** | Los resultados deben incluir un indicador visual del estado de vigencia: verde (vigente), amarillo (próximo a vencer), rojo (vencido), gris (sin vencimiento) | RF-26 |

### 3.5. Reglas de Descarga Documental

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-21 | **Descarga solo si existe y si el rol lo permite** | El botón o enlace de descarga de certificado solo se muestra si el registro indica documentación disponible (`tiene_documentacion = true` o `certificado_descargable = true`) y el rol del usuario tiene autorización explícita para descarga. Funcionalidad sujeta a disponibilidad del recurso documental en la API institucional | RF-29, RF-30 |
| RN-22 | **Descarga auditada** | Toda descarga de documento debe registrarse en el log de auditoría con: usuario, ID del registro, fecha/hora | RF-31 |
| RN-23 | **Descarga proxy con autorización** | El frontend no accede directamente al recurso documental de la API. El backend proxy solicita el documento, verifica que el rol del usuario esté autorizado para la descarga, lo valida y lo reenvía al frontend. Esto previene la exposición de URLs internas de la API. Funcionalidad sujeta a disponibilidad del recurso documental en la API institucional y a autorización explícita del rol consultante | RF-30, RNF-06 |

### 3.6. Reglas de Consistencia de Catálogos

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-24 | **Catálogos desde la fuente oficial** | Si la API provee endpoints de catálogos, el sistema debe consumirlos directamente. No se deben reconstruir catálogos manualmente a menos que la API no los exponga | RF-38..RF-40 |
| RN-25 | **Caché con expiración** | Los catálogos obtenidos de la API pueden almacenarse en caché local con un TTL configurable (SUPUESTO: 24 horas). Al expirar, se recargan desde la API | RF-41 |
| RN-26 | **Fallback de catálogos** | Si la API no responde y hay caché vigente, el sistema usa la caché. Si la caché expiró y la API no responde, el sistema muestra un mensaje informativo y no permite ejecutar consultas que dependan de ese catálogo | RF-42 |

### 3.7. Reglas de Auditoría Obligatoria

| ID | Regla | Descripción | RF Vinculado |
|---|---|---|---|
| RN-27 | **Auditoría automática e incondicional** | Toda consulta exitosa o fallida a la API se registra automáticamente. No existe opción de desactivar la auditoría | RF-31 |
| RN-28 | **Inmutabilidad de registros** | Los registros de auditoría no pueden ser editados, eliminados ni truncados por ningún rol, incluyendo el Administrador | RF-34 |
| RN-29 | **Campos mínimos de auditoría** | Cada registro debe contener: `id_usuario`, `timestamp_utc`, `accion` (consulta/descarga/login/error), `filtros_aplicados` (JSON), `resultado` (éxito/fallo), `cantidad_registros`, `ip_origen` | RF-31, RNF-15 |
| RN-30 | **Auditoría de eventos de seguridad** | Se registran obligatoriamente: intentos de login fallidos, intentos de acceso no autorizado, cambios de rol, creación/desactivación de usuarios | RF-32 |

---

## 4. Tablas y Matrices

### 4.1. Resumen de Reglas por Categoría

| Categoría | Cantidad | IDs |
|---|---|---|
| Filtros dependientes | 7 | RN-01 a RN-07 |
| Validación | 5 | RN-08 a RN-12 |
| Permisos por rol | 5 | RN-13 a RN-17 |
| Vigencias | 3 | RN-18 a RN-20 |
| Descarga documental | 3 | RN-21 a RN-23 |
| Consistencia de catálogos | 3 | RN-24 a RN-26 |
| Auditoría obligatoria | 4 | RN-27 a RN-30 |
| **Total** | **30** | — |

### 4.2. Matriz de Impacto en Componentes

| Regla | Frontend | Backend Proxy | BD Local | API Externa |
|---|---|---|---|---|
| RN-01 a RN-07 (Filtros) | ✅ Lógica UI | ✅ Validación | — | — |
| RN-08 a RN-12 (Validación) | ✅ Validación frontend | ✅ Validación backend | — | — |
| RN-13 a RN-17 (Permisos) | ✅ Restricción UI | ✅ Filtrado campos | ✅ Tabla roles/permisos | — |
| RN-18 a RN-20 (Vigencias) | ✅ Indicador visual | ✅ Cálculo si aplica | — | ✅ Provee fecha |
| RN-21 a RN-23 (Descarga) | ✅ Botón condicional | ✅ Proxy de descarga | ✅ Log de auditoría | ✅ Endpoint de descarga |
| RN-24 a RN-26 (Catálogos) | ✅ Selectores dinámicos | ✅ Caché/fallback | ✅ Caché opcional | ✅ Endpoints de catálogos |
| RN-27 a RN-30 (Auditoría) | — | ✅ Registro automático | ✅ Tabla de auditoría | — |

---

## 5. Observaciones

1. **30 reglas de negocio** definidas. Todas son trazables a requisitos funcionales o no funcionales previamente establecidos.

2. **RN-12 (consulta no vacía)** es una regla de protección crítica. Sin ella, un usuario podría ejecutar consultas sin filtros que devuelvan grandes volúmenes de datos, generando carga excesiva sobre la API y exposición innecesaria de información.

3. **RN-18 (cálculo de vigencia)** contempla dos escenarios: la API devuelve el estado precalculado, o devuelve solo la fecha y el sistema lo calcula. La implementación dependerá del contrato real de la API (VAC-02).

4. **RN-28 (inmutabilidad)** implica que la tabla de auditoría no debe tener permisos de DELETE o UPDATE para ningún usuario de la aplicación. Esto se implementará a nivel de permisos de base de datos.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F7-01 | Confirmar si la API provee `estado_vigencia` calculado o solo `fecha_vencimiento` | Equipo + Área de Informática | Alta |
| PEN-F7-02 | Definir la lista blanca de campos visibles por cada rol (RN-14, RN-17) | Equipo + Cliente | Alta |
| PEN-F7-03 | Validar el TTL de caché de catálogos con el área responsable de la API | Director de Proyecto | Media |
| PEN-F7-04 | Confirmar si la API tiene endpoint de descarga de documentos | Equipo | Alta |

---

## 7. Entregable Generado

**"Reglas de Negocio del Módulo de Consulta"** — Documento `07_reglas_negocio.md`

Contenido:
- ✅ 30 reglas de negocio en 7 categorías
- ✅ Trazabilidad completa con requisitos funcionales y no funcionales
- ✅ Matriz de impacto en componentes
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 8 — Casos de Uso**

Se modelarán las interacciones entre actores y sistema, especificando los casos de uso principales con flujos básicos, alternativos y relaciones include/extend.

> **Precondición:** Actores (FASE 4), requisitos funcionales (FASE 5) y reglas de negocio (FASE 7) definidos.

---

# Archivo fuente: 08_casos_de_uso.md

# FASE 8 — CASOS DE USO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Casos de Uso del Sistema**

## 2. Objetivo
Modelar las interacciones entre actores y sistema mediante casos de uso, especificando los casos principales con flujos básicos, alternativos, excepciones y relaciones include/extend.

---

## 3. Desarrollo

### 3.1. Lista de Casos de Uso

| ID | Caso de Uso | Actor Principal | Actor Secundario | Prioridad |
|---|---|---|---|---|
| CU-01 | Iniciar sesión | ACT-01/02/03 | — | Esencial |
| CU-02 | Cerrar sesión | ACT-01/02/03 | — | Esencial |
| CU-03 | Seleccionar tipo de formación | ACT-02 | — | Esencial |
| CU-04 | Cargar catálogos dependientes | ACT-02 | ACT-04 (API) | Esencial |
| CU-05 | Aplicar filtros de consulta | ACT-02 | — | Esencial |
| CU-06 | Ejecutar consulta | ACT-02 | ACT-04 (API), ACT-05 (Auditoría) | Esencial |
| CU-07 | Ver resultados | ACT-02 | — | Esencial |
| CU-08 | Ver detalle de registro | ACT-02 | ACT-04 (API) | Esencial |
| CU-09 | Descargar documento respaldatorio | ACT-02 | ACT-04 (API), ACT-05 (Auditoría) | Deseable |
| CU-10 | Consultar logs de auditoría | ACT-03 | — | Esencial |
| CU-11 | Gestionar usuarios | ACT-01 | — | Esencial |
| CU-12 | Gestionar roles y permisos | ACT-01 | — | Esencial |
| CU-13 | Verificar estado del sistema | ACT-01 | ACT-04 (API) | Deseable |
| CU-14 | Registrar auditoría | ACT-05 | — | Esencial (automático) |
| CU-15 | Gestionar error de integración | Sistema | ACT-04 (API), ACT-05 (Auditoría) | Esencial |

### 3.2. Relaciones Include / Extend

```
CU-06 (Ejecutar consulta)
   ├── «include» CU-14 (Registrar auditoría)
   └── «extend» CU-15 (Gestionar error de integración) — condición: API falla

CU-05 (Aplicar filtros)
   └── «include» CU-04 (Cargar catálogos dependientes)

CU-09 (Descargar documento)
   └── «include» CU-14 (Registrar auditoría)

CU-08 (Ver detalle)
   └── «extend» CU-09 (Descargar documento) — condición: documento disponible

CU-11 (Gestionar usuarios)
   └── «include» CU-14 (Registrar auditoría)

CU-12 (Gestionar roles)
   └── «include» CU-14 (Registrar auditoría)
```

### 3.3. Especificación de Casos de Uso Principales

---

#### CU-01: Iniciar Sesión

| Campo | Descripción |
|---|---|
| **ID** | CU-01 |
| **Nombre** | Iniciar sesión |
| **Actor principal** | Cualquier usuario (ACT-01, ACT-02, ACT-03) |
| **Precondición** | El usuario tiene una cuenta activa en el sistema |
| **Postcondición** | El usuario queda autenticado y su sesión queda activa con los permisos de su rol |
| **RF vinculados** | RF-01, RF-04 |
| **RN vinculadas** | RN-13..RN-16, RN-30 |

**Flujo básico:**
1. El usuario accede a la pantalla de login.
2. El usuario ingresa usuario y contraseña.
3. El sistema valida las credenciales contra la base local.
4. Las credenciales son correctas.
5. El sistema crea una sesión y un token.
6. El sistema redirige al Dashboard según el rol del usuario.
7. Se registra el evento de login exitoso en auditoría (CU-14).

**Flujo alternativo — Credenciales incorrectas:**
3a. Las credenciales son incorrectas.
3b. El sistema incrementa el contador de intentos fallidos.
3c. El sistema muestra "Usuario o contraseña incorrectos" (sin especificar cuál falló).
3d. Se registra el intento fallido en auditoría (CU-14, RN-30).
3e. Si se alcanzaron N intentos, se bloquea la cuenta temporalmente (RF-04).

---

#### CU-02: Cerrar Sesión

| Campo | Descripción |
|---|---|
| **ID** | CU-02 |
| **Nombre** | Cerrar sesión |
| **Actor principal** | Cualquier usuario autenticado (ACT-01, ACT-02, ACT-03) |
| **Precondición** | Existe una sesión activa válida |
| **Postcondición** | La sesión o token queda invalidado y el usuario retorna a la pantalla de login |
| **RF vinculados** | RF-02, RF-03 |
| **RN vinculadas** | RNF-01, RNF-05 |

**Flujo básico:**
1. El usuario selecciona la opción "Cerrar sesión".
2. El frontend solicita al backend la invalidación de la sesión o token vigente.
3. El backend marca la sesión como inválida o elimina el contexto de autenticación.
4. El sistema limpia el estado local de la interfaz.
5. El sistema redirige al usuario a la pantalla de login.
6. Se registra el evento de cierre de sesión en auditoría (CU-14).

**Flujo alternativo — Sesión ya expirada:**
2a. El backend detecta que la sesión ya no es válida.
2b. El sistema fuerza la limpieza local de credenciales o cookies.
2c. El usuario es redirigido al login con mensaje de sesión expirada.

---

#### CU-03: Seleccionar Tipo de Formación

| Campo | Descripción |
|---|---|
| **ID** | CU-03 |
| **Nombre** | Seleccionar tipo de formación |
| **Actor principal** | ACT-02 (Consultor) |
| **Precondición** | Usuario autenticado con rol Consultor o Administrador |
| **Postcondición** | El bloque de filtros correspondiente queda habilitado; los filtros incompatibles quedan deshabilitados |
| **RF vinculados** | RF-09, RF-10, RF-12, RF-13, RF-20 |
| **RN vinculadas** | RN-01..RN-04, RN-07 |

**Flujo básico:**
1. El usuario accede al módulo de consulta.
2. El sistema presenta el selector de tipo de formación: Civil, Militar, Idioma.
3. El usuario selecciona un tipo.
4. El sistema habilita los filtros correspondientes al tipo seleccionado.
5. El sistema deshabilita los filtros no correspondientes.
6. Si es necesario, se invoca CU-04 para cargar catálogos del bloque seleccionado.

**Flujo alternativo — Cambio de tipo:**
4a. El usuario cambia el tipo de formación mientras hay filtros completados.
4b. El sistema limpia todos los filtros dependientes previamente completados (RN-07).
4c. Se cargan los nuevos catálogos correspondientes.

---

#### CU-04: Cargar Catálogos Dependientes

| Campo | Descripción |
|---|---|
| **ID** | CU-04 |
| **Nombre** | Cargar catálogos dependientes |
| **Actor principal** | ACT-02 (Consultor) — disparado por CU-03 o CU-05 |
| **Actor secundario** | ACT-04 (API Institucional) |
| **Precondición** | Se seleccionó un tipo de formación o una categoría que requiere catálogo dependiente |
| **Postcondición** | Los selectores de la UI se pueblan con los datos del catálogo correspondiente |
| **RF vinculados** | RF-38, RF-39, RF-40, RF-41 |
| **RN vinculadas** | RN-24, RN-25, RN-26 |

**Flujo básico:**
1. El sistema verifica si existe caché vigente del catálogo solicitado.
2. Si hay caché vigente, carga los datos desde caché.
3. Si no hay caché vigente, el backend solicita el catálogo a la API.
4. La API responde con el catálogo.
5. El backend almacena el catálogo en caché con el TTL configurado.
6. El frontend los presenta en los selectores correspondientes.

**Flujo alternativo — API no responde:**
3a. La API no responde dentro del timeout.
3b. Si hay caché expirada, se usa la caché con advertencia visual.
3c. Si no hay caché, se muestra mensaje informativo y se deshabilita el filtro afectado.

---

#### CU-05: Aplicar Filtros de Consulta

| Campo | Descripción |
|---|---|
| **ID** | CU-05 |
| **Nombre** | Aplicar filtros de consulta |
| **Actor principal** | ACT-02 (Consultor) |
| **Precondición** | Tipo de formación seleccionado (CU-03 completado); catálogos cargados |
| **Postcondición** | El estado del formulario de filtros queda configurado y listo para ejecutar la consulta |
| **RF vinculados** | RF-10..RF-20 |
| **RN vinculadas** | RN-05..RN-12 |

**Flujo básico:**
1. El usuario completa filtros habilitados según el tipo de formación.
2. Al seleccionar una categoría militar, el sistema invoca CU-04 para cargar aptitudes dependientes.
3. El usuario puede completar filtros transversales (DNI, legajo, nombre, unidad, vigencia).
4. El sistema valida en tiempo real el formato de los campos (DNI numérico, longitudes máximas).
5. El sistema habilita el botón "Consultar" cuando al menos un filtro adicional al tipo de formación esté activo (RN-12).

**Flujo alternativo — Validación fallida:**
4a. Un campo no cumple la validación de formato.
4b. Se muestra un mensaje de error inline junto al campo.
4c. El botón "Consultar" permanece deshabilitado hasta corregir.

---

#### CU-06: Ejecutar Consulta

| Campo | Descripción |
|---|---|
| **ID** | CU-06 |
| **Nombre** | Ejecutar consulta |
| **Actor principal** | ACT-02 (Consultor) |
| **Actor secundario** | ACT-04 (API Institucional), ACT-05 (Auditoría) |
| **Precondición** | Filtros aplicados y validados (CU-05 completado) |
| **Postcondición** | Los resultados se muestran en la tabla (CU-07); la operación queda registrada en auditoría |
| **RF vinculados** | RF-22, RF-23, RF-24, RF-25, RF-26 |
| **RN vinculadas** | RN-08, RN-09, RN-14, RN-27..RN-29 |

**Flujo básico:**
1. El usuario presiona "Consultar".
2. El frontend envía los filtros al backend proxy.
3. El backend valida los filtros (RN-08, RN-09).
4. El backend construye la consulta a la API con los filtros validados.
5. El backend envía la consulta a la API institucional (ACT-04).
6. La API responde con datos.
7. El backend filtra los campos de la respuesta según el rol del usuario (RN-14, RF-23).
8. El backend registra la operación en auditoría (CU-14 «include»).
9. El backend devuelve los datos filtrados al frontend.
10. El frontend presenta los resultados (CU-07).

**Flujo alternativo — API falla:**
5a. La API no responde, responde con error o excede el timeout.
5b. Se invoca CU-15 (Gestionar error de integración) «extend».
5c. Se registra el error en auditoría (CU-14).

**Flujo alternativo — Sin resultados:**
6a. La API responde exitosamente pero con 0 registros.
6b. Se muestra "No se encontraron resultados para los filtros aplicados".
6c. Se registra la consulta (con cantidad = 0) en auditoría.

---

#### CU-07: Ver Resultados

| Campo | Descripción |
|---|---|
| **ID** | CU-07 |
| **Nombre** | Ver resultados |
| **Actor principal** | ACT-02 (Consultor) |
| **Precondición** | CU-06 completado exitosamente con ≥1 resultado |
| **Postcondición** | El usuario visualiza los datos en tabla paginada |
| **RF vinculados** | RF-26, RF-27, RF-28 |

**Flujo básico:**
1. El sistema presenta los resultados en una tabla paginada.
2. El usuario puede ordenar por columnas.
3. El usuario puede navegar entre páginas.
4. El usuario puede seleccionar un registro para ver su detalle (CU-08).

---

#### CU-08: Ver Detalle de Registro

| Campo | Descripción |
|---|---|
| **ID** | CU-08 |
| **Nombre** | Ver detalle de registro |
| **Actor principal** | ACT-02 (Consultor) |
| **Precondición** | CU-07 — el usuario seleccionó un registro de la tabla |
| **Postcondición** | Se muestra el detalle autorizado del registro (campos visibles según rol) |
| **RF vinculados** | RF-28, RF-29 |

**Flujo básico:**
1. El usuario selecciona un registro de la tabla.
2. El sistema solicita al backend el detalle del registro.
3. El backend consulta la API por el registro individual.
4. El backend filtra campos según el rol del usuario consultante.
5. El frontend muestra la vista de detalle.
6. Si hay documentación disponible, se muestra la opción de descarga (CU-09 «extend»).

---

#### CU-09: Descargar Documento Respaldatorio

| Campo | Descripción |
|---|---|
| **ID** | CU-09 |
| **Nombre** | Descargar documento respaldatorio |
| **Actor principal** | ACT-02 (Consultor) o ACT-01 (Administrador) |
| **Actor secundario** | ACT-04 (API Institucional), ACT-05 (Auditoría) |
| **Precondición** | El usuario visualiza un registro con respaldo disponible y su rol tiene autorización de descarga |
| **Postcondición** | El documento es descargado o el sistema informa controladamente la imposibilidad de hacerlo |
| **RF vinculados** | RF-29, RF-30 |
| **RN vinculadas** | RNF-03, RNF-06, RNF-07 |

**Flujo básico:**
1. El usuario accede al detalle de un registro o a la acción de descarga desde la grilla.
2. El sistema verifica que el registro tenga documento disponible.
3. El backend verifica autorización del rol consultante para la descarga.
4. El backend solicita el recurso documental a la API institucional o repositorio asociado.
5. La API devuelve el archivo o stream binario.
6. El backend entrega el archivo al frontend con cabeceras apropiadas.
7. El usuario descarga el documento.
8. Se registra la operación en auditoría (CU-14).

**Flujo alternativo — Documento no disponible:**
2a. El registro no posee respaldo descargable.
2b. El sistema informa que el documento no está disponible y no ejecuta descarga.

**Flujo alternativo — Rol sin permiso de descarga:**
3a. El rol del usuario no posee permiso vigente para descargar.
3b. El backend rechaza la operación.
3c. El sistema informa acceso denegado y registra el intento en auditoría.

---

#### CU-10: Consultar Logs de Auditoría

| Campo | Descripción |
|---|---|
| **ID** | CU-10 |
| **Nombre** | Consultar logs de auditoría |
| **Actor principal** | ACT-03 (Auditor) o ACT-01 (Administrador) |
| **Precondición** | Usuario autenticado con rol Auditor o Administrador |
| **Postcondición** | Se muestran los registros de auditoría filtrados |
| **RF vinculados** | RF-33 |

**Flujo básico:**
1. El usuario accede al módulo de auditoría.
2. El sistema presenta filtros: rango de fechas, usuario, tipo de operación, resultado.
3. El usuario aplica filtros y ejecuta la búsqueda.
4. El sistema muestra los registros en tabla paginada, ordenada por fecha descendente.
5. El usuario puede inspeccionar el detalle de un registro (filtros aplicados, respuesta, etc.).

---

#### CU-11: Gestionar Usuarios

| Campo | Descripción |
|---|---|
| **ID** | CU-11 |
| **Nombre** | Gestionar usuarios |
| **Actor principal** | ACT-01 (Administrador) |
| **Precondición** | Usuario autenticado con rol Administrador |
| **Postcondición** | Se crea, actualiza o desactiva un usuario interno del sistema |
| **RF vinculados** | RF-35, RF-36 |
| **RN vinculadas** | RNF-01, RNF-02, RNF-14 |

**Flujo básico:**
1. El administrador accede al módulo de administración.
2. El sistema presenta la lista de usuarios internos.
3. El administrador selecciona crear, editar o desactivar un usuario.
4. El sistema valida los datos obligatorios y reglas de negocio.
5. El backend persiste la operación en la base local.
6. El sistema confirma el cambio realizado.
7. La operación queda registrada en auditoría (CU-14).

**Flujo alternativo — Datos inválidos o duplicados:**
4a. El sistema detecta username repetido o datos inválidos.
4b. Se informa el error sin persistir cambios.

---

#### CU-12: Gestionar Roles y Permisos

| Campo | Descripción |
|---|---|
| **ID** | CU-12 |
| **Nombre** | Gestionar roles y permisos |
| **Actor principal** | ACT-01 (Administrador) |
| **Precondición** | Usuario autenticado con rol Administrador |
| **Postcondición** | Los roles y sus permisos quedan asignados o actualizados según la política definida |
| **RF vinculados** | RF-05, RF-06, RF-08, RF-36 |
| **RN vinculadas** | RNF-01, RNF-07, RNF-26 |

**Flujo básico:**
1. El administrador accede a la gestión de roles.
2. El sistema muestra roles existentes y permisos asociados.
3. El administrador crea un rol nuevo o modifica uno existente.
4. Selecciona los permisos habilitados para ese rol.
5. El sistema valida consistencia de la matriz de permisos.
6. El backend guarda la configuración.
7. Se registra la modificación en auditoría (CU-14).

**Flujo alternativo — Cambio incompatible:**
5a. La combinación propuesta viola una regla de seguridad o segregación.
5b. El sistema rechaza la operación y muestra el motivo funcional.

---

#### CU-13: Verificar Estado del Sistema

| Campo | Descripción |
|---|---|
| **ID** | CU-13 |
| **Nombre** | Verificar estado del sistema |
| **Actor principal** | ACT-01 (Administrador) |
| **Actor secundario** | ACT-04 (API Institucional) |
| **Precondición** | Usuario autenticado con rol Administrador |
| **Postcondición** | El administrador visualiza el estado básico del backend, BD local y conectividad con API |
| **RF vinculados** | RF-44 |
| **RN vinculadas** | RNF-13, RNF-29, RNF-30 |

**Flujo básico:**
1. El administrador accede a la pantalla de estado del sistema.
2. El frontend invoca el endpoint de health check del backend.
3. El backend verifica su propio estado, la conectividad con la BD local y la disponibilidad de la API institucional.
4. El backend devuelve un resumen de estado.
5. El sistema presenta el resultado con indicadores simples: operativo, degradado o sin conexión.

**Flujo alternativo — API externa no disponible:**
3a. La verificación hacia la API falla.
3b. El backend informa estado degradado del servicio.
3c. El frontend presenta la advertencia sin comprometer funciones locales.

---

#### CU-14: Registrar Auditoría (Automático)

| Campo | Descripción |
|---|---|
| **ID** | CU-14 |
| **Nombre** | Registrar auditoría |
| **Actor principal** | ACT-05 (Sistema de Auditoría Local) |
| **Precondición** | Se produjo una acción auditable (consulta, descarga, login, error, cambio de rol) |
| **Postcondición** | Se almacenó un registro inmutable en la tabla de auditoría |
| **RF vinculados** | RF-31, RF-32, RF-34 |
| **RN vinculadas** | RN-27..RN-30 |

**Flujo básico:**
1. El componente que desencadena la acción invoca el módulo de auditoría.
2. El módulo construye el registro: id_usuario, timestamp_utc, accion, filtros, resultado, cantidad, ip_origen.
3. Se almacena en la tabla de auditoría (solo INSERT, sin UPDATE ni DELETE).
4. Se confirma el almacenamiento.

---

#### CU-15: Gestionar Error de Integración

| Campo | Descripción |
|---|---|
| **ID** | CU-15 |
| **Nombre** | Gestionar error de integración |
| **Actor principal** | Sistema (backend proxy) |
| **Actor secundario** | ACT-04 (API), ACT-05 (Auditoría) |
| **Precondición** | La API respondió con error, timeout o respuesta inválida |
| **Postcondición** | El error queda registrado; el usuario recibe un mensaje informativo |
| **RF vinculados** | RF-42, RF-43, RF-44 |
| **RN vinculadas** | RN-26, RN-27, RNF-06, RNF-13 |

**Flujo básico:**
1. El backend detecta fallo en la comunicación con la API.
2. Clasifica el error: timeout, error HTTP, respuesta malformada.
3. Registra el error en auditoría (CU-14) con detalle técnico (solo en logs internos).
4. Devuelve al frontend un mensaje genérico sin datos técnicos.
5. El frontend muestra el mensaje al usuario.

---

## 4. Tablas y Matrices

### 4.1. Resumen de Cobertura CU → RF

| CU | RF Cubiertos |
|---|---|
| CU-01 | RF-01, RF-04 |
| CU-02 | RF-02, RF-03 |
| CU-03 | RF-09, RF-10, RF-12, RF-13, RF-20 |
| CU-04 | RF-21, RF-38, RF-39, RF-40, RF-41 |
| CU-05 | RF-10..RF-20 |
| CU-06 | RF-07, RF-21, RF-22..RF-26 |
| CU-07 | RF-26, RF-27 |
| CU-08 | RF-07, RF-28, RF-29 |
| CU-09 | RF-30 |
| CU-10 | RF-33 |
| CU-11 | RF-35, RF-36 |
| CU-12 | RF-05, RF-06, RF-08 |
| CU-13 | RF-44 |
| CU-14 | RF-31, RF-32, RF-34 |
| CU-15 | RF-42, RF-43 |

> **Validación:** 43 de los 44 requisitos funcionales están cubiertos explícitamente por al menos un caso de uso. El RF-37 (configurar parámetros del sistema) sigue sin un caso de uso específico formalizado.

---

## 5. Observaciones

1. **15 casos de uso** identificados: 12 esenciales y 3 deseables. El caso CU-14 es automático (no requiere interacción humana).

2. **Priorización funcional:** Los CU del núcleo funcional prioritario son: CU-01, CU-03, CU-04, CU-05, CU-06, CU-07, CU-10, CU-14. Los CU complementarios (CU-08, CU-09, CU-13) se implementarán según disponibilidad de tiempo y dependencias externas. Los CU de soporte (CU-02, CU-11, CU-12, CU-15) acompañan al núcleo funcional.

3. **CU-06 (Ejecutar consulta)** es el caso de uso más complejo y el más importante del sistema. Involucra validación, integración, filtrado por rol y auditoría simultáneamente.

4. Los diagramas UML de casos de uso se producen como parte de la documentación UML complementaria y deben mantenerse alineados con este documento.

5. **CU-09 (Descarga de documento)** permanece como "Deseable" hasta confirmar que la API provee endpoint de descarga (PEN-F7-04).

6. **CU-15** se reserva para fallos de integración con la API externa. Los errores de autenticación y bloqueo por intentos pertenecen al flujo alternativo del CU-01 y no deben modelarse como error de integración.

7. **RF-37** sigue siendo un hueco funcional documental. Si se decide mantenerlo dentro del alcance, conviene crear un caso de uso específico de configuración administrativa o ampliar formalmente el alcance de CU-11/CU-12.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F8-01 | Validar flujos con el cliente mediante walkthrough | Director de Proyecto | Alta |
| PEN-F8-02 | Confirmar factibilidad real del CU-09 según contrato de descarga de la API | Equipo + Área de Informática | Media |
| PEN-F8-03 | Ajustar CU-13 con el mecanismo definitivo de health check y monitoreo | Equipo | Baja |
| PEN-F8-04 | Definir caso de uso específico para RF-37 o absorberlo formalmente dentro de administración | Equipo | Media |

---

## 7. Entregable Generado

**"Casos de Uso del Sistema"** — Documento `08_casos_de_uso.md`

Contenido:
- ✅ 15 casos de uso listados con actor, prioridad y clasificación
- ✅ Relaciones include/extend mapeadas
- ✅ 15 casos de uso especificados con flujo básico y, cuando corresponde, alternativo
- ✅ Cobertura CU → RF revisada (43/44 RF cubiertos explícitamente; RF-37 pendiente de CU formal)

---

## 8. Próxima Fase Recomendada

**FASE 9 — Modelo de Análisis**

Se representará la estructura lógica del sistema mediante clases de frontera, control, entidad e integración, con sus responsabilidades y relaciones principales.

> **Precondición:** Casos de uso definidos. No existen dependencias bloqueantes.

---

# Archivo fuente: 09_modelo_analisis.md

# FASE 9 — MODELO DE ANÁLISIS
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Modelo de Análisis Preliminar**

## 2. Objetivo
Representar la estructura lógica del sistema mediante el patrón de análisis BCE (Boundary–Control–Entity), identificando clases de frontera, control, entidad e integración, con sus responsabilidades y relaciones principales. El objetivo es separar claramente interfaz, lógica de negocio, auditoría e integración con la API.

---

## 3. Desarrollo

### 3.1. Clases de Frontera (Boundary)

Las clases de frontera representan los puntos de interacción entre los actores y el sistema.

| ID | Clase | Responsabilidad | Actor que Interactúa | CU Vinculados |
|---|---|---|---|---|
| B-01 | **PantallaLogin** | Presenta formulario de login; envía credenciales al controlador de autenticación | ACT-01/02/03 | CU-01 |
| B-02 | **PantallaDashboard** | Pantalla de inicio post-login; presenta accesos rápidos según rol | ACT-01/02/03 | CU-01 |
| B-03 | **PantallaConsulta** | Presenta los filtros jerárquicos y dependientes; recibe selecciones del usuario; envía filtros al controlador de consulta | ACT-02 | CU-03, CU-05 |
| B-04 | **PantallaResultados** | Presenta la tabla paginada de resultados; permite ordenar y navegar | ACT-02 | CU-07 |
| B-05 | **PantallaDetalle** | Muestra el detalle autorizado de un registro según los campos visibles para el rol del usuario; ofrece descarga de documento si está disponible y autorizada | ACT-02 | CU-08, CU-09 |
| B-06 | **PantallaAuditoria** | Presenta filtros y tabla de registros de auditoría | ACT-01/03 | CU-10 |
| B-07 | **PantallaAdminUsuarios** | Formularios para crear, editar y desactivar usuarios; asignar roles | ACT-01 | CU-11, CU-12 |
| B-08 | **PantallaEstadoSistema** | Muestra estado de conectividad con la API y salud del sistema | ACT-01 | CU-13 |
| B-09 | **ComponenteMensajeError** | Componente reutilizable que presenta mensajes de error al usuario sin datos técnicos | ACT-01/02/03 | CU-15 |

### 3.2. Clases de Control

Las clases de control orquestan la lógica de negocio entre las fronteras y las entidades.

| ID | Clase | Responsabilidad | CU Vinculados | RN Principales |
|---|---|---|---|---|
| C-01 | **ControladorAutenticacion** | Valida credenciales, gestiona sesiones/tokens, controla intentos fallidos, invoca auditoría de login | CU-01, CU-02 | RN-16, RN-30 |
| C-02 | **ControladorAutorizacion** | Verifica permisos del usuario antes de cada operación; aplica RBAC; filtra campos según rol | CU-03..CU-13 | RN-13..RN-17 |
| C-03 | **ControladorConsulta** | Recibe filtros de la frontera, los valida y sanitiza, construye la consulta, coordina con el integrador de API, filtra la respuesta por rol, invoca auditoría | CU-05, CU-06 | RN-08..RN-12, RN-14 |
| C-04 | **ControladorCatalogos** | Gestiona la obtención y caché de catálogos (categorías, aptitudes, idiomas, niveles) | CU-04 | RN-24..RN-26 |
| C-05 | **ControladorAuditoria** | Registra operaciones en la tabla de auditoría; provee consulta de logs para el módulo de auditoría | CU-10, CU-14 | RN-27..RN-30 |
| C-06 | **ControladorAdministracion** | Gestiona operaciones CRUD de usuarios y roles; invoca auditoría ante cambios | CU-11, CU-12 | — |
| C-07 | **ControladorErrores** | Clasifica errores de integración, produce mensajes seguros para el usuario, registra detalle técnico en logs internos | CU-15 | RN-26, RNF-06 |
| C-08 | **ControladorVigencias** | Calcula estado de vigencia a partir de fecha de vencimiento si la API no lo provee preresuelto | CU-06, CU-07 | RN-18..RN-20 |

### 3.3. Clases de Entidad (Entity)

Las clases de entidad representan los objetos de datos y la información persistente del dominio.

| ID | Clase | Responsabilidad | Persistencia | Atributos Principales |
|---|---|---|---|---|
| E-01 | **Usuario** | Representa un usuario interno del sistema | BD local | id, username, password_hash, nombre, email, activo, fecha_creacion |
| E-02 | **Rol** | Define un tipo de rol con sus permisos asociados | BD local | id, nombre, descripcion, permisos[] |
| E-03 | **Permiso** | Representa un permiso granular asignable a un rol | BD local | id, codigo, modulo, descripcion |
| E-04 | **RegistroAuditoria** | Almacena un evento de auditoría inmutable | BD local | id, id_usuario, timestamp_utc, accion, filtros_json, resultado, cantidad_registros, ip_origen |
| E-05 | **Sesion** | Representa una sesión activa del usuario | BD local / memoria | id, id_usuario, token, fecha_creacion, fecha_expiracion, activa |
| E-06 | **ConfiguracionSistema** | Parámetros configurables del sistema | BD local | clave, valor, descripcion, modificable_por |
| E-07 | **CatalogoCache** | Representa un catálogo almacenado temporalmente | BD local / memoria | id, tipo_catalogo, contenido_json, fecha_obtencion, ttl, vigente |
| E-08 | **ResultadoConsulta** | Objeto de transferencia que representa los datos devueltos por la API, ya filtrados por rol | Transitorio (no persistido) | registros[], total, filtros_aplicados, timestamp |
| E-09 | **FiltroConsulta** | Objeto que encapsula los filtros validados de una consulta | Transitorio | tipo_formacion, categoria, aptitud, filtros_transversales{}, usuario_solicitante |

### 3.4. Clases de Integración

Las clases de integración manejan la comunicación con sistemas externos.

| ID | Clase | Responsabilidad | Sistema Externo | Patrón |
|---|---|---|---|---|
| I-01 | **AdaptadorAPIPersonal** | Encapsula toda la comunicación con la API institucional de RRHH. Construye requests, parsea responses, maneja autenticación ante la API | ACT-04 (API Institucional) | **Adapter / Anti-Corruption Layer** |
| I-02 | **ClienteHTTP** | Componente genérico de comunicación HTTP con configuración de timeout, reintentos y manejo de errores de red | — | Wrapper / Facade |
| I-03 | **MapperRespuestaAPI** | Transforma la respuesta cruda de la API al modelo interno del sistema (E-08 ResultadoConsulta) | — | Mapper / DTO Transformer |

### 3.5. Diagrama de Relaciones Principales (Textual)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE FRONTERA                             │
│  B-01 Login ──► C-01 Autenticación                                 │
│  B-03 Consulta ──► C-03 ControladorConsulta                        │
│  B-04 Resultados ◄── C-03                                          │
│  B-05 Detalle ──► C-03                                             │
│  B-06 Auditoría ──► C-05 ControladorAuditoria                      │
│  B-07 Admin ──► C-06 ControladorAdministracion                     │
│  B-09 MensajeError ◄── C-07 ControladorErrores                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE CONTROL                              │
│  C-01 Autenticación ──► E-01 Usuario, E-05 Sesion, C-05 Auditoría │
│  C-02 Autorización ──► E-02 Rol, E-03 Permiso                     │
│  C-03 Consulta ──► C-02, C-08 Vigencias, I-01 Adaptador, C-05     │
│  C-04 Catálogos ──► I-01 Adaptador, E-07 CatalogoCache            │
│  C-05 Auditoría ──► E-04 RegistroAuditoria                        │
│  C-06 Administración ──► E-01, E-02, C-05                          │
│  C-07 Errores ──► C-05                                             │
│  C-08 Vigencias ──► E-08 ResultadoConsulta                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CAPA DE INTEGRACIÓN                            │
│  I-01 AdaptadorAPIPersonal ──► I-02 ClienteHTTP ──► [API Externa]  │
│  I-01 ──► I-03 MapperRespuestaAPI ──► E-08 ResultadoConsulta       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        CAPA DE ENTIDAD                              │
│  E-01 Usuario    E-02 Rol    E-03 Permiso    E-04 RegistroAudit   │
│  E-05 Sesion     E-06 Config E-07 CatCache   E-08 Resultado       │
│  E-09 FiltroConsulta                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Tablas y Matrices

### 4.1. Resumen de Clases por Estereotipo

| Estereotipo | Cantidad | IDs |
|---|---|---|
| Boundary (Frontera) | 9 | B-01 a B-09 |
| Control | 8 | C-01 a C-08 |
| Entity (Entidad) | 9 | E-01 a E-09 |
| Integration (Integración) | 3 | I-01 a I-03 |
| **Total** | **29** | — |

### 4.2. Trazabilidad Clase → Caso de Uso

| Clase | Casos de Uso que Soporta |
|---|---|
| B-01, C-01, E-01, E-05 | CU-01, CU-02 |
| B-03, C-03, C-04, E-09 | CU-03, CU-04, CU-05 |
| C-03, I-01, I-02, I-03, E-08 | CU-06 |
| B-04, C-03 | CU-07 |
| B-05, C-03 | CU-08, CU-09 |
| B-06, C-05, E-04 | CU-10, CU-14 |
| B-07, C-06, E-01, E-02 | CU-11, CU-12 |
| C-07, B-09 | CU-15 |

---

## 5. Observaciones

1. **29 clases de análisis** identificadas. El modelo separa claramente interfaz, negocio, datos e integración, alineado con la arquitectura desacoplada exigida.

2. **I-01 AdaptadorAPIPersonal** implementa el patrón **Anti-Corruption Layer**: aísla al sistema de los detalles internos de la API externa, permitiendo que cambios en el contrato de la API solo afecten al adaptador, no a la lógica de negocio (cumple RNF-18).

3. **E-08 y E-09 son transitorios** — no se persisten en la base de datos. Son objetos de transferencia que existen solo durante el ciclo de una consulta.

4. Este modelo es de **análisis**, no de diseño. En la fase de implementación, las clases pueden refinarse, dividirse o fusionarse según el framework y el stack seleccionado.

5. **Priorización de implementación:** Las clases prioritarias para el núcleo funcional son: B-01, B-03, B-04 (frontera); C-01, C-02, C-03, C-05 (control); E-01, E-02, E-03, E-04, E-05 (entidad); I-01, I-02, I-03 (integración). Las clases B-05 (detalle), B-07 (admin), B-08 (estado), C-04 (catálogos), C-06 (admin), C-08 (vigencias) se implementarán en fases posteriores según disponibilidad de tiempo.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F9-01 | Elaborar diagrama UML de clases de análisis | Equipo | Media |
| PEN-F9-02 | Elaborar diagramas de secuencia para CU-06 (consulta) y CU-01 (login) | Equipo | Media |
| PEN-F9-03 | Refinar el modelo al conocer la estructura real de respuesta de la API (VAC-02) | Equipo | Alta (cuando se resuelva VAC-02) |

---

## 7. Entregable Generado

**"Modelo de Análisis Preliminar"** — Documento `09_modelo_analisis.md`

Contenido:
- ✅ 9 clases de frontera con responsabilidades
- ✅ 8 clases de control con lógica y reglas vinculadas
- ✅ 9 clases de entidad con atributos principales
- ✅ 3 clases de integración con patrón identificado
- ✅ Diagrama de relaciones (textual)
- ✅ Trazabilidad Clase → CU

---

## 8. Próxima Fase Recomendada

**FASE 10 — Arquitectura Candidata y Tecnologías**

Se definirá la arquitectura preliminar del sistema, los componentes, el flujo general, las integraciones externas y la justificación del stack tecnológico.

> **Precondición:** Modelo de análisis definido. La decisión sobre el stack de backend (VAC-06) deberá tomarse o justificarse como decisión para esta fase.

---

# Archivo fuente: 10_arquitectura_tecnologias.md

# FASE 10 — ARQUITECTURA CANDIDATA Y TECNOLOGÍAS
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Arquitectura Candidata y Stack Tecnológico**

## 2. Objetivo
Definir la arquitectura preliminar del sistema, justificar las tecnologías seleccionadas, describir los componentes, el flujo general de datos, las integraciones externas y la estrategia de despliegue.

---

## 3. Desarrollo

### 3.1. Estilo Arquitectónico

Se adopta una **arquitectura en capas con desacoplamiento por capa de integración (Backend for Frontend + Anti-Corruption Layer)**.

**Justificación:**
- El sistema tiene dos fuentes de datos con responsabilidades distintas: la API institucional (datos de personal) y la BD local (usuarios, roles, auditoría).
- Se requiere una capa intermedia (proxy) que encapsule la lógica de integración, validación y filtrado por rol.
- Se necesita separar claramente: presentación (frontend), lógica de negocio y seguridad (backend), acceso a datos locales (BD) e integración externa (API).
- Este estilo permite que cambios en la API externa no afecten al frontend, y que cambios en la UI no afecten la lógica de negocio.

### 3.2. Componentes del Sistema

```
┌──────────────────────────────────────────────────────────────────┐
│                         USUARIO                                   │
│                    (Navegador Web)                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (SPA)                                 │
│  React 19 + TypeScript + Vite + Tailwind CSS                     │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐       │
│  │ Login     │ │ Consulta │ │ Resultados│ │ Auditoría    │       │
│  └───────────┘ └──────────┘ └──────────┘ └──────────────┘       │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ Dashboard │ │ Detalle  │ │ Admin    │                        │
│  └───────────┘ └──────────┘ └──────────┘                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS / REST JSON
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND PROXY                                  │
│  Node.js + Express (arquitectura candidata prioritaria — ver §3.5)  │
│  ┌─────────────────────────────────────────────────────┐         │
│  │ Middleware: Auth │ RBAC │ Rate Limit │ CORS │ Logger │         │
│  └─────────────────────────────────────────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐           │
│  │ Módulo Auth  │ │ Módulo       │ │ Módulo         │           │
│  │ & Sesión     │ │ Consulta     │ │ Administración │           │
│  └──────────────┘ └──────┬───────┘ └────────────────┘           │
│  ┌──────────────┐        │         ┌────────────────┐           │
│  │ Módulo       │        │         │ Módulo         │           │
│  │ Auditoría    │◄───────┤         │ Catálogos      │           │
│  └──────────────┘        │         └────────────────┘           │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────┐         │
│  │        Capa de Integración (Anti-Corruption Layer)  │         │
│  │  AdaptadorAPI │ ClienteHTTP │ MapperRespuesta        │         │
│  └─────────────────────────┬───────────────────────────┘         │
└────────────────┬───────────┼─────────────────────────────────────┘
                 │           │
                 ▼           ▼
┌────────────────────┐  ┌────────────────────────────────────┐
│  BD LOCAL          │  │  API INSTITUCIONAL RRHH            │
│  PostgreSQL        │  │  (Sistema externo — Read-Only)     │
│  ┌──────────────┐  │  │  JSON / REST                       │
│  │ usuarios     │  │  │  Endpoints de consulta y catálogos │
│  │ roles        │  │  └────────────────────────────────────┘
│  │ permisos     │  │
│  │ auditoria    │  │
│  │ config       │  │
│  │ cache_cat    │  │
│  └──────────────┘  │
└────────────────────┘
```

### 3.3. Flujo General de una Consulta

1. El **usuario** accede al frontend e inicia sesión.
2. El **frontend** presenta los filtros jerárquicos según el rol del usuario.
3. El usuario configura filtros y presiona "Consultar".
4. El **frontend** envía los filtros al **backend proxy** vía REST/JSON sobre HTTPS.
5. El **backend** autentica y autoriza al usuario (middleware Auth + RBAC).
6. El **módulo de consulta** valida y sanitiza los filtros.
7. La **capa de integración** (AdaptadorAPI) construye la consulta y la envía a la **API institucional**.
8. La API responde con datos en JSON.
9. El **MapperRespuesta** transforma los datos al modelo interno.
10. El **ControladorConsulta** filtra los campos según el rol.
11. El **módulo de auditoría** registra la operación en la **BD local**.
12. El backend devuelve los resultados al frontend.
13. El **frontend** renderiza la tabla de resultados.

### 3.4. Stack Tecnológico — Frontend

| Componente | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework UI | **React** | 19.x | Ecosistema maduro, componentes reutilizables, ideal para SPAs de consulta con formularios complejos |
| Lenguaje | **TypeScript** | 5.x (strict mode) | Tipado estático reduce errores en tiempo de desarrollo; mejora mantenibilidad |
| Bundler | **Vite** | 6.x | Desarrollo rápido (HMR), build optimizado, configuración mínima |
| Estilos | **Tailwind CSS** | 4.x | Utility-first; prototipado rápido; consistencia visual sin CSS custom complejo |
| HTTP Client | **Axios** | 1.x | Interceptores para manejo de tokens y errores; soporte de cancelación de requests |
| Routing | **React Router** | 7.x | Navegación SPA estándar; rutas protegidas por rol |
| Iconos | **Lucide React** | Última estable | Íconos ligeros, consistentes y open-source |

### 3.5. Stack Tecnológico — Backend

**Arquitectura candidata prioritaria: Node.js + Express**

> **Nota:** Node.js + Express + TypeScript se adopta como **arquitectura candidata prioritaria**, no como decisión definitiva e irreversible. La confirmación final depende de la validación con la infraestructura institucional (PEN-F10-01). Si la institución exige PHP, la arquitectura desacoplada permite la sustitución sin afectar el diseño.

| Componente | Tecnología | Versión | Justificación |
|---|---|---|---|
| Runtime | **Node.js** | 22.x LTS | Mismo lenguaje que el frontend (TypeScript); ecosistema npm robusto; eficiente para I/O (llamadas a API) |
| Framework HTTP | **Express** | 5.x | Framework minimalista, maduro, extensible vía middleware |
| Lenguaje | **TypeScript** | 5.x | Stack unificado frontend/backend; tipado de DTOs compartido |
| ORM / Query Builder | **Prisma** o **Knex.js** | Última estable | Migraciones versionadas, type-safe, consultas parametrizadas |
| Autenticación | **JWT** (jsonwebtoken) | — | Tokens stateless para autenticación; compatible con RBAC |
| Validación | **Zod** o **Joi** | Última estable | Validación de esquemas de entrada; sanitización de filtros |
| Logging | **Winston** o **Pino** | Última estable | Logging estructurado (JSON) con niveles y rotación |
| Testing | **Vitest** o **Jest** | Última estable | Consistente con herramientas del frontend |

**Justificación de Node.js sobre PHP:**

| Criterio | Node.js | PHP |
|---|---|---|
| Stack unificado (TypeScript full-stack) | ✅ | ❌ |
| Eficiencia en I/O asíncrono (llamadas a API) | ✅ Nativo | ⚠️ Requiere extensiones |
| Ecosistema de paquetes para proxying y middleware | ✅ npm/express middleware | ⚠️ Menos opciones estándar |
| Facilidad de desarrollo para equipo reducido | ✅ Un solo lenguaje | ⚠️ Dos lenguajes |
| Soporte institucional | **PENDIENTE** (SUP) | **PENDIENTE** (SUP) |
| Curva de aprendizaje del equipo | Se asume competencia (SUP-08) | Se asume competencia (SUP-08) |

> **Nota:** Si la institución tiene restricción técnica que obligue PHP, la arquitectura se mantiene idéntica; solo cambia el framework de backend (Laravel/Slim en lugar de Express). El diseño desacoplado permite esta sustitución.

### 3.6. Stack Tecnológico — Persistencia Local

> **Aclaración fundamental:** La base de datos local del SECCAP es **necesaria y mínima**. Su propósito es almacenar exclusivamente los datos operativos del sistema (usuarios, roles, permisos, auditoría, sesiones, configuración, caché de catálogos). **No replica ni almacena datos de personal** procedentes de la API institucional. Los datos de personal se consultan en tiempo real y no se persisten localmente.

| Componente | Tecnología | Justificación |
|---|---|---|
| RDBMS | **PostgreSQL** 16.x | Robusto, open-source, mejor manejo de JSON nativo (útil para almacenar filtros_json en auditoría), soporte de permisos granulares a nivel BD |
| Alternativa | MySQL 8.x | Si la infraestructura institucional lo requiere; funcionalmente equivalente para este alcance |

**Esquema lógico de tablas previsto:**

| Tabla | Propósito | Operaciones |
|---|---|---|
| `usuarios` | Usuarios internos del sistema | CRUD (soft delete) |
| `roles` | Definición de roles | CRUD |
| `permisos` | Permisos granulares | CRUD |
| `usuario_rol` | Relación N:N usuarios ↔ roles | INSERT/DELETE |
| `rol_permiso` | Relación N:N roles ↔ permisos | INSERT/DELETE |
| `auditoria` | Log inmutable de operaciones | **Solo INSERT** (RN-28) |
| `configuracion` | Parámetros del sistema | READ/UPDATE |
| `catalogo_cache` | Caché de catálogos de la API | INSERT/UPDATE/READ |
| `sesiones` | Sesiones activas (si no es JWT puro) | CRUD |

### 3.7. Seguridad

| Capa | Medida | Implementación |
|---|---|---|
| Transporte | HTTPS obligatorio | TLS 1.2+ en producción |
| Autenticación | JWT con expiración + refresh token | Middleware de Express |
| Autorización | RBAC basado en tabla de permisos | Middleware por ruta |
| Entrada | Validación + sanitización de todos los inputs | Zod/Joi en backend; validación HTML5 + Zod en frontend |
| Respuesta | Filtrado de campos por rol antes de enviar al frontend | ControladorConsulta (C-03) |
| Errores | Sin exposición de datos técnicos | ControladorErrores (C-07) |
| CORS | Whitelist de orígenes permitidos | Middleware Express |
| Rate limiting | Límite de requests por IP/usuario | express-rate-limit |
| Headers | Cabeceras de seguridad (CSP, X-Frame-Options, etc.) | Helmet middleware |
| BD | Consultas parametrizadas (ORM); contraseñas con bcrypt | Prisma/Knex + bcrypt |
| Auditoría | Tabla inmutable (sin UPDATE/DELETE a nivel SQL) | Permisos de BD + lógica de aplicación |

### 3.8. Despliegue Preliminar

| Ambiente | Propósito | Componentes |
|---|---|---|
| **Desarrollo** | Desarrollo local del equipo | Frontend (Vite dev server), Backend (Node.js local), PostgreSQL local, Mock de API |
| **Staging/Testing** | Pruebas integradas con API real (o sandbox) | Frontend + Backend desplegados en servidor de pruebas; BD de testing; acceso a API de staging (si existe) |
| **Producción** | Operación real del sistema | Frontend servido por Nginx/caddy; Backend en Node.js (PM2 o Docker); PostgreSQL en servidor institucional; Acceso a API de producción |

**Estrategia de despliegue recomendada:**
- Contenedores Docker para backend y BD (facilita reproducibilidad).
- Frontend como archivos estáticos servidos por servidor web (Nginx).
- Variables de entorno para toda configuración sensible (tokens, URIs de API, credenciales de BD).
- CI/CD básico vía GitHub Actions o equivalente institucional.
- **Despliegue inicial en entorno institucional de pruebas**, con pase a producción sujeto a validación y aprobación del Área de Informática.

---

## 4. Tablas y Matrices

### 4.1. Matriz de Componente → Objetivo

| Componente | Objetivos que Soporta |
|---|---|
| Frontend React/TS | OE-03 (Interfaz moderna) |
| Backend Express/TS | OE-01 (Proxy), OE-02 (RBAC), OE-06 (Errores) |
| Capa de Integración | OE-01 (Integración API) |
| PostgreSQL local | OE-04 (Auditoría), OE-05 (Persistencia mínima) |
| Seguridad transversal | OE-02 (RBAC), RNF-01..RNF-07 |
| Documentación | OE-07 |

### 4.2. Alternativas Consideradas y Descartadas

| Alternativa | Razón de Descarte |
|---|---|
| PHP/Laravel como backend | Stack no unificado; mayor complejidad para equipo reducido. Se mantiene como fallback si la institución lo exige |
| Replicación completa de datos en BD local | Viola REST-04 y el principio de mínimo privilegio; innecesario dado que la API provee consulta en tiempo real. La BD local del SECCAP es exclusivamente operativa |
| GraphQL en lugar de REST | Complejidad adicional no justificada para un sistema de consulta con flujo predecible |
| MongoDB como BD local | No aporta ventaja sobre PostgreSQL para el modelo relacional requerido (usuarios, roles, auditoría) |
| Server-Side Rendering (SSR) | No se justifica; la aplicación es de uso interno con usuarios autenticados, no requiere SEO |

---

## 5. Observaciones

1. **Stack unificado TypeScript:** La decisión de usar TypeScript tanto en frontend como en backend reduce la fricción de desarrollo, permite compartir tipos/DTOs y simplifica la curva de aprendizaje para un equipo reducido.

2. **PostgreSQL sobre MySQL:** La elección se fundamenta en el mejor soporte nativo de JSON (para `filtros_json` en auditoría) y permisos más granulares. Sin embargo, MySQL es una alternativa viable si la infraestructura lo requiere.

3. **La arquitectura es sustituible en backend:** El diseño desacoplado (interfaz de adaptador, controladores independientes) permite migrar de Node.js a PHP sin afectar frontend ni modelo de datos. Esto mitiga el riesgo de VAC-06.

4. **Docker es recomendado pero no obligatorio:** Si la infraestructura institucional no soporta contenedores, el despliegue tradicional (PM2 + Nginx) es igualmente viable.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F10-01 | Confirmar si la infraestructura institucional soporta Node.js y/o Docker | Director de Proyecto + Área de Informática | **Crítica** |
| PEN-F10-02 | Obtener acceso a ambiente de staging/sandbox de la API (VAC-08) | Director de Proyecto | Alta |
| PEN-F10-03 | Definir el mecanismo de autenticación ante la API (VAC-03) | Equipo + Área de Informática | Alta |
| PEN-F10-04 | Evaluar si se requiere proxy reverso (Nginx) o si el backend sirve también los estáticos | Equipo | Baja |

---

## 7. Entregable Generado

**"Arquitectura Candidata y Stack Tecnológico"** — Documento `10_arquitectura_tecnologias.md`

Contenido:
- ✅ Estilo arquitectónico definido y justificado
- ✅ Diagrama de componentes (textual)
- ✅ Flujo general de una consulta (13 pasos)
- ✅ Stack frontend completo con justificación
- ✅ Stack backend con decisión y comparativa Node.js vs PHP
- ✅ Estrategia de persistencia local (PostgreSQL)
- ✅ Medidas de seguridad por capa
- ✅ Plan de despliegue por ambiente
- ✅ Alternativas descartadas con justificación

---

## 8. Próxima Fase Recomendada

**FASE 11 — Viabilidad**

Se evaluará la factibilidad técnica, económica, operativa, legal y medioambiental del proyecto.

> **Precondición:** Arquitectura definida. Para la viabilidad técnica se requiere conocer el stack propuesto (ya definido).

---

# Archivo fuente: 11_viabilidad.md

# FASE 11 — VIABILIDAD
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Estudio de Viabilidad del Anteproyecto**

## 2. Objetivo
Evaluar la factibilidad del proyecto en cinco dimensiones: técnica, económica, operativa, legal y medioambiental. Cada punto cierra con una conclusión: viable, viable con restricciones, o no viable.

---

## 3. Desarrollo

### 3.1. Viabilidad Técnica

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Existencia de la API** | ✅ Confirmada | La API institucional de solo lectura existe y es la fuente de datos. El sistema se diseña para consumirla |
| **Stack frontend (React/TS/Vite)** | ✅ Maduro y disponible | Tecnologías open-source, ampliamente documentadas, sin restricciones de licencia |
| **Stack backend (Node.js/Express/TS)** | ✅ Maduro y disponible | Tecnología estable, ecosistema npm robusto, soporte LTS |
| **PostgreSQL** | ✅ Disponible | Open-source, instalable en infraestructura institucional estándar |
| **Competencias del equipo** | ⚠️ Supuesto (SUP-08) | Se asume competencia en React y Node.js. Si no la hay, se requiere capacitación que impacta el cronograma |
| **Acceso a la API para desarrollo** | ⚠️ Pendiente (VAC-08) | No se ha confirmado si existe ambiente de staging/sandbox. Sin acceso de prueba, el desarrollo de integración se bloquea |
| **Infraestructura de despliegue** | ⚠️ Pendiente (SUP-06) | Se asume que la institución puede hostear una aplicación web con Node.js + PostgreSQL. Requiere confirmación |
| **Complejidad del sistema** | ✅ Abordable | 44 RF, 30 RNF, 15 CU — volumen manejable para un equipo reducido en ~14 semanas con enfoque iterativo |

**Conclusión: VIABLE CON RESTRICCIONES**
El proyecto es técnicamente factible con las tecnologías propuestas. Las restricciones dependen de la confirmación de acceso a la API en entorno de desarrollo (VAC-08) y de la disponibilidad de infraestructura de despliegue institucional (SUP-06). Si alguna de estas condiciones no se cumple, se deberán implementar planes de contingencia (mock de API para desarrollo; despliegue alternativo).

### 3.2. Viabilidad Económica

| Concepto | Costo Estimado | Observación |
|---|---|---|
| **Licencias de software** | $0 | Todo el stack es open-source (React, Node.js, PostgreSQL, Vite, Tailwind) |
| **Infraestructura de servidores** | PENDIENTE | Depende de si se usa infraestructura existente (costo $0 incremental) o se requiere nuevo hardware/VPS |
| **Recursos humanos** | $0 (recurso institucional) | El desarrollo lo realiza el alumno como parte del proyecto. No hay contratación externa |
| **Capacitación** | $0 / mínimo | Se asume competencia previa. Si se requiere, se estima en horas de autoformación |
| **Mantenimiento post-implantación** | PENDIENTE | Depende de si la institución asigna personal para soporte o si queda como responsabilidad del área de informática |
| **Certificados SSL** | $0 / mínimo | Let's Encrypt gratuito, o certificado institucional existente |
| **Dominio** | $0 | Se utilizaría subdominio institucional existente |

**Conclusión: VIABLE**
El costo directo del proyecto es mínimo al utilizar stack 100% open-source y recursos institucionales. Los costos de infraestructura dependen de la disponibilidad institucional. No se identifican barreras económicas significativas.

> **Nota:** Las estimaciones detalladas de horas y costos se desarrollarán en la FASE 13 (Recursos y Presupuesto). Los valores aquí presentados son de alto nivel.

### 3.3. Viabilidad Operativa

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Necesidad organizacional** | ✅ Confirmada | El problema está documentado y validado. Existe demanda real de una herramienta de consulta |
| **Disponibilidad del cliente** | ⚠️ Supuesto (SUP-04) | Se asume participación activa en validaciones. Si no se cumple, los ciclos iterativos se retrasan |
| **Resistencia al cambio** | ⚠️ Riesgo bajo-medio | Los usuarios actuales realizan consultas manuales. La herramienta simplifica su trabajo, pero requiere capacitación básica |
| **Capacitación de usuarios** | ✅ Factible | La interfaz se diseñará con principios de usabilidad. La capacitación requerida es básica |
| **Integración con procesos existentes** | ✅ No disruptiva | El sistema no reemplaza procesos existentes ni modifica datos; solo agrega un canal de consulta controlado |
| **Sostenibilidad post-proyecto** | ⚠️ Pendiente | Se requiere que la institución designe un responsable de operación y soporte post-implantación |

**Conclusión: VIABLE CON RESTRICCIONES**
El proyecto es operativamente factible. Las restricciones se centran en la participación activa del cliente durante el desarrollo (SUP-04) y en la definición de un plan de sostenibilidad post-implantación.

### 3.4. Viabilidad Legal

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Protección de datos personales** | ⚠️ Requiere cumplimiento | Le aplica la Ley 25.326 (Protección de Datos Personales). El sistema no almacena datos de personal, pero los consulta y visualiza. Se implementa RBAC, auditoría y mínimo privilegio |
| **Normativa interna de Defensa** | ⚠️ Pendiente (VAC-05) | No se ha relevado formalmente qué normativas específicas de seguridad de la información aplican. Se requiere validación con el Área de Seguridad |
| **Licencias de software** | ✅ Sin restricción | Todo el stack es open-source con licencias permisivas (MIT, Apache 2.0, ISC) |
| **Acceso autorizado a la API** | ✅ Mandato institucional | El acceso a la API es autorizado por el Área de Personal como parte del proyecto |
| **No replicación de datos sensibles** | ✅ Por diseño | El sistema no almacena datos de personal localmente (REST-04). Esto mitiga riesgos legales de custodia de datos |

**Conclusión: VIABLE CON RESTRICCIONES**
Es viable legalmente siempre que se cumplan las normativas de protección de datos y se obtenga la validación del Área de Seguridad de la Información respecto a la normativa interna (VAC-05).

### 3.5. Viabilidad Medioambiental

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Consumo energético** | ✅ Mínimo | El sistema es una aplicación web que no requiere hardware adicional significativo. Se ejecuta sobre infraestructura existente |
| **Residuos electrónicos** | ✅ Nulo | No se adquiere hardware nuevo específico para el proyecto |
| **Reducción de papel** | ✅ Positivo | La digitalización de consultas reduce potencialmente la impresión de documentación en papel |
| **Huella de carbono** | ✅ Despreciable | El incremento de consumo energético por un servidor web adicional es insignificante |

**Conclusión: VIABLE**
No se identifican impactos medioambientales negativos. El proyecto contribuye marginalmente a la reducción de papel.

---

## 4. Tablas y Matrices

### 4.1. Resumen de Viabilidad

| Dimensión | Conclusión | Condiciones/Restricciones |
|---|---|---|
| Técnica | **Viable con restricciones** | Requiere confirmar acceso a API de staging y disponibilidad de infraestructura de despliegue |
| Económica | **Viable** | Costo mínimo (open-source + recursos institucionales). Infraestructura pendiente pero de bajo costo |
| Operativa | **Viable con restricciones** | Requiere participación activa del cliente y plan de sostenibilidad post-proyecto |
| Legal | **Viable con restricciones** | Requiere validación de normativa interna de seguridad (VAC-05) |
| Medioambiental | **Viable** | Sin impacto negativo |

---

## 5. Observaciones

1. **Ninguna dimensión resultó "No viable"**, lo cual confirma que el proyecto puede continuar con confianza razonable.

2. Las **restricciones** identificadas son gestionables y ya están registradas como pendientes y riesgos en fases anteriores. No representan barreras insalvables sino condiciones a verificar.

3. La viabilidad económica es particularmente favorable por el uso de stack 100% open-source y la disponibilidad de recursos institucionales.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F11-01 | Confirmar compatibilidad de infraestructura institucional con Node.js/Docker | Director de Proyecto + Área de Informática | Crítica |
| PEN-F11-02 | Relevar normativa interna de seguridad de la información aplicable (VAC-05) | Director de Proyecto | Alta |
| PEN-F11-03 | Definir plan de sostenibilidad/transferencia post-implantación | Director de Proyecto + Cliente | Media |

---

## 7. Entregable Generado

**"Estudio de Viabilidad del Anteproyecto"** — Documento `11_viabilidad.md`

Contenido:
- ✅ 5 dimensiones de viabilidad evaluadas
- ✅ Conclusión por dimensión con justificación
- ✅ Tabla resumen consolidada
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 12 — Planificación y Cronograma**

Se construirá la EDT/WBS de baja granularidad, se definirán fases, tareas principales, hitos, dependencias y un cronograma preliminar con enfoque iterativo e incremental.

> **Precondición:** Arquitectura y viabilidad definidas. No existen dependencias bloqueantes.

---

# Archivo fuente: 12_planificacion_cronograma.md

# FASE 12 — PLANIFICACIÓN Y CRONOGRAMA
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Plan de Trabajo y Cronograma Preliminar**

## 2. Objetivo
Construir una planificación de alto nivel con EDT/WBS, fases, tareas principales, hitos, dependencias y cronograma preliminar, adoptando un enfoque iterativo e incremental.

---

## 3. Desarrollo

### 3.1. Enfoque de Ciclo de Vida

Se adopta un **ciclo de vida iterativo e incremental** con 6 fases secuenciales. Cada fase produce entregables verificables y permite retroalimentación antes de avanzar a la siguiente. Dentro de las fases de desarrollo (3 y 4), se contempla la posibilidad de ciclos iterativos internos.

**Justificación:** Los requerimientos no están completamente cerrados (REST-05), existe dependencia de una API externa con contrato no formalizado (VAC-02), y se requiere validación temprana con el cliente (SUP-04).

### 3.2. EDT / WBS de Baja Granularidad

```
1. PROYECTO: SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal
│
├── 1.1 FASE 1 — Planificación y Documentación
│   ├── 1.1.1 Elaboración del anteproyecto
│   ├── 1.1.2 Definición de requisitos funcionales y no funcionales
│   ├── 1.1.3 Casos de uso y reglas de negocio
│   ├── 1.1.4 Modelo de análisis preliminar
│   ├── 1.1.5 Arquitectura candidata
│   ├── 1.1.6 Plan de riesgos
│   ├── 1.1.7 Plan de calidad y pruebas (preliminar)
│   └── 1.1.8 Aprobación de documentación base
│
├── 1.2 FASE 2 — Infraestructura Base
│   ├── 1.2.1 Configuración del repositorio y CI/CD básico
│   ├── 1.2.2 Setup de proyecto frontend (React/Vite/TS/Tailwind)
│   ├── 1.2.3 Setup de proyecto backend (Node.js/Express/TS)
│   ├── 1.2.4 Setup de base de datos local (PostgreSQL)
│   ├── 1.2.5 Migraciones iniciales (usuarios, roles, auditoría)
│   ├── 1.2.6 Prueba de concepto (PoC) de conexión a la API
│   └── 1.2.7 Validación de la infraestructura base
│
├── 1.3 FASE 3 — Backend Proxy
│   ├── 1.3.1 Módulo de autenticación y sesión (JWT)
│   ├── 1.3.2 Módulo RBAC (roles, permisos, middleware)
│   ├── 1.3.3 Capa de integración con API (AdaptadorAPI)
│   ├── 1.3.4 Módulo de consulta (validación, sanitización, ejecución)
│   ├── 1.3.5 Módulo de auditoría (registro automático)
│   ├── 1.3.6 Módulo de catálogos (obtención, caché)
│   ├── 1.3.7 Manejo de errores de integración
│   ├── 1.3.8 Módulo de administración (CRUD usuarios/roles)
│   └── 1.3.9 Pruebas unitarias y de integración del backend
│
├── 1.4 FASE 4 — Frontend Funcional
│   ├── 1.4.1 Pantalla de login
│   ├── 1.4.2 Dashboard principal
│   ├── 1.4.3 Módulo de consulta con filtros jerárquicos
│   ├── 1.4.4 Visualización de resultados (tabla paginada)
│   ├── 1.4.5 Vista de detalle de registro
│   ├── 1.4.6 Módulo de auditoría (interfaz de consulta de logs)
│   ├── 1.4.7 Módulo de administración (interfaz)
│   ├── 1.4.8 Manejo de errores en la UI
│   ├── 1.4.9 Integración frontend ↔ backend
│   └── 1.4.10 Pruebas funcionales del frontend
│
├── 1.5 FASE 5 — Calidad y Seguridad
│   ├── 1.5.1 Pruebas de control de acceso (RBAC)
│   ├── 1.5.2 Pruebas de integración con API real
│   ├── 1.5.3 Revisión de seguridad (OWASP checklist)
│   ├── 1.5.4 Pruebas de rendimiento básicas
│   ├── 1.5.5 Pruebas de aceptación del usuario (UAT)
│   ├── 1.5.6 Corrección de defectos encontrados
│   └── 1.5.7 Documentación del plan de pruebas ejecutado
│
└── 1.6 FASE 6 — Implantación y Cierre
    ├── 1.6.1 Preparación del ambiente de producción
    ├── 1.6.2 Despliegue del sistema
    ├── 1.6.3 Capacitación de usuarios
    ├── 1.6.4 Manual de usuario y operación
    ├── 1.6.5 Período de soporte inicial
    ├── 1.6.6 Informe de cierre y lecciones aprendidas
    └── 1.6.7 Entrega formal y acta de aceptación
```

### 3.3. Cronograma Preliminar (~14 semanas)

El cronograma corresponde al **proyecto integral SECCAP**. El inicio formal del desarrollo se produce en el marco de la Práctica Profesional Supervisada, que constituye el hito de arranque académico e institucional.

| Fase | Semanas | Duración | Hito de Cierre | Dependencia |
|---|---|---|---|---|
| **FASE 1** — Planificación y Documentación | S1 – S2 | 2 semanas | **H1:** Documentación base aprobada | — |
| **FASE 2** — Infraestructura Base | S3 – S5 | 3 semanas | **H2:** PoC de conexión a API exitosa | H1 |
| **FASE 3** — Backend Proxy | S6 – S7 | 2 semanas | **H3:** Backend funcional con pruebas | H2 |
| **FASE 4** — Frontend Funcional | S8 – S10 | 3 semanas | **H4:** Frontend integrado y funcional | H3 |
| **FASE 5** — Calidad y Seguridad | S11 – S12 | 2 semanas | **H5:** Sistema validado (UAT + seguridad) | H4 |
| **FASE 6** — Implantación y Cierre | S13 – S14 | 2 semanas | **H6:** Sistema en producción + acta de cierre | H5 |

### 3.4. Diagrama de Gantt (Textual)

```
Semana:  S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12 S13 S14
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
FASE 1   ████████│                                              │
FASE 2           ████████████│                                  │
FASE 3                       ████████│                          │
FASE 4                               ████████████│              │
FASE 5                                           ████████│      │
FASE 6                                                   ████████
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Hitos:   │   H1  │       H2  │   H3  │       H4  │   H5  │  H6│
```

### 3.5. Hitos del Proyecto

| ID | Hito | Fecha Estimada | Criterio de Verificación |
|---|---|---|---|
| H1 | Documentación base aprobada | Fin S2 | Anteproyecto, requisitos, CU, arquitectura aprobados |
| H2 | PoC de conexión a API exitosa | Fin S5 | Backend invoca la API y obtiene respuesta; infraestructura operativa |
| H3 | Backend funcional con pruebas | Fin S7 | Todos los módulos del backend implementados y con pruebas unitarias |
| H4 | Frontend integrado y funcional | Fin S10 | Frontend conectado al backend; flujo completo de consulta operativo |
| H5 | Sistema validado | Fin S12 | UAT completado; revisión de seguridad aprobada; defectos críticos resueltos |
| H6 | Sistema en producción | Fin S14 | Sistema desplegado; capacitación realizada; acta de cierre firmada |

### 3.6. Dependencias Críticas

| Dependencia | Origen | Impacto si se retrasa |
|---|---|---|
| Acceso a la API de staging (VAC-08) | FASE 2 (PoC) | Bloquea H2 y todo el desarrollo de integración |
| Definición de autenticación ante API (VAC-03) | FASE 3 (Backend) | Bloquea el módulo de integración |
| Participación del cliente en validaciones (SUP-04) | FASE 1, 5 | Retrasa aprobación y UAT |
| Disponibilidad de infraestructura de producción (SUP-06) | FASE 6 | Bloquea el despliegue final |

---

## 4. Tablas y Matrices

### 4.1. Distribución de Esfuerzo por Fase (Estimación)

| Fase | % del Esfuerzo Total | Justificación |
|---|---|---|
| Planificación | ~15% | Documentación formal extensa por naturaleza académica |
| Infraestructura | ~15% | Setup + PoC de API (riesgo clave) |
| Backend | ~25% | Módulo más crítico: integración, RBAC, auditoría |
| Frontend | ~25% | Interfaz con filtros complejos e integración con backend |
| Calidad | ~10% | Pruebas, revisión de seguridad, UAT |
| Implantación | ~10% | Despliegue, capacitación, cierre |

---

## 5. Observaciones

1. **Cronograma intencionalmente holgado en FASE 2 (3 semanas):** La PoC de conexión a la API es el punto de mayor incertidumbre técnica. Si se resuelve rápido, el tiempo sobrante se reasigna a FASE 3.

2. **Superposición posible:** Las fases 3 y 4 podrían solaparse parcialmente (iniciar pantallas de login y dashboard mientras se termina el backend de autenticación). Esto se gestionará según avance real.

3. **El cronograma es preliminar:** Se ajustará al inicio de cada fase según el avance real y los pendientes resueltos.

4. **Buffer implícito:** Los tiempos estimados incluyen un margen implícito para iteraciones de corrección dentro de cada fase.

5. **Priorización ante restricciones de tiempo:** Si al llegar a la semana 12 el núcleo funcional (autenticación + RBAC + consulta + auditoría + documentación) está completo pero quedan funcionalidades complementarias pendientes, se prioriza el cierre formal del proyecto y las funcionalidades restantes se documentan como alcance futuro.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F12-01 | Definir fecha real de inicio de la PPS para anclar el cronograma | Director de Proyecto | Alta |
| PEN-F12-02 | Confirmar disponibilidad de API para la PoC (semana 3-5) | Director de Proyecto + Área de Informática | Crítica |
| PEN-F12-03 | Definir las fechas de revisión con el tutor académico | Director de Proyecto | Media |

---

## 7. Entregable Generado

**"Plan de Trabajo y Cronograma Preliminar"** — Documento `12_planificacion_cronograma.md`

Contenido:
- ✅ EDT/WBS de baja granularidad (6 fases, ~40 tareas)
- ✅ Cronograma de 14 semanas con distribución por fase
- ✅ 6 hitos con criterio de verificación
- ✅ Dependencias críticas identificadas
- ✅ Distribución estimada de esfuerzo
- ✅ Diagrama de Gantt textual

---

## 8. Próxima Fase Recomendada

**FASE 13 — Recursos y Presupuesto**

Se identificarán los recursos humanos, tecnológicos y de infraestructura necesarios, y se estimará el presupuesto preliminar del proyecto.

> **Precondición:** Cronograma definido. No existen dependencias bloqueantes.

---

# Archivo fuente: 13_recursos_presupuesto.md

# FASE 13 — RECURSOS Y PRESUPUESTO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Estimación de Recursos y Presupuesto Preliminar**

## 2. Objetivo
Identificar y clasificar los recursos humanos, tecnológicos, de software, hardware y servicios necesarios para ejecutar el proyecto, y construir una estimación de costos de alto nivel con sus supuestos asociados.

---

## 3. Desarrollo

### 3.1. Recursos Humanos

El proyecto se inicia formalmente en el marco de una **Práctica Profesional Supervisada (PPS)** de 5to año de Ingeniería, lo que establece el contexto académico de arranque e impone restricciones sobre la estructura del equipo.

| ID | Rol | Responsable | Dedicación Estimada | Fase(s) Principal(es) |
|----|-----|-------------|---------------------|-----------------------|
| RH-01 | Desarrollador Full-Stack / Autor PPS | Alumno (1 persona) | 15–20 hs/semana × 14 semanas | Todas (1–6) |
| RH-02 | Director de PPS / Tutor Académico | Docente designado | 2–3 hs/semana (revisión y guía) | Todas (supervisión) |
| RH-03 | Referente Institucional / Cliente | Personal de la institución | 1–2 hs/semana (validación) | 1, 4, 5, 6 |
| RH-04 | Administrador de Infraestructura | Personal TI de la institución | Puntual (accesos, staging) | 2, 6 |
| RH-05 | Usuarios de Prueba (UAT) | Consultores designados | 3–5 sesiones de 1 hora | 5 |

**Nota:** El alumno (RH-01) cumple simultáneamente los roles de analista, arquitecto, desarrollador frontend, desarrollador backend, tester y documentador. Esta concentración de responsabilidades es una restricción inherente al contexto del proyecto (REST-05).

**Esfuerzo total estimado del alumno:**

- **Esfuerzo estimado:** 14 semanas × 17.5 hs/semana (promedio) ≈ **245 horas-persona**
- Distribución según FASE 12: Planificación 15% (~37 hs), Infraestructura 15% (~37 hs), Backend 25% (~61 hs), Frontend 25% (~61 hs), QA 10% (~24 hs), Implantación 10% (~24 hs)

### 3.2. Recursos de Software

Todos los componentes de software seleccionados son **open-source o de uso gratuito**, alineado con la restricción presupuestaria del proyecto (SUP-06).

| ID | Software | Versión | Propósito | Licencia | Costo |
|----|----------|---------|-----------|----------|-------|
| RS-01 | Node.js | 22 LTS | Runtime backend | MIT | $0 |
| RS-02 | Express | 5.x | Framework HTTP backend | MIT | $0 |
| RS-03 | TypeScript | 5.x | Lenguaje (front y back) | Apache 2.0 | $0 |
| RS-04 | React | 19.x | Biblioteca UI frontend | MIT | $0 |
| RS-05 | Vite | 6.x | Build tool frontend | MIT | $0 |
| RS-06 | Tailwind CSS | 4.x | Framework CSS utilitario | MIT | $0 |
| RS-07 | PostgreSQL | 16.x | Base de datos local | PostgreSQL License | $0 |
| RS-08 | Prisma / Knex | Última estable | ORM / Query builder | MIT / Apache 2.0 | $0 |
| RS-09 | VS Code | Última estable | IDE de desarrollo | MIT | $0 |
| RS-10 | Git | Última estable | Control de versiones | GPL v2 | $0 |
| RS-11 | GitHub | N/A | Repositorio remoto + CI | Free tier | $0 |
| RS-12 | Vitest / Jest | Última estable | Framework de testing | MIT | $0 |
| RS-13 | Docker | Última estable | Contenedorización (staging) | Apache 2.0 | $0 |
| RS-14 | Postman / Insomnia | Última estable | Testing de API | Free tier | $0 |
| RS-15 | Winston / Pino | Última estable | Logging estructurado | MIT | $0 |

### 3.3. Recursos de Hardware

| ID | Recurso | Especificación Mínima | Propósito | Proveedor |
|----|---------|----------------------|-----------|-----------|
| RW-01 | Equipo de desarrollo (PC/Laptop) | CPU 4 cores, 8 GB RAM, 256 GB SSD, SO Windows/Linux/macOS | Desarrollo, testing local, documentación | Alumno (propio) |
| RW-02 | Servidor de staging / pre-producción | CPU 2 cores, 4 GB RAM, 40 GB SSD, Linux | Despliegue de pruebas, acceso a API staging | Institución (PENDIENTE: VAC-08) |
| RW-03 | Servidor de producción | CPU 2–4 cores, 4–8 GB RAM, 80 GB SSD, Linux | Despliegue final del sistema | Institución (PENDIENTE: VAC-08) |
| RW-04 | Conexión de red | Acceso a red institucional con salida a API | Comunicación con API de RRHH | Institución |

**Observación:** El hardware de desarrollo (RW-01) ya existe y no genera costo adicional. Los servidores (RW-02, RW-03) dependen de la infraestructura institucional existente y no se contempla adquisición de nuevos equipos (SUP-06). Si la institución no dispone de servidores, la alternativa es un VPS básico de bajo costo (ver alternativas en §3.6).

### 3.4. Recursos de Servicios

| ID | Servicio | Propósito | Modalidad | Costo Estimado |
|----|----------|-----------|-----------|----------------|
| SV-01 | Acceso a API institucional de RRHH | Fuente de datos de personal (Read-Only) | Interno institucional | $0 (interno) |
| SV-02 | Hosting GitHub (plan gratuito) | Repositorio, CI/CD básico (GitHub Actions) | SaaS — Free tier | $0 |
| SV-03 | Conexión a Internet | Desarrollo remoto, sincronización | ISP existente del alumno | $0 (existente) |
| SV-04 | Certificado TLS/SSL | HTTPS para staging y producción | Let's Encrypt | $0 |
| SV-05 | DNS (subdominio institucional) | Resolución de nombre para la aplicación | Institucional | $0 (interno) |

### 3.5. Estimación de Costos de Alto Nivel

Dado la política de open-source y los recursos institucionales disponibles, el costo monetario directo es **prácticamente nulo**. El principal costo es el **esfuerzo humano** del alumno.

#### 3.5.1. Tabla de Costos Directos

| Categoría | Ítem | Cantidad | Costo Unitario | Costo Total |
|-----------|------|----------|----------------|-------------|
| Recursos Humanos | Alumno (RH-01) | ~245 hs estimadas | $0 (no remunerado) | $0 |
| Recursos Humanos | Director PPS (RH-02) | ~35 hs | $0 (función docente) | $0 |
| Recursos Humanos | Referente institucional (RH-03) | ~20 hs | $0 (función laboral) | $0 |
| Software | Stack completo (RS-01..RS-15) | 15 componentes | $0 (open-source) | $0 |
| Hardware | PC del alumno (RW-01) | 1 | $0 (existente) | $0 |
| Hardware | Servidor staging (RW-02) | 1 | $0 (institucional) | $0 |
| Hardware | Servidor producción (RW-03) | 1 | $0 (institucional) | $0 |
| Servicios | GitHub, Let's Encrypt, DNS | 3 | $0 | $0 |
| **TOTAL DIRECTO** | | | | **$0** |

#### 3.5.2. Costos Contingentes (Escenario Alternativo)

Si la institución **no provee infraestructura de servidores**, se contempla:

| Ítem | Alternativa | Costo Mensual | Duración | Costo Total |
|------|-------------|---------------|----------|-------------|
| VPS básico (staging + prod) | DigitalOcean/Vultr 2 vCPU, 4 GB | ~USD 24 | 4 meses | ~USD 96 |
| Dominio propio (si no hay institucional) | Registrador genérico | ~USD 12/año | 1 año | ~USD 12 |
| **TOTAL CONTINGENTE** | | | | **~USD 108** |

**Decisión:** Se asume que la institución provee servidores (SUP-06). Los costos contingentes se activan solo si se materializa el vacío VAC-08.

#### 3.5.3. Costo de Oportunidad

Aunque el proyecto tiene costo monetario $0, el **costo de oportunidad** del alumno se estima como referencia:

- 245 horas × tarifa de referencia para desarrollador junior en Argentina (~USD 10–15/hora) ≈ **USD 2.450–3.675**
- Este valor se presenta solo como referencia para dimensionar el esfuerzo, no como costo real del proyecto.

### 3.6. Supuestos Presupuestarios

| ID | Supuesto | Impacto si Falso |
|----|----------|------------------|
| SP-01 | La PPS no es remunerada; el esfuerzo del alumno no genera costo monetario | Se debería contemplar compensación |
| SP-02 | El software open-source seleccionado se mantiene gratuito durante el proyecto | Buscar alternativas equivalentes gratuitas |
| SP-03 | La institución provee servidores para staging y producción (SUP-06, VAC-08) | Activar presupuesto contingente (~USD 108) |
| SP-04 | GitHub Free tier es suficiente para CI/CD y almacenamiento | Evaluar GitHub Pro (~USD 4/mes) o GitLab |
| SP-05 | No se requiere licenciamiento especial para consumir la API institucional | Negociar con la institución |
| SP-06 | El equipo de desarrollo del alumno cumple las especificaciones mínimas | El alumno debería actualizar su equipo (costo personal) |

---

## 4. Tablas y Matrices

### 4.1. Matriz Recurso → Fase de Uso

| Recurso | F1-Plan | F2-Infra | F3-Back | F4-Front | F5-QA | F6-Impl |
|---------|---------|----------|---------|----------|-------|---------|
| RH-01 Alumno | ● | ● | ● | ● | ● | ● |
| RH-02 Director | ● | ○ | ○ | ○ | ● | ● |
| RH-03 Referente | ● | — | — | ● | ● | ● |
| RH-04 Admin TI | — | ● | — | — | — | ● |
| RH-05 Usuarios UAT | — | — | — | — | ● | — |
| RS-01..06 Stack Front | — | ● | — | ● | ● | ● |
| RS-01..03,08 Stack Back | — | ● | ● | — | ● | ● |
| RS-07 PostgreSQL | — | ● | ● | — | ● | ● |
| RS-09..11 Herramientas | ● | ● | ● | ● | ● | ● |
| RW-01 PC Alumno | ● | ● | ● | ● | ● | ● |
| RW-02 Srv Staging | — | ● | — | — | ● | — |
| RW-03 Srv Producción | — | — | — | — | — | ● |

> ● = Uso principal | ○ = Uso secundario/revisión | — = No aplica

### 4.2. Trazabilidad Recursos → Restricciones y Vacíos

| Recurso | Restricción / Vacío Relacionado |
|---------|--------------------------------|
| RH-01 (rol múltiple) | REST-05 (requerimientos no cerrados), REST-07 (dependencia del alumno) |
| RW-02, RW-03 (servidores) | VAC-08 (entorno staging), SUP-06 (infraestructura institucional) |
| SV-01 (acceso API) | REST-01 (Read-Only), VAC-02 (contrato API), VAC-03 (mecanismo auth API) |
| RS-01..RS-08 (stack) | DEC-04 (stack frontend), DEC-05 (stack backend decidido en FASE 10) |

---

## 5. Observaciones

1. **Costo cero no significa riesgo cero:** La gratuidad del stack y la infraestructura depende de supuestos institucionales (SP-03, SP-05) que deben validarse tempranamente en FASE 2.
2. **El recurso más crítico es el tiempo del alumno** (RH-01): es el único recurso no sustituible y no escalable. Cualquier retraso en dependencias externas (acceso a API, staging) consume directamente este recurso finito.
3. **No se contempla contratación de servicios externos** ni adquisición de licencias comerciales, coherente con las restricciones del proyecto.
4. **La concentración de roles en RH-01** es el principal factor de riesgo de recursos; se mitiga con planificación realista (FASE 12) y priorización MoSCoW de los requisitos.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F13-01 | Confirmar disponibilidad de servidores staging y producción | RH-04, VAC-08 | Alta |
| PEN-F13-02 | Validar que GitHub Free tier soporta el flujo CI/CD requerido | RH-01 | Media |
| PEN-F13-03 | Confirmar acceso a red institucional para desarrollo remoto | RH-03, RH-04 | Alta |
| PEN-F13-04 | Determinar si se requiere presupuesto contingente para VPS | PEN-F13-01 | Media |
| PEN-F13-05 | Verificar especificaciones del equipo de desarrollo del alumno | RH-01 | Baja |

---

## 7. Entregable de la Fase
- **Inventario completo de recursos** clasificados por categoría (humanos, software, hardware, servicios)
- **Estimación de costos** con escenario base ($0) y contingente (~USD 108)
- **Matriz de asignación recurso-fase** y trazabilidad con restricciones/vacíos
- **Lista de supuestos presupuestarios** (SP-01..SP-06)

---

## 8. Conexión con la Siguiente Fase
La identificación de recursos y sus dependencias alimenta directamente la **FASE 14 — Riesgos y Suposiciones**, donde se formalizarán los riesgos asociados a la disponibilidad de recursos (especialmente RW-02/RW-03 y SV-01), la concentración de roles en RH-01, y la materialización de los supuestos presupuestarios.

---

# Archivo fuente: 14_riesgos_suposiciones.md

# FASE 14 — RIESGOS Y SUPOSICIONES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Análisis de Riesgos y Formalización de Suposiciones**

## 2. Objetivo
Identificar, clasificar y evaluar los riesgos del proyecto, definir estrategias de respuesta con responsables asignados, y consolidar todas las suposiciones formuladas a lo largo de las fases anteriores, evaluando su probabilidad de fallo y su impacto.

---

## 3. Desarrollo

### 3.1. Metodología de Evaluación de Riesgos

Se utiliza una **matriz Probabilidad × Impacto** con escalas cualitativas:

**Probabilidad:**
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Muy Baja | 1 | < 10% de ocurrencia |
| Baja | 2 | 10–30% |
| Media | 3 | 30–50% |
| Alta | 4 | 50–70% |
| Muy Alta | 5 | > 70% |

**Impacto:**
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Muy Bajo | 1 | Ajuste menor, sin afectar alcance ni cronograma |
| Bajo | 2 | Retraso ≤ 1 semana o degradación menor |
| Medio | 3 | Retraso 1–2 semanas o reducción parcial de funcionalidad |
| Alto | 4 | Retraso > 2 semanas o funcionalidad crítica afectada |
| Muy Alto | 5 | Proyecto inviable o entregable inaceptable |

**Exposición al riesgo** = Probabilidad × Impacto

| Exposición | Rango | Acción |
|------------|-------|--------|
| Crítica | 15–25 | Plan de respuesta obligatorio e inmediato |
| Alta | 10–14 | Plan de respuesta obligatorio |
| Media | 5–9 | Monitorear activamente, plan de contingencia |
| Baja | 1–4 | Aceptar y monitorear |

### 3.2. Registro de Riesgos

#### R-01 — Dependencia total de la API institucional
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Integración |
| **Descripción** | El sistema depende al 100% de la disponibilidad y correcto funcionamiento de la API institucional de RRHH. Si la API no está disponible, no se pueden realizar consultas. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 5 (Muy Alto) |
| **Exposición** | **15 — Crítica** |
| **Restricciones relacionadas** | REST-01, REST-02 |
| **Vacíos relacionados** | VAC-02 (contrato), VAC-03 (auth), VAC-08 (staging) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Solicitar documentación de API en FASE 2. (2) Implementar mock server para desarrollo sin API real. (3) Diseñar capa de integración con timeout, circuit breaker y fallback a caché. (4) Incluir pantalla de estado de conexión (B-08). |
| **Responsable** | RH-01 (mitigación técnica), RH-03 (gestión de acceso) |
| **Indicador de activación** | No se obtiene acceso a API antes de S4 |

#### R-02 — Cambios en el contrato de la API
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Integración |
| **Descripción** | La API institucional podría cambiar su estructura de datos, endpoints o mecanismo de autenticación sin previo aviso, rompiendo la integración. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **12 — Alta** |
| **Restricciones relacionadas** | REST-01, REST-02 |
| **Vacíos relacionados** | VAC-02 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Implementar patrón Anti-Corruption Layer (I-01) para aislar cambios. (2) Centralizar mapeo API→dominio en MapperRespuestaAPI (I-03). (3) Versionado de DTOs de respuesta. (4) Tests de contrato automatizados. |
| **Responsable** | RH-01 |
| **Indicador de activación** | Respuesta de API difiere del mapeo esperado |

#### R-03 — Permisos insuficientes sobre datos de personal
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Acceso |
| **Descripción** | La institución podría restringir el acceso a ciertos campos o registros de la API, impidiendo implementar filtros planificados. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Restricciones relacionadas** | REST-03, REST-04 |
| **Vacíos relacionados** | VAC-04 (granularidad de permisos) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Solicitar catálogo completo de campos accesibles en FASE 2. (2) Diseño modular de filtros: si un campo no está disponible, el filtro se deshabilita sin romper la UI. (3) Documentar campos ausentes como limitación. |
| **Responsable** | RH-01, RH-03 |
| **Indicador de activación** | PoC revela campos inaccesibles |

#### R-04 — Datos incompletos o inconsistentes en la fuente
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Calidad de Datos |
| **Descripción** | Los datos devueltos por la API podrían tener campos nulos, formatos inconsistentes o registros duplicados, afectando la calidad de las consultas. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Vacíos relacionados** | VAC-09 (calidad de datos) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Validación y sanitización en la capa de integración (C-03, I-01). (2) Manejo de nulos con valores por defecto o indicador visual "Sin dato". (3) Logging de anomalías para cuantificar el problema. (4) No filtrar por campos con alta tasa de nulos. |
| **Responsable** | RH-01 |
| **Indicador de activación** | > 10% de registros con campos críticos nulos en PoC |

#### R-05 — Vulnerabilidades de seguridad
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Seguridad |
| **Descripción** | El sistema podría presentar vulnerabilidades (XSS, CSRF, inyección, exposición de datos sensibles) que comprometan información de personal militar. |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 5 (Muy Alto) |
| **Exposición** | **10 — Alta** |
| **Restricciones relacionadas** | REST-03, REST-04 |
| **Requisitos relacionados** | RNF-01..RNF-07 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Aplicar OWASP Top 10 como checklist obligatorio. (2) Implementar Helmet, CORS restrictivo, rate limiting, CSP. (3) Sanitizar toda entrada con Zod/Joi. (4) Auditoría de dependencias con `npm audit`. (5) Revisión de seguridad en FASE 5. |
| **Responsable** | RH-01, RH-02 (revisión) |
| **Indicador de activación** | `npm audit` con vulnerabilidades high/critical |

#### R-06 — Retraso por requisitos no cerrados
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Alcance |
| **Descripción** | Los requerimientos no están completamente cerrados (REST-05). Cambios de alcance durante el desarrollo podrían retrasar el cronograma de 14 semanas. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Restricciones relacionadas** | REST-05 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Priorización MoSCoW de requisitos; implementar primero los esenciales. (2) Congelar alcance del ciclo actual antes de FASE 3. (3) Cambios posteriores se evalúan con control de cambios (FASE 16). (4) Buffer de 1 semana contemplado en cronograma FASE 12. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Solicitud de cambio que afecta > 3 requisitos esenciales después de S4 |

#### R-07 — Incompatibilidad tecnológica con infraestructura institucional
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Infraestructura |
| **Descripción** | La infraestructura institucional podría no soportar Node.js, PostgreSQL o las versiones requeridas, impidiendo el despliegue. |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **8 — Media** |
| **Vacíos relacionados** | VAC-08 |
| **Supuestos relacionados** | SUP-06 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Validar stack con Admin TI (RH-04) en FASE 2. (2) Preparar despliegue con Docker como alternativa portable. (3) Mantener Express como backend por su bajo acoplamiento al runtime. (4) Como último recurso, considerar VPS externo (costo contingente FASE 13). |
| **Responsable** | RH-01, RH-04 |
| **Indicador de activación** | RH-04 informa restricciones de stack en S3 |

#### R-08 — Ausencia de documentación fuente de los catálogos
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Información |
| **Descripción** | No existe documentación formal de los catálogos de aptitudes, cursos y formaciones, dificultando la implementación de filtros jerárquicos. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Vacíos relacionados** | VAC-01 (catálogo formación civil), VAC-07 (catálogos estructurados) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Extraer catálogos del análisis de Contexto.md como base inicial. (2) Validar con RH-03 la completitud. (3) Diseñar catálogos como entidad administrable (E-07, CU-13). (4) Aceptar catálogos parciales en primera iteración. |
| **Responsable** | RH-01, RH-03 |
| **Indicador de activación** | RH-03 no puede validar > 50% de los catálogos propuestos antes de S5 |

#### R-09 — Sobrecarga del alumno por concentración de roles
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Recursos Humanos |
| **Descripción** | El alumno cumple todos los roles técnicos simultáneamente (RH-01). Enfermedad, compromisos académicos paralelos o burnout podrían detener el proyecto. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **12 — Alta** |
| **Recursos relacionados** | RH-01, SP-01 |
| **Estrategia** | Mitigar + Aceptar |
| **Plan de respuesta** | (1) Planificación realista con buffer (FASE 12). (2) Priorización MoSCoW para asegurar MVP ante reducción de disponibilidad. (3) Commits frecuentes para evitar pérdida de trabajo. (4) Comunicación temprana con RH-02 ante bloqueos. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Desvío > 1 semana respecto al cronograma |

#### R-10 — Falta de participación del cliente/referente
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Comunicación |
| **Descripción** | El referente institucional (RH-03) podría no estar disponible para validaciones, bloqueando decisiones de alcance, priorización y UAT. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Supuestos relacionados** | SUP-04 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Establecer canal de comunicación formal desde FASE 1. (2) Definir ventanas de validación obligatorias alineadas con hitos (H1, H4, H5, H6). (3) Si no hay respuesta en 5 días, escalar a RH-02. (4) Documentar decisiones no validadas como SUPUESTO. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Sin respuesta de RH-03 en 5 días hábiles |

#### R-11 — Desalineación de expectativas sobre el alcance entregable
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Alcance |
| **Descripción** | Los stakeholders podrían generar expectativas sobre funcionalidades complementarias (exportación avanzada, administración extendida, integraciones adicionales) que exceden el núcleo funcional priorizado, provocando desalineación entre lo esperado y lo entregado. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Mantener el alcance funcional documentado y priorizado según FASE 3. (2) Validar expectativas con el referente institucional en cada hito. (3) Documentar funcionalidades diferidas como trabajo futuro. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Solicitud de funcionalidades no priorizadas como núcleo funcional |

### 3.3. Mapa de Calor de Riesgos

```
                        IMPACTO
              1       2       3       4       5
         ┌───────┬───────┬───────┬───────┬───────┐
    5    │       │       │       │       │       │
         ├───────┼───────┼───────┼───────┼───────┤
P   4    │       │       │ R-04  │       │       │
R        │       │       │ R-06  │       │       │
O        │       │       │ R-08  │       │       │
B   ├───────┼───────┼───────┼───────┼───────┤
A   3    │       │       │ R-03  │ R-09  │ R-01  │
B        │       │       │ R-10  │       │       │
.   ├───────┼───────┼───────┼───────┼───────┤
    2    │       │       │       │ R-07  │ R-05  │
         ├───────┼───────┼───────┼───────┼───────┤
    1    │       │       │       │       │       │
         └───────┴───────┴───────┴───────┴───────┘
```

**Distribución:** 1 riesgo crítico (R-01), 6 riesgos altos (R-02, R-04, R-05, R-06, R-08, R-09), 4 riesgos medios (R-03, R-07, R-10, R-11), 0 riesgos bajos.

### 3.4. Consolidación de Suposiciones

A lo largo de las fases 0–13 se han formulado las siguientes suposiciones. Se presenta su estado actual y probabilidad de fallo:

| ID | Suposición | Origen | Prob. Fallo | Impacto si Falsa | Estado |
|----|------------|--------|-------------|-------------------|--------|
| SUP-01 | La API institucional sigue el patrón REST y devuelve JSON | F0 | Baja | Rediseño de capa de integración | PENDIENTE validación en PoC |
| SUP-02 | Los catálogos de aptitudes son relativamente estables | F0 | Media | Frecuencia alta de actualización de caché | PENDIENTE validación con RH-03 |
| SUP-03 | Los datos de personal incluyen los campos necesarios para los filtros diseñados | F0 | Media | Reducción del alcance de filtros | PENDIENTE validación con API |
| SUP-04 | El referente institucional participa activamente en validaciones | F0 | Media | Decisiones sin validar; riesgo de retrabajo | PENDIENTE (depende de RH-03) |
| SUP-05 | Se puede implementar RBAC con los roles identificados sin cambios organizacionales | F0 | Baja | Ajuste del modelo de roles | PENDIENTE validación en F1 |
| SUP-06 | La institución provee infraestructura para staging y producción | F0 | Media | Activar presupuesto contingente (FASE 13) | PENDIENTE (depende de VAC-08) |
| SUP-07 | El alcance del sistema se limita a consulta Read-Only (sin ABM de personal) | F0 | Muy Baja | Cambio mayor de arquitectura; fuera de alcance del proyecto | VIGENTE — confirmado por restricciones |
| SUP-08 | 14 semanas son suficientes para entregar el MVP con los requisitos esenciales | F0 | Media | Reducción de funcionalidad al MVP mínimo | VIGENTE — soportado por cronograma F12 |
| SP-01 | La PPS no es remunerada | F13 | Muy Baja | Contemplar compensación | VIGENTE |
| SP-02 | Software open-source se mantiene gratuito durante el proyecto | F13 | Muy Baja | Buscar alternativas | VIGENTE |
| SP-03 | La institución provee servidores (= SUP-06) | F13 | Media | Activar contingente ~USD 108 | PENDIENTE |
| SP-04 | GitHub Free tier es suficiente para CI/CD | F13 | Baja | Evaluar GitHub Pro | VIGENTE |
| SP-05 | No se requiere licenciamiento para consumir la API | F13 | Baja | Negociar con la institución | PENDIENTE |
| SP-06 | El equipo del alumno cumple especificaciones mínimas | F13 | Muy Baja | Actualización de equipo | VIGENTE |

### 3.5. Plan de Monitoreo de Riesgos

| Frecuencia | Actividad | Responsable |
|------------|-----------|-------------|
| Semanal | Revisión de estado de riesgos activos en reunión con tutor | RH-01, RH-02 |
| Por hito | Reevaluación de probabilidad e impacto de cada riesgo | RH-01 |
| Ante evento | Activación del plan de respuesta correspondiente; registro en bitácora | RH-01 |
| Fin de fase | Actualización del registro de riesgos y suposiciones | RH-01 |

---

## 4. Tablas y Matrices

### 4.1. Resumen Ejecutivo de Riesgos (Ordenado por Exposición)

| ID | Riesgo | Prob | Imp | Exp | Estrategia |
|----|--------|------|-----|-----|------------|
| R-01 | Dependencia total de la API | 3 | 5 | **15** | Mitigar |
| R-02 | Cambios en contrato API | 3 | 4 | **12** | Mitigar |
| R-04 | Datos incompletos/inconsistentes | 4 | 3 | **12** | Mitigar |
| R-06 | Retraso por requisitos no cerrados | 4 | 3 | **12** | Mitigar |
| R-08 | Sin documentación de catálogos | 4 | 3 | **12** | Mitigar |
| R-09 | Sobrecarga del alumno | 3 | 4 | **12** | Mitigar + Aceptar |
| R-05 | Vulnerabilidades de seguridad | 2 | 5 | **10** | Mitigar |
| R-03 | Permisos insuficientes sobre datos | 3 | 3 | **9** | Mitigar |
| R-10 | Falta de participación del cliente | 3 | 3 | **9** | Mitigar |
| R-07 | Incompatibilidad con infra institucional | 2 | 4 | **8** | Mitigar |

### 4.2. Trazabilidad Riesgos → Fases del Proyecto Afectadas

| Riesgo | F1 | F2 | F3 | F4 | F5 | F6 |
|--------|----|----|----|----|----|----|
| R-01 | — | ● | ● | ● | ● | ● |
| R-02 | — | — | ● | — | ● | ● |
| R-03 | ● | ● | ● | ● | — | — |
| R-04 | — | — | ● | ● | ● | — |
| R-05 | — | — | ● | ● | ● | ● |
| R-06 | ● | — | ● | ● | — | — |
| R-07 | — | ● | — | — | — | ● |
| R-08 | ● | — | ● | ● | — | — |
| R-09 | ● | ● | ● | ● | ● | ● |
| R-10 | ● | — | — | ● | ● | ● |

---

## 5. Observaciones

1. **El riesgo R-01 (dependencia de API) es el único con exposición crítica** y condiciona la viabilidad operativa del sistema. Su mitigación es prioritaria y debe validarse en la PoC (S4–S5).
2. **6 de 10 riesgos tienen exposición alta (12)**, lo cual es esperable en un proyecto con alta dependencia externa y equipo unipersonal.
3. **No se identificaron riesgos de exposición baja**, lo que refleja un proyecto con un perfil de riesgo medio-alto, coherente con la evaluación de viabilidad (FASE 11).
4. **Las suposiciones SUP-01, SUP-03 y SUP-06 son las más críticas** y deben validarse en las primeras semanas del proyecto (FASE 2).

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F14-01 | Validar SUP-01 y SUP-03 con PoC de conexión a API | FASE 2, RH-04, VAC-02 | Crítica |
| PEN-F14-02 | Confirmar SUP-06 (infraestructura institucional) | RH-04, VAC-08 | Alta |
| PEN-F14-03 | Establecer canal de comunicación formal con RH-03 | RH-01, RH-02 | Alta |
| PEN-F14-04 | Ejecutar `npm audit` en cada fase de desarrollo | RH-01 | Media |
| PEN-F14-05 | Definir criterio MoSCoW formal para requisitos RF-01..44 | RH-01, RH-03 | Alta |

---

## 7. Entregable de la Fase
- **Registro de riesgos** con 10 riesgos evaluados (R-01..R-10), cada uno con plan de respuesta, responsable e indicador de activación
- **Mapa de calor** de riesgos (Probabilidad × Impacto)
- **Consolidación de 14 suposiciones** (SUP-01..08 + SP-01..06) con estado y probabilidad de fallo
- **Trazabilidad** riesgos → fases afectadas
- **Plan de monitoreo** periódico

---

## 8. Conexión con la Siguiente Fase
Los riesgos y suposiciones alimentan la definición de **métricas de éxito** (FASE 15), particularmente las métricas de rendimiento (vinculadas a R-01, R-04), seguridad (R-05) y adopción (R-10). También proveen los criterios de aceptación para las pruebas de la FASE 5 del proyecto.

---

# Archivo fuente: 15_metricas_exito.md

# FASE 15 — MÉTRICAS DE ÉXITO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Definición de Métricas de éxito y Criterios de Aceptación**

## 2. Objetivo
Definir indicadores cuantitativos y cualitativos que permitan evaluar objetivamente el éxito del proyecto en las dimensiones funcional, de calidad, de rendimiento, de adopción y de auditoría, estableciendo umbrales de aceptación y métodos de medición.

---

## 3. Desarrollo

### 3.1. Criterio General de Éxito

El proyecto se considera **exitoso** si cumple las siguientes condiciones mínimas:
1. Se entrega un sistema funcional que permite consultas Read-Only sobre datos de personal a través de filtros jerárquicos.
2. El sistema implementa RBAC y auditoría completa.
3. Se entrega la documentación formal requerida por la PPS.
4. El sistema pasa las pruebas de aceptación del referente institucional (RH-03).

### 3.1.1. Priorización de Métricas

Las métricas que siguen aplican al proyecto integral SECCAP. Las métricas del núcleo funcional (identificadas como **críticas**) son las que determinan la aceptación mínima del sistema.

### 3.2. Métricas Funcionales

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Requisitos Vinculados |
|----|---------|-------------|------------------|--------------------|-----------------------|
| MF-01 | Cobertura de requisitos esenciales | % de RF esenciales implementados y verificados | ≥ 90% (33/37 RF esenciales) | Matriz de trazabilidad RF → tests | RF-01..RF-44 (esenciales) |
| MF-02 | Cobertura de filtros funcionales | Cantidad de filtros jerárquicos operativos sobre el total diseñado | ≥ 80% de filtros del módulo MOD-03 | Inventario de filtros activos vs. diseñados | RF-09..RF-20, RN-01..RN-07 |
| MF-03 | Casos de uso implementados | Cantidad de CU completamente implementados / total | ≥ 12/15 CU (80%) | Demo funcional contra CU-01..CU-15 | CU-01..CU-15 |
| MF-04 | Módulos operativos | Cantidad de módulos funcionales desplegados | ≥ 7/9 módulos (MOD-01..MOD-09) | Verificación de endpoints y pantallas | MOD-01..MOD-09 |
| MF-05 | Reglas de negocio implementadas | % de RN implementadas y verificadas | ≥ 85% (26/30 RN) | Tests unitarios/integración por RN | RN-01..RN-30 |

### 3.3. Métricas de Calidad de Software

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MC-01 | Cobertura de tests unitarios | % de código cubierto por tests en backend | ≥ 70% | Reporte de coverage (Vitest/Jest) | RNF-13 |
| MC-02 | Cobertura de tests de integración | Cantidad de flujos críticos con test de integración | ≥ 5 flujos (login, consulta, filtro, auditoría, error) | Conteo de tests de integración | RNF-13 |
| MC-03 | Defectos críticos en producción | Cantidad de bugs bloqueantes post-despliegue | 0 críticos, ≤ 3 mayores | Registro de incidentes | RNF-11 |
| MC-04 | Deuda técnica | Code smells + duplicaciones detectadas | ≤ 5% de duplicación; 0 critical smells | Análisis estático (ESLint, SonarQube si disponible) | RNF-15, RNF-16 |
| MC-05 | Compilación sin errores | Build exitoso de front y back en CI | 100% builds verdes en rama principal | GitHub Actions log | RNF-14 |
| MC-06 | Tipos estrictos | Compilación TypeScript en modo strict sin errores | 0 errores de tipo en `tsc --noEmit` | CI pipeline | RNF-14 |

### 3.4. Métricas de Rendimiento

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MR-01 | Tiempo de respuesta de consulta | Tiempo desde envío de consulta hasta visualización de resultados | ≤ 3 segundos (p95) sin contar latencia de API externa | Medición en logs del backend (timestamp request→response) | RNF-08 |
| MR-02 | Tiempo de carga inicial (frontend) | Time to Interactive (TTI) del SPA | ≤ 4 segundos en conexión 4G estándar | Lighthouse / DevTools | RNF-09 |
| MR-03 | Tiempo de carga de catálogos | Tiempo de obtención de catálogos desde caché o API | ≤ 1 segundo desde caché; ≤ 5 segundos desde API | Logs del módulo de catálogos | RNF-08, RN-25 |
| MR-04 | Disponibilidad del sistema | % de uptime durante periodo de evaluación | ≥ 95% (excluye caídas de API externa) | Logs de health check / monitoreo | RNF-10, RNF-11 |
| MR-05 | Concurrencia soportada | Usuarios simultáneos sin degradación | ≥ 10 usuarios concurrentes | Test de carga básico (Artillery/k6) | RNF-08 |

### 3.5. Métricas de Seguridad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MS-01 | Vulnerabilidades conocidas en dependencias | Cantidad de vulnerabilidades high/critical en `npm audit` | 0 high, 0 critical | `npm audit` en CI | RNF-01 |
| MS-02 | OWASP Top 10 compliance | Cantidad de categorías OWASP verificadas | 10/10 categorías revisadas | Checklist manual + herramientas | RNF-01..RNF-07 |
| MS-03 | Protección de datos sensibles | Ningún dato sensible expuesto en logs, respuestas de error o frontend | 0 exposiciones detectadas | Revisión de código + tests de penetración básicos | RNF-02, RNF-03 |
| MS-04 | Autenticación robusta | Intentos de acceso no autorizado bloqueados | 100% bloqueados en tests | Tests de autenticación (token inválido, expirado, sin permisos) | RNF-04, RN-11..RN-15 |
| MS-05 | Auditoría completa | % de operaciones de consulta con registro de auditoría | 100% | Comparación logs API vs registros auditoría | RNF-06, RN-27..RN-30 |

### 3.6. Métricas de Adopción y Usabilidad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Vinculación |
|----|---------|-------------|------------------|--------------------|-------------|
| MA-01 | Satisfacción del cliente (UAT) | Evaluación del referente institucional sobre el sistema | ≥ 7/10 en encuesta de satisfacción | Cuestionario post-UAT a RH-03 y RH-05 | CU-01..CU-15 |
| MA-02 | Tasa de completitud de tareas | % de usuarios de prueba que completan una consulta sin ayuda | ≥ 80% | Observación durante sesiones UAT | RNF-20..RNF-23 |
| MA-03 | Errores de usuario | Cantidad promedio de errores por tarea durante UAT | ≤ 2 errores por tarea | Registro durante sesiones UAT | RNF-20 |
| MA-04 | Tiempo para primera consulta exitosa | Tiempo desde login hasta obtener resultados (usuario nuevo) | ≤ 5 minutos | Medición en sesión UAT | RNF-21 |
| MA-05 | Accesibilidad básica | Navegabilidad completa por teclado; contraste adecuado | WCAG 2.1 nivel A en vistas principales | Lighthouse Accessibility / axe | RNF-23 |

### 3.7. Métricas de Auditoría y Trazabilidad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Vinculación |
|----|---------|-------------|------------------|--------------------|-------------|
| MT-01 | Completitud del registro de auditoría | % de acciones auditables registradas vs. ejecutadas | 100% | Comparación de logs de aplicación vs. tabla auditoría | RNF-06, RN-27 |
| MT-02 | Inmutabilidad de registros | Registros de auditoría no modificables post-creación | 0 modificaciones detectadas | Intento de UPDATE/DELETE en tabla auditoría (debe fallar) | RN-28 |
| MT-03 | Datos mínimos por registro | Cada registro contiene: usuario, rol, acción, timestamp, IP, filtros, resultado | 100% de registros con todos los campos | Query de validación contra esquema | RF-31..RF-34 |
| MT-04 | Consulta de auditoría funcional | El módulo de auditoría permite buscar y exportar registros | Funcional al 100% | Test funcional de CU-10, CU-11 | CU-10, CU-11 |

### 3.8. Métricas de Gestión del Proyecto

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición |
|----|---------|-------------|------------------|--------------------|
| MG-01 | Cumplimiento del cronograma | Desviación respecto al plan de 14 semanas | ≤ 2 semanas de desvío | Comparación fechas reales vs. planificadas |
| MG-02 | Documentación entregada | Cantidad de documentos PMBOK completos / 12 | 12/12 documentos | Inventario de DOCUMENTOS/ |
| MG-03 | Hitos alcanzados | Cantidad de hitos cumplidos / 6 (H1..H6) | ≥ 5/6 hitos | Registro de hitos |
| MG-04 | Riesgos materializados gestionados | % de riesgos materializados con plan de respuesta ejecutado | 100% | Registro de riesgos actualizado |

---

## 4. Tablas y Matrices

### 4.1. Resumen de Métricas por Categoría

| Categoría | Cantidad | IDs |
|-----------|----------|-----|
| Funcionales | 5 | MF-01..MF-05 |
| Calidad de Software | 6 | MC-01..MC-06 |
| Rendimiento | 5 | MR-01..MR-05 |
| Seguridad | 5 | MS-01..MS-05 |
| Adopción y Usabilidad | 5 | MA-01..MA-05 |
| Auditoría | 4 | MT-01..MT-04 |
| Gestión | 4 | MG-01..MG-04 |
| **TOTAL** | **34** | |

### 4.2. Trazabilidad Métricas → Objetivos Específicos

| Métrica(s) | OE vinculado |
|------------|-------------|
| MF-01, MF-04, MR-01, MS-04 | OE-01 (Capa proxy segura) |
| MS-02, MS-04, MT-01 | OE-02 (RBAC) |
| MF-02, MA-01, MA-02, MA-04 | OE-03 (UI moderna con filtros jerárquicos) |
| MT-01..MT-04, MS-05 | OE-04 (Módulo de auditoría) |
| MC-01..MC-06 | OE-05 (Persistencia local mínima) |
| MR-01, MR-04, MC-03 | OE-06 (Manejo de errores) |
| MG-02, MG-03 | OE-07 (Documentación) |

### 4.3. Criterio de Aceptación Global

**Aceptación mínima obligatoria:**
- ✅ MF-01 ≥ 90% (cobertura de requisitos esenciales)
- ✅ MS-04 = 100% (RBAC verificado)
- ✅ MS-05 = 100% (auditoría completa)
- ✅ MT-01 = 100% (registro de auditoría)
- ✅ MA-01 ≥ 7/10 (satisfacción UAT)
- ✅ MG-02 = 12/12 (documentación PMBOK)

**Meta extendida:** Todas las 34 métricas en umbral de éxito.

**Rechazo:**
- ❌ MF-01 < 70% o MS-05 < 90% o cualquier vulnerabilidad critical no resuelta

---

## 5. Observaciones

1. **Las métricas de seguridad y auditoría tienen umbrales absolutos** (100%, 0 vulnerabilidades) dado el contexto militar/defensa del proyecto. No admiten degradación.
2. **Las métricas de rendimiento** excluyen la latencia de la API externa (REST-02), ya que está fuera del control del proyecto. Se mide solo el tiempo agregado por el sistema.
3. **Las métricas de adopción** se evalúan en sesiones UAT controladas con RH-05 (3–5 usuarios de prueba). No se contempla medición en producción real durante el primer tramo de ejecución.
4. **MF-01 tiene un umbral del 90% y no 100%** para acomodar la posibilidad de que algunos requisitos esenciales dependan de información aún no disponible (VAC-01, VAC-02).

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F15-01 | Definir herramienta de análisis estático (SonarQube o alternativa gratuita) | RH-01 | Media |
| PEN-F15-02 | Diseñar cuestionario de satisfacción para UAT (MA-01) | RH-01, RH-02 | Media |
| PEN-F15-03 | Configurar métricas automatizadas en CI (MC-01, MC-05, MC-06, MS-01) | RH-01 | Alta |
| PEN-F15-04 | Definir protocolo de sesiones UAT para métricas MA-02, MA-03, MA-04 | RH-01, RH-03 | Media |
| PEN-F15-05 | Establecer baseline de rendimiento de la API externa para aislar MR-01 | RH-01 | Alta |

---

## 7. Entregable de la Fase
- **34 métricas de éxito** organizadas en 7 categorías, cada una con umbral, método de medición y trazabilidad
- **Criterio de aceptación global** con umbrales obligatorios, deseables y de rechazo
- **Trazabilidad** métricas → objetivos específicos (OE-01..OE-07)

---

## 8. Conexión con la Siguiente Fase
Las métricas definidas proveen los **criterios de verificación** para el **gobierno documental** (FASE 16), permitiendo establecer qué debe medirse, quién lo valida y cómo se documenta la evidencia de cumplimiento en cada revisión del proyecto.

---

# Archivo fuente: 16_gobierno_documental.md

# FASE 16 — GOBIERNO DOCUMENTAL
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Gobierno Documental y Control de Cambios**

## 2. Objetivo
Establecer los criterios de revisión, validación y aprobación de los entregables del proyecto, definir la política de control de cambios, el mecanismo de actualización documental y los responsables de cada instancia de gobierno.

---

## 3. Desarrollo

### 3.1. Estructura Documental del Proyecto

El proyecto produce dos cuerpos documentales diferenciados:

| Cuerpo | Ubicación | Contenido | Formato |
|--------|-----------|-----------|---------|
| **Anteproyecto** | `ANTEPROYECTO/` | 18 fases (FASE 0–17) del documento de análisis y planificación | Markdown (.md) |
| **Documentación PMBOK** | `DOCUMENTOS/` | 12 documentos de gestión formal (01–12) | Markdown (.md) |

Adicionalmente se mantiene:
- `TRAZABILIDAD/` — Registro cronológico de actividades por fase de desarrollo
- `Contexto.md` — Documento fuente con todo el análisis previo y datos de la institución
- Código fuente y configuración en `frontend/`, `backend/` (por crear)

### 3.2. Criterios de Revisión

Cada entregable documental debe evaluarse contra los siguientes criterios antes de considerarse aprobado:

| ID | Criterio | Descripción | Aplica a |
|----|----------|-------------|----------|
| CR-01 | Completitud | Todas las secciones obligatorias están presentes y desarrolladas | Todo documento |
| CR-02 | Consistencia interna | No hay contradicciones dentro del mismo documento | Todo documento |
| CR-03 | Consistencia cruzada | Referencias a IDs de otros documentos son correctas (RF→CU, CU→RN, etc.) | Anteproyecto |
| CR-04 | Trazabilidad | Cada elemento tiene trazabilidad hacia arriba (objetivo/problema) y hacia abajo (implementación/prueba) | Anteproyecto |
| CR-05 | Justificación | Decisiones técnicas están fundamentadas, no arbitrarias | FASE 10, FASE 11 |
| CR-06 | Pendientes explícitos | Los vacíos y pendientes están marcados como PEN/PENDIENTE, no ocultados | Todo documento |
| CR-07 | Formato estándar | Cumple la estructura de 8 secciones definida para el anteproyecto | Anteproyecto |
| CR-08 | Redacción técnica | Lenguaje formal, impersonal, sin ambigüedades ni contenido de relleno | Todo documento |

### 3.3. Responsables de Validación

| Instancia | Responsable | Alcance | Periodicidad |
|-----------|-------------|---------|--------------|
| **Revisión técnica** | RH-01 (Alumno) | Autodetección de inconsistencias, completitud, formato | Continua (al crear/editar) |
| **Revisión académica** | RH-02 (Director PPS) | Calidad académica, rigor metodológico, coherencia general | Por hito (H1, H5, H6) |
| **Validación funcional** | RH-03 (Referente institucional) | Adecuación a necesidades reales, prioridades, catálogos | Por hito (H1, H4, H5) |
| **Aprobación formal** | RH-02 + RH-03 (conjunta) | Aprobación final del entregable antes de pasar a la siguiente fase | Hitos H1 y H6 |

### 3.4. Mecanismo de Aprobación

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   BORRADOR   │────>│ REVISIÓN TÉCNICA  │────>│ REVISIÓN ACADÉM. │────>│   APROBADO   │
│   (RH-01)    │     │    (RH-01)        │     │    (RH-02)       │     │  (RH-02/03)  │
└──────────────┘     └───────┬───────────┘     └────────┬─────────┘     └──────────────┘
                             │                          │
                             │ Observaciones            │ Observaciones
                             ▼                          ▼
                      ┌──────────────┐          ┌──────────────┐
                      │  CORRECCIÓN  │          │  CORRECCIÓN  │
                      │   (RH-01)    │          │   (RH-01)    │
                      └──────────────┘          └──────────────┘
```

**Estados de un documento:**
| Estado | Descripción |
|--------|-------------|
| BORRADOR | En elaboración; puede tener secciones incompletas |
| EN REVISIÓN | Completo; pendiente de revisión por RH-02 o RH-03 |
| OBSERVADO | Revisado con observaciones; requiere correcciones |
| APROBADO | Validado y aprobado; base para trabajo posterior |
| VIGENTE | Aprobado y en uso como referencia oficial |

### 3.5. Política de Control de Cambios

#### 3.5.1. Clasificación de Cambios

| Tipo | Descripción | Ejemplo | Aprobación Requerida |
|------|-------------|---------|---------------------|
| **Menor** | Corrección de errores, formato, redacción sin alterar contenido técnico | Corregir typo, ajustar tabla | RH-01 (auto-aprobado) |
| **Moderado** | Modificación de un elemento existente sin afectar otros documentos | Cambiar prioridad de un RF, ajustar umbral de métrica | RH-01 + RH-02 |
| **Mayor** | Agregado/eliminación de requisitos, cambio de arquitectura, o modificación que impacta múltiples documentos | Nuevo módulo, cambio de stack, novo riesgo crítico | RH-01 + RH-02 + RH-03 |

#### 3.5.2. Procedimiento de Cambio

1. **Solicitud:** RH-01 documenta el cambio propuesto con justificación, elementos afectados y análisis de impacto.
2. **Evaluación de impacto:** Identificar todos los documentos y elementos (RF, RNF, CU, RN, etc.) afectados por el cambio.
3. **Aprobación:** Según clasificación del cambio (ver tabla anterior).
4. **Implementación:** RH-01 aplica el cambio en todos los documentos afectados.
5. **Verificación de consistencia:** Revisar trazabilidad cruzada post-cambio.
6. **Registro:** Documentar el cambio en el registro de cambios (§3.5.3).

#### 3.5.3. Registro de Cambios

Cada documento mantiene implícitamente su historial a través del **control de versiones Git**. Adicionalmente, cambios significativos (moderados y mayores) se registran en el archivo de trazabilidad con:

| Campo | Descripción |
|-------|-------------|
| Fecha | Fecha del cambio |
| Documento(s) afectado(s) | Lista de archivos modificados |
| Tipo de cambio | Menor / Moderado / Mayor |
| Descripción | Qué se cambió y por qué |
| Elementos afectados | IDs de RF, CU, RN, etc. impactados |
| Aprobado por | Quién aprobó el cambio |

### 3.6. Política de Actualización Documental

| Principio | Descripción |
|-----------|-------------|
| **Documento vivo** | Los documentos del anteproyecto se actualizan a medida que se resuelven vacíos y pendientes. |
| **Propagación de cambios** | Un cambio en un documento de nivel superior (ej: objetivo) debe propagarse a todos los documentos derivados. |
| **Marcado de pendientes** | Todo elemento no confirmado se marca como `PENDIENTE` o `SUPUESTO` con su ID correspondiente. |
| **Versionado semántico** | Cambios mayores incrementan versión mayor (v2.0), moderados la menor (v1.1), menores el patch (v1.0.1). Implementado via Git tags. |
| **No eliminación** | Los elementos eliminados se marcan como `ELIMINADO — [motivo]` en lugar de borrarse, para preservar trazabilidad. |

### 3.7. Convenciones de Nombrado

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos de anteproyecto | `XX_nombre_descriptivo.md` | `05_requisitos_funcionales.md` |
| Archivos PMBOK | `XX_nombre.md` | `01_acta_constitucion.md` |
| IDs de elementos | `PREFIJO-NN` | `RF-01`, `RN-15`, `CU-08` |
| Pendientes | `PEN-FXX-NN` | `PEN-F14-01` |
| Branches (desarrollo) | `fase-X/descripcion-corta` | `fase-3/modulo-auth` |
| Commits | `[FASE-X] descripción imperativa` | `[FASE-3] Implementar middleware RBAC` |

### 3.8. Tabla de Prefijos de IDs del Proyecto

| Prefijo | Significado | Rango | Definido en |
|---------|-------------|-------|-------------|
| REST | Restricción | REST-01..07 | FASE 0 |
| VAC | Vacío de información | VAC-01..10 | FASE 0 |
| SUP | Suposición | SUP-01..08 | FASE 0 |
| DEC | Decisión previa | DEC-01..06 | FASE 0 |
| OE | Objetivo específico | OE-01..07 | FASE 2 |
| AF | Alcance funcional | AF-01..10 | FASE 3 |
| FA | Fuera de alcance | FA-01..10 | FASE 3 |
| LIM | Límite | LIM-01..06 | FASE 3 |
| STK | Stakeholder | STK-01..10 | FASE 4 |
| ACT | Actor | ACT-01..05 | FASE 4 |
| MOD | Módulo | MOD-01..09 | FASE 5 |
| RF | Requisito funcional | RF-01..44 | FASE 5 |
| RNF | Requisito no funcional | RNF-01..30 | FASE 6 |
| RN | Regla de negocio | RN-01..30 | FASE 7 |
| CU | Caso de uso | CU-01..15 | FASE 8 |
| B | Clase boundary | B-01..09 | FASE 9 |
| C | Clase control | C-01..08 | FASE 9 |
| E | Clase entity | E-01..09 | FASE 9 |
| I | Clase integración | I-01..03 | FASE 9 |
| H | Hito | H1..H6 | FASE 12 |
| RH | Recurso humano | RH-01..05 | FASE 13 |
| RS | Recurso software | RS-01..15 | FASE 13 |
| RW | Recurso hardware | RW-01..04 | FASE 13 |
| SV | Servicio | SV-01..05 | FASE 13 |
| SP | Supuesto presupuestario | SP-01..06 | FASE 13 |
| R | Riesgo | R-01..11 | FASE 14 |
| MF | Métrica funcional | MF-01..05 | FASE 15 |
| MC | Métrica de calidad | MC-01..06 | FASE 15 |
| MR | Métrica de rendimiento | MR-01..05 | FASE 15 |
| MS | Métrica de seguridad | MS-01..05 | FASE 15 |
| MA | Métrica de adopción | MA-01..05 | FASE 15 |
| MT | Métrica de auditoría | MT-01..04 | FASE 15 |
| MG | Métrica de gestión | MG-01..04 | FASE 15 |
| CR | Criterio de revisión | CR-01..08 | FASE 16 |
| PEN | Pendiente | PEN-FXX-NN | Todas las fases |

---

## 4. Tablas y Matrices

### 4.1. Matriz de Responsabilidad Documental (RACI)

| Documento / Actividad | RH-01 (Alumno) | RH-02 (Director) | RH-03 (Referente) |
|------------------------|:--------------:|:-----------------:|:------------------:|
| Anteproyecto (FASE 0–17) | **R, A** | **C, I** | **C** |
| Documentos PMBOK (01–12) | **R, A** | **C, I** | **I** |
| Código fuente (front/back) | **R, A** | **I** | — |
| Trazabilidad | **R, A** | **I** | — |
| Control de cambios (Menor) | **R, A** | — | — |
| Control de cambios (Moderado) | **R** | **A** | **I** |
| Control de cambios (Mayor) | **R** | **A** | **A** |
| Aprobación final (H1, H6) | **R** | **A** | **A** |

> **R** = Responsable (ejecuta) | **A** = Aprueba | **C** = Consultado | **I** = Informado

### 4.2. Calendario de Revisiones

| Hito | Semana | Documentos a Revisar | Revisor |
|------|--------|---------------------|---------|
| H1 — Documentación aprobada | S2 | Anteproyecto (FASE 0–17), PMBOK (01–09) | RH-02, RH-03 |
| H2 — PoC API validada | S5 | Actualización de FASE 0 (vacíos), FASE 10 (arquitectura) | RH-02 |
| H4 — Frontend integrado | S10 | PMBOK (10_pruebas) actualizado con resultados parciales | RH-02, RH-03 |
| H5 — Sistema validado | S12 | Métricas de éxito (FASE 15) con valores reales, PMBOK (10_pruebas) completo | RH-02, RH-03 |
| H6 — Producción | S14 | Todo el cuerpo documental final; PMBOK (11, 12) | RH-02, RH-03 |

---

## 5. Observaciones

1. **Git es la fuente de verdad** para el historial de cambios. Todo cambio documental se refleja en un commit con mensaje descriptivo.
2. **El gobierno documental es liviano** por diseño: un proyecto PPS con equipo unipersonal no requiere flujos de aprobación pesados. Se prioriza la trazabilidad sobre la burocracia.
3. **Los documentos PMBOK en `DOCUMENTOS/` son la versión formal** que se entrega a la institución educativa. El anteproyecto en `ANTEPROYECTO/` es el documento técnico de respaldo.
4. **La tabla de prefijos (§3.8) es el diccionario maestro del proyecto** y debe mantenerse actualizada ante cualquier nuevo tipo de elemento.
5. **Priorización funcional en la trazabilidad.** Al evaluar o trazar cualquier entregable, distinguir entre elementos del núcleo funcional prioritario y elementos complementarios, reflejando la priorización definida en FASE 3 y FASE 5.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F16-01 | Validar el mecanismo de aprobación con RH-02 | RH-02 | Alta |
| PEN-F16-02 | Definir formato exacto del cuestionario de satisfacción UAT | PEN-F15-02 | Media |
| PEN-F16-03 | Crear template de solicitud de cambio mayor | RH-01 | Baja |
| PEN-F16-04 | Configurar Git tags para versionado semántico de documentos | RH-01 | Media |

---

## 7. Entregable de la Fase
- **8 criterios de revisión** (CR-01..CR-08)
- **Flujo de aprobación** con 5 estados documentales
- **Política de control de cambios** en 3 niveles (menor, moderado, mayor)
- **Matriz RACI** de responsabilidad documental
- **Diccionario maestro de prefijos** con 35+ tipos de IDs
- **Calendario de revisiones** alineado con hitos H1..H6

---

## 8. Conexión con la Siguiente Fase
El gobierno documental cierra el marco normativo del proyecto. La **FASE 17 — Consolidación Final** integrará todos los bloques en un índice general, verificará la consistencia cruzada, consolidará los pendientes abiertos y producirá el documento final del anteproyecto listo para presentación.

---

# Archivo fuente: 17_consolidacion_final.md

# FASE 17 — CONSOLIDACIÓN FINAL
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Consolidación, Verificación de Consistencia y Cierre del Anteproyecto**

## 2. Objetivo
Integrar todas las fases del anteproyecto en una visión unificada, verificar la consistencia cruzada entre todos los elementos, consolidar los pendientes abiertos, y producir el documento final listo para revisión y aprobación formal.

---

## 3. Desarrollo

### 3.1. Índice General del Anteproyecto

| FASE | Título | Archivo | Entregable Principal |
|------|--------|---------|---------------------|
| 0 | Diagnóstico Inicial | `00_diagnostico_inicial.md` | 7 restricciones, 10 vacíos, 8 suposiciones, 6 decisiones |
| 1 | Definición del Problema | `01_definicion_problema.md` | Problema en 6 dimensiones, 7 consecuencias, 7 actores afectados |
| 2 | Objetivos del Proyecto | `02_objetivos.md` | 1 objetivo general + 7 objetivos específicos (OE-01..07) |
| 3 | Alcance y Fuera de Alcance | `03_alcance.md` | 10 AF, 10 FA, 6 límites |
| 4 | Stakeholders y Actores | `04_stakeholders_actores.md` | 10 stakeholders, 5 actores, matriz de permisos |
| 5 | Requisitos Funcionales | `05_requisitos_funcionales.md` | 9 módulos, 44 RF (37 esenciales + 7 deseables) |
| 6 | Requisitos No Funcionales | `06_requisitos_no_funcionales.md` | 30 RNF en 9 categorías (17 esenciales + 13 deseables) |
| 7 | Reglas de Negocio | `07_reglas_negocio.md` | 30 RN en 7 categorías |
| 8 | Casos de Uso | `08_casos_de_uso.md` | 15 CU con relaciones include/extend, 10 especificados |
| 9 | Modelo de Análisis | `09_modelo_analisis.md` | 29 clases BCE (9B + 8C + 9E + 3I) |
| 10 | Arquitectura y Tecnologías | `10_arquitectura_tecnologias.md` | Stack completo, diagrama de componentes, 9 tablas BD |
| 11 | Viabilidad | `11_viabilidad.md` | 5 dimensiones evaluadas, todas viables |
| 12 | Planificación y Cronograma | `12_planificacion_cronograma.md` | EDT/WBS, 14 semanas, 6 hitos, Gantt |
| 13 | Recursos y Presupuesto | `13_recursos_presupuesto.md` | 5 RH, 15 RS, 4 RW, 5 SV, costo $0 + contingente |
| 14 | Riesgos y Suposiciones | `14_riesgos_suposiciones.md` | 11 riesgos (1 crítico, 6 altos, 4 medios), 14 suposiciones |
| 15 | Métricas de Éxito | `15_metricas_exito.md` | 34 métricas en 7 categorías, criterio de aceptación |
| 16 | Gobierno Documental | `16_gobierno_documental.md` | Criterios de revisión, control de cambios, RACI |
| 17 | Consolidación Final | `17_consolidacion_final.md` | Este documento |

### 3.2. Verificación de Consistencia Cruzada

#### 3.2.1. Trazabilidad Vertical (de arriba hacia abajo)

```
PROBLEMA (F1)
  └──> OBJETIVOS (F2): OE-01..07 ← cada OE responde a una dimensión del problema
        └──> ALCANCE (F3): AF-01..10 ← cada AF soporta al menos un OE
              └──> REQUISITOS (F5/F6): RF-01..44, RNF-01..30 ← cada RF pertenece a un módulo que soporta un AF
                    └──> REGLAS (F7): RN-01..30 ← restricciones de negocio sobre los RF
                          └──> CASOS DE USO (F8): CU-01..15 ← realizaciones de los RF
                                └──> CLASES (F9): B/C/E/I ← elementos que participan en los CU
                                      └──> ARQUITECTURA (F10) ← componentes que implementan las clases
                                            └──> MÉTRICAS (F15) ← criterios de verificación
```

**Estado de trazabilidad vertical:** ✅ Completa. Verificada en las matrices de trazabilidad incluidas en cada fase.

#### 3.2.2. Trazabilidad Horizontal (entre elementos del mismo nivel)

| Relación | Estado | Observación |
|----------|--------|-------------|
| RF → CU | ✅ Verificada | 44 RF cubiertos por 15 CU (FASE 8, §3.5) |
| RF → RN | ✅ Verificada | RN restringen RF específicos (FASE 7, §4.1) |
| RF → RNF | ✅ Verificada | RNF aplican transversalmente a todos los RF |
| CU → Clases BCE | ✅ Verificada | Participation matrix en FASE 9 |
| Riesgos → Suposiciones | ✅ Verificada | Mapeo en FASE 14, §3.4 |
| Métricas → RNF | ✅ Verificada | Columna de vinculación en FASE 15 |
| Recursos → Fases | ✅ Verificada | Matriz recurso-fase en FASE 13, §4.1 |

#### 3.2.3. Verificación de Cobertura

| Elemento | Total | Trazado hacia arriba | Trazado hacia abajo | Cobertura |
|----------|-------|---------------------|---------------------|-----------|
| Objetivos (OE) | 7 | → Problema (6 dimensiones) | → Alcance (AF) | 100% |
| Alcance Funcional (AF) | 10 | → OE | → Módulos (MOD) | 100% |
| Requisitos Funcionales (RF) | 44 | → MOD → AF → OE | → CU, RN | 100% |
| Requisitos No Funcionales (RNF) | 30 | → OE | → Métricas (M*) | 100% |
| Reglas de Negocio (RN) | 30 | → RF | → Clases (C) | 100% |
| Casos de Uso (CU) | 15 | → RF | → Clases (B, C, E) | 100% |
| Clases de Análisis | 29 | → CU | → Componentes (F10) | 100% |
| Riesgos (R) | 11 | → REST, VAC, SUP | → Plan de respuesta | 100% |
| Métricas (M*) | 34 | → OE, RNF, RF | → Método de medición | 100% |

### 3.3. Consolidación de Pendientes Abiertos

#### 3.3.1. Pendientes por Fase

| Fase | Cant. | IDs | Prioridad Máxima |
|------|-------|-----|------------------|
| F0 | 8 | PEN-F0-01..08 | Alta |
| F1 | — | (sin pendientes propios) | — |
| F2 | — | (sin pendientes propios) | — |
| F3 | — | (sin pendientes propios) | — |
| F4 | — | (sin pendientes propios) | — |
| F5 | — | (sin pendientes propios) | — |
| F6 | — | (sin pendientes propios) | — |
| F7 | — | (sin pendientes propios) | — |
| F8 | — | (sin pendientes propios) | — |
| F9 | — | (sin pendientes propios) | — |
| F10 | — | (sin pendientes propios) | — |
| F11 | — | (sin pendientes propios) | — |
| F12 | — | (sin pendientes propios) | — |
| F13 | 5 | PEN-F13-01..05 | Alta |
| F14 | 5 | PEN-F14-01..05 | Crítica |
| F15 | 5 | PEN-F15-01..05 | Alta |
| F16 | 4 | PEN-F16-01..04 | Alta |
| **TOTAL** | **27** | | |

#### 3.3.2. Pendientes Críticos (Deben resolverse antes de FASE 2 del desarrollo)

| ID | Descripción | Dependencia Principal | Plazo Sugerido |
|----|-------------|----------------------|----------------|
| PEN-F14-01 | Validar SUP-01 y SUP-03 con PoC de API | VAC-02, RH-04 | S4 (Hito H2) |
| PEN-F14-02 | Confirmar infraestructura institucional (SUP-06) | VAC-08, RH-04 | S3 |
| PEN-F13-01 | Confirmar disponibilidad de servidores staging/prod | VAC-08, RH-04 | S3 |
| PEN-F14-05 | Definir priorización MoSCoW formal de RF-01..44 | RH-01, RH-03 | S2 (Hito H1) |
| PEN-F16-01 | Validar mecanismo de aprobación con RH-02 | RH-02 | S1 |

#### 3.3.3. Vacíos de Información No Resueltos

| ID | Vacío | Estado | Estrategia Actual |
|----|-------|--------|-------------------|
| VAC-01 | Catálogo formal de formación civil | ABIERTO | Usar catálogos de Contexto.md + validar con RH-03 |
| VAC-02 | Contrato/Swagger de la API institucional | **CRÍTICO — ABIERTO** | PoC en FASE 2; mock server como fallback |
| VAC-03 | Mecanismo de autenticación de la API | ABIERTO | Probar token, API key, OAuth en PoC |
| VAC-04 | Granularidad de permisos de consulta | ABIERTO | Descubrir en PoC |
| VAC-05 | Normativa de seguridad institucional | ABIERTO | Solicitar a RH-03/RH-04 |
| VAC-06 | Stack tecnológico del backend | **RESUELTO** | Node.js 22 + Express 5 + TS (FASE 10) |
| VAC-07 | Catálogos estructurados de aptitudes | ABIERTO | Modelar desde Contexto.md; E-07 administrable |
| VAC-08 | Entorno de staging disponible | ABIERTO | Pedir a RH-04; contingente VPS si falla |
| VAC-09 | Calidad de datos en la fuente | ABIERTO | Evaluar en PoC; R-04 con plan de mitigación |
| VAC-10 | Volumen de datos (cantidad de registros) | ABIERTO | Estimar en PoC; impacto en paginación |

**Resueltos:** 1/10 (VAC-06). **Abiertos:** 9/10 (la mayoría se resuelven con la PoC en FASE 2).

### 3.4. Resumen Cuantitativo del Anteproyecto

| Categoría | Cantidad | Detalle |
|-----------|----------|---------|
| Fases del anteproyecto | 18 | FASE 0–17 |
| Restricciones | 7 | REST-01..07 |
| Vacíos de información | 10 | VAC-01..10 (9 abiertos) |
| Suposiciones | 14 | SUP-01..08 + SP-01..06 |
| Decisiones previas | 6 | DEC-01..06 |
| Objetivos específicos | 7 | OE-01..07 |
| Ítems de alcance funcional | 10 | AF-01..10 |
| Exclusiones de alcance | 10 | FA-01..10 |
| Límites | 6 | LIM-01..06 |
| Stakeholders | 10 | STK-01..10 |
| Actores del sistema | 5 | ACT-01..05 |
| Módulos funcionales | 9 | MOD-01..09 |
| Requisitos funcionales | 44 | RF-01..44 (37 esenciales + 7 deseables) |
| Requisitos no funcionales | 30 | RNF-01..30 (17 esenciales + 13 deseables) |
| Reglas de negocio | 30 | RN-01..30 |
| Casos de uso | 15 | CU-01..15 (10 especificados) |
| Clases de análisis | 29 | 9B + 8C + 9E + 3I |
| Tablas de base de datos | 9 | Esquema PostgreSQL (FASE 10) |
| Hitos del proyecto | 6 | H1..H6 |
| Recursos identificados | 29 | 5 RH + 15 RS + 4 RW + 5 SV |
| Riesgos | 11 | R-01..R-11 (1 crítico, 6 altos, 4 medios) |
| Métricas de éxito | 34 | 5 MF + 6 MC + 5 MR + 5 MS + 5 MA + 4 MT + 4 MG |
| Criterios de revisión | 8 | CR-01..CR-08 |
| Prefijos de ID definidos | 35+ | Diccionario completo en FASE 16 |
| Pendientes abiertos | 27 | PEN-F0 a PEN-F16 (5 críticos) |
| **Total de elementos trazados** | **~350+** | |

### 3.5. Conclusiones del Anteproyecto

#### 3.5.0. Encuadre de Ejecución

Este anteproyecto documenta el **proyecto integral SECCAP**. La ejecución formal del proyecto se inicia en el marco de una Práctica Profesional Supervisada (PPS), que constituye el hito de arranque académico e institucional. El núcleo funcional priorizado (autenticación, RBAC, consulta con filtros, auditoría y documentación) define el entregable mínimo aceptable.

1. **El proyecto es técnicamente viable** con la arquitectura candidata prioritaria (React 19 + Node.js 22 + PostgreSQL 16), respaldado por el análisis de FASE 10 y FASE 11.

2. **El riesgo dominante es la dependencia de la API institucional** (R-01, exposición 15 — crítica), que condiciona la viabilidad operativa del sistema. La mitigación principal es la PoC temprana (H2, S5) y el diseño con Anti-Corruption Layer.

3. **El costo monetario directo es $0** bajo el escenario base (PPS con open-source e infraestructura institucional). Existe un contingente de ~USD 108 si la institución no provee servidores.

4. **El cronograma de 14 semanas es ajustado pero factible** si se priorizan los requisitos esenciales (90% de 37 RF) y se resuelven los vacíos críticos (VAC-02, VAC-08) antes de S4.

5. **9 de 10 vacíos de información permanecen abiertos**, pero la mayoría se resolverán orgánicamente durante la PoC (FASE 2 del desarrollo). El diseño modular permite adaptar el sistema sin retrabajo mayor.

6. **La seguridad es un pilar no negociable** dado el contexto militar/defensa. Los umbrales de métricas de seguridad (MS-01..MS-05) son absolutos y no admiten degradación.

7. **El anteproyecto produce una base sólida de ~350+ elementos trazados** que permiten iniciar el desarrollo con confianza metodológica, aun con los vacíos pendientes.

8. **El anteproyecto documenta un proyecto de ingeniería de software completo**, defendible académicamente y técnicamente coherente. Su ejecución formal inicia en el marco de la PPS como hito de arranque institucional.

### 3.6. Elementos que Quedan como Sugerencia de Anexos

Los siguientes elementos podrían desarrollarse como anexos complementarios durante el proyecto, pero no forman parte del cuerpo principal del anteproyecto:

| Anexo Sugerido | Contenido | Fase de Elaboración |
|----------------|-----------|---------------------|
| A — Glosario técnico | Definiciones de términos del dominio militar y técnico | Durante desarrollo |
| B — Mockups de interfaz | Wireframes de las pantallas principales (login, dashboard, consulta, resultados) | FASE 4 (frontend) |
| C — Diagrama de secuencia detallado | Secuencias UML para CU-06 (ejecutar consulta) y CU-01 (login) | FASE 3 (backend) |
| D — Esquema completo de BD | DDL de PostgreSQL con constraints, índices y triggers de auditoría | FASE 2 (infraestructura) |
| E — Catálogos de aptitudes y formaciones | Datos completos extraídos de Contexto.md y validados con RH-03 | FASE 2–3 |
| F — Contrato de API (cuando esté disponible) | Swagger/OpenAPI de la API institucional | Post-PoC |
| G — Manual de usuario preliminar | Guía de uso del sistema para consultores | FASE 6 (implantación) |
| H — Acta de aceptación | Documento formal de aprobación por RH-02 y RH-03 | FASE 6 (cierre) |

---

## 4. Tablas y Matrices

### 4.1. Matriz Global de Trazabilidad — Resumen de Relaciones

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│PROBLEMA │──>│OBJETIVOS│──>│ ALCANCE │──>│REQUISIT.│──>│CASOS USO│
│ (F1)    │   │ (F2)    │   │ (F3)    │   │(F5/F6)  │   │  (F8)   │
│ 6 dim.  │   │ 7 OE    │   │ 10 AF   │   │ 44 RF   │   │ 15 CU   │
└─────────┘   └─────────┘   └─────────┘   │ 30 RNF  │   └────┬────┘
                                           └────┬────┘        │
                                                │              │
                                           ┌────▼────┐   ┌────▼────┐
                                           │ REGLAS  │   │ CLASES  │
                                           │  (F7)   │   │  (F9)   │
                                           │ 30 RN   │   │ 29 BCE  │
                                           └─────────┘   └────┬────┘
                                                               │
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────▼────┐
│MÉTRICAS │<──│ RIESGOS │<──│RECURSOS │<──│CRONOG.  │<──│ARQUITEC.│
│  (F15)  │   │  (F14)  │   │  (F13)  │   │ (F12)   │   │ (F10)   │
│ 34 métr.│   │ 11 R    │   │ 29 rec. │   │ 6 hitos │   │ stack   │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

### 4.2. Estado General del Anteproyecto por Fase

| FASE | Estado | Observación |
|------|--------|-------------|
| F0 | ✅ Completa | 8 pendientes heredados hacia fases de desarrollo |
| F1 | ✅ Completa | — |
| F2 | ✅ Completa | — |
| F3 | ✅ Completa | — |
| F4 | ✅ Completa | — |
| F5 | ✅ Completa | Priorización MoSCoW pendiente (PEN-F14-05) |
| F6 | ✅ Completa | — |
| F7 | ✅ Completa | — |
| F8 | ✅ Completa | 5 CU sin especificación detallada (secundarios) |
| F9 | ✅ Completa | — |
| F10 | ✅ Completa | Actualizar post-PoC si hay cambios |
| F11 | ✅ Completa | — |
| F12 | ✅ Completa | — |
| F13 | ✅ Completa | Depende de validación de infraestructura |
| F14 | ✅ Completa | Reevaluar riesgos post-PoC |
| F15 | ✅ Completa | Umbrales se configuran como baseline en CI |
| F16 | ✅ Completa | Validar flujo con RH-02 |
| F17 | ✅ Completa | Este documento |

---

## 5. Observaciones

1. **Este documento no agrega contenido nuevo**, sino que integra, verifica y consolida todo lo producido en FASE 0–16. Su valor radica en la visión unificada y la verificación de consistencia.
2. **Los 5 pendientes críticos identificados** (§3.3.2) deben abordarse en las primeras 2–4 semanas del proyecto para no bloquear el desarrollo.
3. **El anteproyecto está diseñado para ser un documento vivo**: las fases se actualizarán a medida que se resuelvan vacíos y se validen suposiciones durante el desarrollo.
4. **La trazabilidad es completa al 100%** entre todos los niveles de abstracción, lo que permite rastrear cualquier requisito desde el problema original hasta su métrica de verificación.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F17-01 | Obtener aprobación formal del anteproyecto por RH-02 | Hito H1, S2 | Crítica |
| PEN-F17-02 | Validar prioridades funcionales con RH-03 | PEN-F14-05 | Alta |
| PEN-F17-03 | Iniciar resolución de VAC-02 (contrato API) | RH-03, RH-04 | Crítica |
| PEN-F17-04 | Elaborar anexos sugeridos según necesidad durante desarrollo | RH-01 | Baja |

---

## 7. Entregable de la Fase
- **Índice general** del anteproyecto con 18 fases
- **Verificación de consistencia cruzada** completa (vertical y horizontal)
- **Consolidación de 27 pendientes** abiertos con 5 identificados como críticos
- **Resumen cuantitativo** con ~350+ elementos trazados
- **Conclusiones** del anteproyecto con 7 hallazgos principales
- **Sugerencia de 8 anexos** para desarrollo futuro

---

## 8. Conexión con la Siguiente Fase
Este documento cierra el anteproyecto. La siguiente actividad es la **presentación y aprobación formal** por parte del Director PPS (RH-02) y el Referente Institucional (RH-03) en el **Hito H1 (Semana 2)**. Una vez aprobado, se inicia la **FASE 2 del proyecto — Infraestructura Base**, comenzando por la configuración del repositorio y la PoC de conexión a la API.

---

# Archivo fuente: trazabilidad_anteproyecto.md

# TRAZABILIDAD DEL ANTEPROYECTO

> **Proyecto:** SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal  
> **Documento:** Registro de trazabilidad de la elaboración del anteproyecto  
> **Última actualización:** Abril 2026

---

## 1. Resumen de Elaboración

| FASE | Archivo | Fecha | Elementos Principales Producidos |
|------|---------|-------|----------------------------------|
| 0 | `00_diagnostico_inicial.md` | Abril 2026 | REST-01..07, VAC-01..10, SUP-01..08, DEC-01..06 |
| 1 | `01_definicion_problema.md` | Abril 2026 | Problema 6 dimensiones, 7 consecuencias (CNR-01..07), 7 actores afectados |
| 2 | `02_objetivos.md` | Abril 2026 | OE-01..07, trazabilidad Objetivos→Problema |
| 3 | `03_alcance.md` | Abril 2026 | AF-01..10, FA-01..10, LIM-01..06, trazabilidad Alcance→Objetivos |
| 4 | `04_stakeholders_actores.md` | Abril 2026 | STK-01..10, ACT-01..05, matriz Influencia/Interés, permisos preliminares |
| 5 | `05_requisitos_funcionales.md` | Abril 2026 | MOD-01..09, RF-01..44 (37 esenciales + 7 deseables), diagrama dependencias |
| 6 | `06_requisitos_no_funcionales.md` | Abril 2026 | RNF-01..30 (17 esenciales + 13 deseables), 9 categorías |
| 7 | `07_reglas_negocio.md` | Abril 2026 | RN-01..30, 7 categorías, matriz impacto por componente |
| 8 | `08_casos_de_uso.md` | Abril 2026 | CU-01..15, relaciones include/extend, 10 CU especificados completamente |
| 9 | `09_modelo_analisis.md` | Abril 2026 | 29 clases BCE: B-01..09, C-01..08, E-01..09, I-01..03, diagrama relaciones |
| 10 | `10_arquitectura_tecnologias.md` | Abril 2026 | Stack completo (React 19 + Node.js 22 + PG 16), 9 tablas BD, Node.js como arquitectura candidata prioritaria |
| 11 | `11_viabilidad.md` | Abril 2026 | 5 dimensiones viables, restricciones identificadas |
| 12 | `12_planificacion_cronograma.md` | Abril 2026 | EDT/WBS ~40 tareas, 14 semanas, H1..H6, Gantt textual |
| 13 | `13_recursos_presupuesto.md` | Abril 2026 | RH-01..05, RS-01..15, RW-01..04, SV-01..05, SP-01..06, costo $0 + contingente ~USD 108 |
| 14 | `14_riesgos_suposiciones.md` | Abril 2026 | R-01..11, mapa de calor, consolidación de 14 suposiciones, plan de monitoreo |
| 15 | `15_metricas_exito.md` | Abril 2026 | 34 métricas (MF/MC/MR/MS/MA/MT/MG), criterio de aceptación global |
| 16 | `16_gobierno_documental.md` | Abril 2026 | CR-01..08, flujo de aprobación, política de cambios, RACI, diccionario de prefijos |
| 17 | `17_consolidacion_final.md` | Abril 2026 | Índice general, verificación de consistencia, consolidación de pendientes, conclusiones |

---

## 2. Decisiones Tomadas Durante la Elaboración

| ID | Decisión | Fase | Justificación |
|----|----------|------|---------------|
| DEC-01 | Arquitectura read-only con proxy backend | F0 | Restricción institucional: no se permite escritura en datos de personal |
| DEC-02 | Frontend SPA con React | F0, F10 | Interactividad requerida para filtros jerárquicos dinámicos |
| DEC-03 | Backend proxy como capa intermedia obligatoria | F0, F10 | Seguridad: el frontend nunca accede directo a la API institucional |
| DEC-04 | React 19 + TypeScript 5 + Vite 6 + Tailwind 4 | F10 | Stack moderno, tipado estricto, rendimiento de build, utilidades CSS |
| DEC-05 | Node.js 22 + Express 5 como arquitectura candidata prioritaria | F10 | Stack unificado TypeScript full-stack, mejor async I/O, npm ecosystem |
| DEC-06 | PostgreSQL 16 como BD local | F0, F10 | Solo para usuarios, roles, auditoría, config; no replica datos de personal |
| DEC-07 | Patrón Anti-Corruption Layer para integración | F9, F10 | Aislar el sistema de cambios en la API externa |
| DEC-08 | Ciclo de vida iterativo e incremental | F12 | Requerimientos no cerrados (REST-05), necesidad de validación temprana |
| DEC-09 | Métricas de seguridad con umbrales absolutos | F15 | Contexto militar/defensa: tolerancia cero vulnerabilidades |
| DEC-10 | Control de cambios en 3 niveles (menor/moderado/mayor) | F16 | Equipo unipersonal: gobierno liviano pero trazable |

---

## 3. Vacíos de Información — Estado Actualizado

| ID | Vacío | Estado a F17 | Acción Pendiente |
|----|-------|-------------|------------------|
| VAC-01 | Catálogo formal de formación civil | 🟡 ABIERTO | Validar con RH-03 usando datos de Contexto.md |
| VAC-02 | Contrato/Swagger de la API institucional | 🔴 CRÍTICO | PoC en FASE 2 del desarrollo; mock server como fallback |
| VAC-03 | Mecanismo de autenticación de la API | 🟡 ABIERTO | Descubrir en PoC |
| VAC-04 | Granularidad de permisos de consulta | 🟡 ABIERTO | Descubrir en PoC |
| VAC-05 | Normativa de seguridad institucional | 🟡 ABIERTO | Solicitar a RH-03/RH-04 |
| VAC-06 | Stack tecnológico del backend | 🟢 RESUELTO | Node.js 22 + Express 5 + TS (decidido en F10) |
| VAC-07 | Catálogos estructurados de aptitudes | 🟡 ABIERTO | Modelar desde Contexto.md; E-07 es administrable |
| VAC-08 | Entorno de staging disponible | 🟡 ABIERTO | Confirmar con RH-04; contingente VPS disponible |
| VAC-09 | Calidad de datos en la fuente | 🟡 ABIERTO | Evaluar en PoC |
| VAC-10 | Volumen de datos (cantidad de registros) | 🟡 ABIERTO | Estimar en PoC |

**Resumen:** 1 resuelto, 1 crítico, 8 abiertos. La PoC (H2, S5) resolverá la mayoría.

---

## 4. Suposiciones — Estado Actualizado

| ID | Suposición | Prob. Fallo | Estado |
|----|------------|-------------|--------|
| SUP-01 | API REST con JSON | Baja | PENDIENTE validación en PoC |
| SUP-02 | Catálogos relativamente estables | Media | PENDIENTE validación |
| SUP-03 | Datos incluyen campos para filtros diseñados | Media | PENDIENTE validación en PoC |
| SUP-04 | Referente participa activamente | Media | PENDIENTE (depende de RH-03) |
| SUP-05 | RBAC implementable sin cambios organizacionales | Baja | PENDIENTE |
| SUP-06 | Institución provee infraestructura | Media | PENDIENTE (VAC-08) |
| SUP-07 | Sistema Read-Only sin ABM | Muy Baja | ✅ VIGENTE |
| SUP-08 | 14 semanas suficientes para MVP | Media | ✅ VIGENTE (soportado por F12) |
| SP-01 | PPS no remunerada | Muy Baja | ✅ VIGENTE |
| SP-02 | Software open-source gratuito | Muy Baja | ✅ VIGENTE |
| SP-03 | Institución provee servidores (= SUP-06) | Media | PENDIENTE |
| SP-04 | GitHub Free tier suficiente | Baja | ✅ VIGENTE |
| SP-05 | Sin licenciamiento para API | Baja | PENDIENTE |
| SP-06 | Equipo del alumno cumple specs | Muy Baja | ✅ VIGENTE |

---

## 5. Riesgos — Resumen por Exposición

| Exp. | ID | Riesgo | Estrategia |
|------|----|--------|------------|
| **15** | R-01 | Dependencia total de la API | Mitigar (mock + ACL + health check) |
| **12** | R-02 | Cambios en contrato API | Mitigar (ACL + mapper + tests de contrato) |
| **12** | R-04 | Datos incompletos/inconsistentes | Mitigar (validación + sanitización + logging) |
| **12** | R-06 | Retraso por requisitos no cerrados | Mitigar (MoSCoW + freeze + buffer) |
| **12** | R-08 | Sin documentación de catálogos | Mitigar (Contexto.md + E-07 administrable) |
| **12** | R-09 | Sobrecarga del alumno | Mitigar + Aceptar (planificación + MoSCoW) |
| **10** | R-05 | Vulnerabilidades de seguridad | Mitigar (OWASP + audit + Helmet) |
| **9** | R-03 | Permisos insuficientes sobre datos | Mitigar (diseño modular) |
| **9** | R-10 | Falta de participación del cliente | Mitigar (canal formal + escalamiento) |
| **9** | R-11 | Desalineación de expectativas sobre alcance | Mitigar (documentación + validación en hitos) |
| **8** | R-07 | Incompatibilidad infra institucional | Mitigar (Docker + VPS contingente) |

---

## 6. Pendientes Críticos — Próximos Pasos

| # | Pendiente | Plazo | Responsable | Bloquea |
|---|-----------|-------|-------------|---------|
| 1 | Obtener aprobación formal del anteproyecto (PEN-F17-01) | S2 / H1 | RH-02, RH-03 | Inicio del desarrollo |
| 2 | Resolver VAC-02 — Contrato de API (PEN-F17-03) | S4 / H2 | RH-03, RH-04 | FASE 3 (backend proxy) |
| 3 | Confirmar infraestructura staging/prod (PEN-F13-01) | S3 | RH-04 | FASE 2 (infra) y FASE 6 (deploy) |
| 4 | Definir priorización MoSCoW de RF (PEN-F14-05) | S2 | RH-01, RH-03 | Planificación de sprints |
| 5 | Validar flujo de aprobación con Director PPS (PEN-F16-01) | S1 | RH-02 | Gobierno documental |

---

## 7. Inventario Completo de IDs del Proyecto

| Prefijo | Significado | Rango | Fase |
|---------|-------------|-------|------|
| REST | Restricción | 01–07 | F0 |
| VAC | Vacío de información | 01–10 | F0 |
| SUP | Suposición | 01–08 | F0 |
| DEC | Decisión previa | 01–06 | F0 |
| CNR | Consecuencia de no resolver | 01–07 | F1 |
| OE | Objetivo específico | 01–07 | F2 |
| AF | Alcance funcional | 01–10 | F3 |
| FA | Fuera de alcance | 01–10 | F3 |
| LIM | Límite | 01–06 | F3 |
| STK | Stakeholder | 01–10 | F4 |
| ACT | Actor | 01–05 | F4 |
| MOD | Módulo | 01–09 | F5 |
| RF | Requisito funcional | 01–44 | F5 |
| RNF | Requisito no funcional | 01–30 | F6 |
| RN | Regla de negocio | 01–30 | F7 |
| CU | Caso de uso | 01–15 | F8 |
| B | Clase boundary (BCE) | 01–09 | F9 |
| C | Clase control (BCE) | 01–08 | F9 |
| E | Clase entity (BCE) | 01–09 | F9 |
| I | Clase integración | 01–03 | F9 |
| H | Hito del proyecto | 1–6 | F12 |
| RH | Recurso humano | 01–05 | F13 |
| RS | Recurso software | 01–15 | F13 |
| RW | Recurso hardware | 01–04 | F13 |
| SV | Servicio | 01–05 | F13 |
| SP | Supuesto presupuestario | 01–06 | F13 |
| R | Riesgo | 01–11 | F14 |
| MF | Métrica funcional | 01–05 | F15 |
| MC | Métrica calidad | 01–06 | F15 |
| MR | Métrica rendimiento | 01–05 | F15 |
| MS | Métrica seguridad | 01–05 | F15 |
| MA | Métrica adopción | 01–05 | F15 |
| MT | Métrica auditoría | 01–04 | F15 |
| MG | Métrica gestión | 01–04 | F15 |
| CR | Criterio de revisión | 01–08 | F16 |
| PEN | Pendiente | FXX-NN | Todas |

**Total de tipos de IDs: 36 prefijos | Total de elementos: ~350+**

---

## 8. Estadísticas Finales

| Indicador | Valor |
|-----------|-------|
| Fases del anteproyecto | 18 (F0–F17) |
| Archivos producidos | 18 (.md) + 1 trazabilidad |
| Elementos identificados y trazados | ~350+ |
| Trazabilidad vertical completa | ✅ Sí |
| Trazabilidad horizontal completa | ✅ Sí |
| Vacíos resueltos | 1/10 |
| Vacíos abiertos | 9/10 (mayoría se resuelve en PoC) |
| Riesgo máximo | R-01 — Exposición 15 (crítica) |
| Costo base del proyecto | $0 |
| Pendientes totales | 27 (5 críticos) |
| Estado general | ✅ Listo para aprobación y desarrollo |

---
