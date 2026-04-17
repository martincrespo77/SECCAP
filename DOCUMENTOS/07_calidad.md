# Plan de Gestión de Calidad — SECCAP

## 1. Aseguramiento de la Calidad (QA) - Enfoque Conceptual

Para un sistema que integra datos institucionales y los presenta filtrados según el rol del usuario consultante, la calidad no solo reside en que la UI funcione sin errores, sino fundamentalmente en que **la información mostrada sea precisa, el acceso esté controlado y la auditoría sea completa**.

### Objetivos Específicos de Calidad
1.  **Fiabilidad del Proxy:** El adaptador proxy no debe falsear, mezclar ni perder atributos clave de las respuestas de origen de la API principal, ni aunque cambie el mapeo de aptitudes.
2.  **Malla de Autorización:** La exactitud de las validaciones de rol (RBAC); bajo ninguna circunstancia un rol debe visualizar o extraer atributos restringidos para su nivel de acceso.
3.  **Trazabilidad Garantizada:** Cada consulta crítica debe estar fielmente reflejada en los logs de la DB, con metadatos reales e integridad del instante de tiempo.
4.  **UX / UI Óptima:** Entregas visualmente limpias y semánticas. Errores genéricos 4xx o 5xx controlados; el usuario web nunca deberá ver el código crudo del error o traza del servidor.

## 2. Actividades y Estándares de Control (QC)

*   **Revisiones por Pares y Code Review:** Se adoptará la práctica de revisar pull requests (a nivel académico) o validaciones iteradas entre los integrantes antes de hacer *merge* al branch productivo o de entrega (UAT).
*   **Desacople Arquitectónico (Regla 1):** El frontend Web NO contendrá ninguna credencial JWT maestra de la API institucional externa. Su función es UI y solicitud por Sesión; todo el control real reside en el Proxy Backend.
*   **Versionado de Base de Datos Local:** Implementar y sostener migraciones versionadas formalmente (TypeORM o herramienta equivalente del stack Node.js/TS), evitando la alteración manual desde gestores gráficos para mantener la integridad reproductible.

## 3. Métricas Principales de Calidad
*   **Tasa de Inyección y Permisos:** Tiempo y veces logradas para violar o saltear la regla RBAC del proxy (se planifica al menos un Test de Intrusión de Autorización interno en QA).
*   **Time-To-First-Byte (TTFB) del Proxy Intermedio:** La respuesta a búsquedas complejas no debe demorar exageradamente ante la consulta al servidor maestro (se buscará optimizar peticiones).
*   **Incidencias UAT (User Acceptance Testing):** Número de observaciones reportadas por los usuarios "Tester" formales del departamento interesados en las aptitudes. 
