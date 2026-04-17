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
