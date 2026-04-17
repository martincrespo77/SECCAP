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
