# Plan de Gestión del Alcance — SECCAP

## 1. Descripción Sistemática del Ciclo
Debido a la naturaleza de los requerimientos orgánicos (que aún no han sido descritos en su totalidad por el cliente), el enfoque del alcance se gestionará de manera **Iterativa e Incremental**. No es viable cerrar la totalidad de las reglas funcionales en el Día 1, por lo que el alcance se irá redefiniendo dentro de los límites y objetivos expuestos en el Acta de Constitución.

## 2. Inclusiones (Lo que SÍ entra en el proyecto)
*   **Módulo de Autenticación y Autorización (RBAC)** local para administrar los operadores de la aplicación.
*   **Capa Proxy (Backend):** 
    *   Validación y limpieza de filtros que envía el frontend.
    *   Negociación segura con la API institucional (manejo de tokens internos, timeout, fallbacks).
    *   Saneamiento o filtro de la respuesta institucional según el Rol del usuario consultante.
    *   Sistema de registro de logs centralizado (auditoría).
*   **Almacenamiento Local (Minimalista):** Base de datos relacional para guardar exclusivamente tablas de usuarios del sistema, catálogo de roles, registros de auditoría, sesiones y configuraciones generales. No almacena datos maestros del personal.
*   **Frontend (Cliente Web):**
    *   Sistema de login.
    *   Dashboard principal.
    *   Módulo de búsquedas complejas con múltiples filtros.
    *   Vista de detalle con campos autorizados según el rol del usuario consultante.
    *   Vistas restrictivas adaptativas orientadas al rol conectado.

## 3. Exclusiones (Lo que NO entra en el proyecto)
*   **Extracción Masiva de Datos:** El sistema no será un Data Warehouse y no extraerá el 100% de la tabla de personal para procesarla localmente. Todo filtro se resuelve consumiendo el endpoint correspondiente de la API institucional o pre-filtrando la respuesta bajo demanda.
*   **Gestión (ABM) de Personal en la Base Institucional:** El sistema propuesto es, por diseño y mandato, **Read-Only** respecto a los datos del personal. No realiza altas, bajas ni modificaciones sobre la base institucional.
*   **Recolección de Información desde Cero:** El éxito de búsqueda depende de que el usuario tenga cargadas aptitudes y capacidades en la DB externa. La carga de las mismas excede a este software.

## 4. Criterios de Aceptación
Para que el producto final sea aceptado por el cliente, deben cumplirse las siguientes condiciones demostrables:
1.  Un usuario no logueado **no puede acceder** ni invocar de forma alguna a la API a través del proxy.
2.  Un usuario autenticado y con un rol limitado no debe recibir, en la respuesta desde el proxy a su frontend, campos sensibles que no tenga derecho a visualizar.
3.  Cualquier consulta cruzada entre el sistema local y la API Institucional debe dejar trazabilidad clara (usuario solicitante, filtros aplicados, fecha, éxito/fallo) almacenada localmente.
4.  La interfaz debe presentar capacidades y aptitudes de forma amigable (tablas paginadas u ordenadas, con posibilidad de exportar a pantalla).

## 5. Control de Cambios del Alcance
Cualquier necesidad de agregar módulos adicionales (por ejemplo, evaluaciones al personal desde la nueva app en lugar de la oficial) implicará un cambio de impacto severo que requerirá aprobación formal, revisión de riesgos estructurales y reajuste del cronograma.
