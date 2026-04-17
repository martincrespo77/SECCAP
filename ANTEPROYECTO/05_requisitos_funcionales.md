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
