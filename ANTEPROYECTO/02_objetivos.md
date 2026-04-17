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
