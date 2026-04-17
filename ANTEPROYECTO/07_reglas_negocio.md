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
