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
