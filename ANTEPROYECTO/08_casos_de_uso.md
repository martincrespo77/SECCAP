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
