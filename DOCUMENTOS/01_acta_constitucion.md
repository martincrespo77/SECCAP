# Acta de Constitución del Proyecto (Project Charter)

## 1. Información General
- **Nombre del Proyecto:** SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal
- **Patrocinador:** [PENDIENTE — Nombre y cargo del responsable del Área de Personal]
- **Director de Proyecto:** [PENDIENTE — Nombre completo del alumno]
- **Fecha de Inicio Autorizada:** [PENDIENTE — Fecha real de inicio]
- **Fecha Estimada de Cierre:** [PENDIENTE — ~14 semanas después del inicio]
- **Estado de los Requisitos:** En descubrimiento (ciclo iterativo)

## 2. Propósito y Justificación (Caso de Negocio)
El área de personal requiere una herramienta segura para buscar, filtrar y visualizar capacidades y aptitudes del personal según el rol del usuario consultante. Dado que la información oficial reside en una base de datos institucional estrictamente controlada, surge la necesidad de un sistema intermedio de consulta que actúe como capa de integración: consumiendo la información mediante una API de solo lectura, filtrándola según los permisos del rol consultante, y manteniendo un registro de auditoría sin replicar innecesariamente la información sensible.

## 3. Objetivos del Proyecto
*   **Integración:** Construir y establecer la conexión estable y segura con la API institucional de Recursos Humanos.
*   **Seguridad:** Implementar Autenticación y Control de Acceso Basado en Roles (RBAC), asegurando el principio de menor privilegio.
*   **Trazabilidad:** Diseñar el sistema para mantener logs verificables sobre qué usuario consultó qué información.
*   **Usabilidad:** Proveer una Interfaz de Usuario (UI) reactiva y moderna que facilite filtros cruzados para capacidades y aptitudes.

## 4. Alcance Preliminar
El proyecto consiste en el desarrollo de:
1.  **Frontend moderno:** Aplicación web para el usuario (React, Vite, Tailwind).
2.  **Backend Proxy:** Capa de validación, consulta a la API de personal institucional, mapping y transformación de datos.
3.  **Persistencia Local (Mínima):** Base de datos destinada exclusivamente a autenticación, roles, sesiones, auditoría y configuraciones operativas del sistema. No almacena datos maestros del personal.
*La creación o modificación de datos del personal en la base de datos institucional queda **fuera** del alcance del proyecto.*

## 5. Riesgos de Alto Nivel
1.  **R-01 — Inestabilidad de la API Externa:** Caídas o modificaciones no avisadas de los endpoints de RRHH (cambios de estructura JSON sin previo aviso).
2.  **R-02 — Limitaciones de rendimiento de la API:** Timeouts ante consultas complejas de aptitudes múltiples; la API no admite paginación nativa.
3.  **R-03 — Aprobación de Permisos:** Retrasos por parte de infraestructura corporativa para habilitar tokens de acceso u orígenes CORS a la nueva aplicación.
4.  **R-04 — Incertidumbre en los Requerimientos:** Dificultad para cerrar las reglas de filtrado de "Capacidades y aptitudes" debido a la naturaleza abierta de cómo se clasifica la información hoy.

## 6. Hitos Principales
1.  Aprobación del Acta de Constitución e inicio formal del proyecto.
2.  Prueba de Concepto (PoC) exitosa de conexión a la API institucional.
3.  Implementación del Backend Proxy y módulo de Autenticación/RBAC local.
4.  Lanzamiento del Frontend modular y funcionalidad de consulta con filtros.
5.  Validaciones de Seguridad y Auditoría (UAT).
6.  Despliegue en entorno de pruebas / Implantación y Cierre.

> **Nota:** El inicio formal de la ejecución del proyecto se produce en el marco de una Práctica Profesional Supervisada (PPS), que constituye el hito de arranque académico e institucional.

## 7. Supuestos y Restricciones
*   **Restricción:** El sistema operará de manera estrictamente de consulta **(Read-Only)** respecto a los datos de personal oficial; no habrá *inserts* ni *updates* del lado de RRHH.
*   **Restricción Tecnológica:** El frontend deberá diseñarse bajo estándares modernos (TypeScript, Tailwind, Vite).
*   **Supuesto:** La API de personal devolverá los campos en un formato predecible (ej. JSON) que permita el mapeado eficiente.
*   **Supuesto:** Los clientes estarán disponibles para participar activamente en validaciones tempranas de requerimientos.

## 8. Firmas
__________________________________
**Patrocinador del Proyecto**

__________________________________
**Director del Proyecto**
