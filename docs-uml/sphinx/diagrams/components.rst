Componentes de la Arquitectura
================================

El diagrama de componentes muestra la estructura interna del sistema en términos de sus módulos y la 
comunicación entre ellos, organizados en tres empaquetados principales.

Empaquetados
-------------

**Frontend SPA**
   Componentes React que conforman la interfaz de usuario.
   Incluye: Login, Dashboard, Consulta, Resultados, Detalle, Auditoría UI, Admin UI.

**Backend Proxy**
   Módulos Express del servidor. Organizado en middleware de seguridad, módulos de dominio y Health Check.

**Capa de Integración**
   Adaptador ACL, cliente HTTP y mapper de respuesta. Único punto de contacto con la API institucional.

Reglas de comunicación
-----------------------

.. important::
   El frontend **nunca** se comunica directamente con la API institucional.
   Todo acceso externo pasa obligatoriamente por el backend proxy y la capa de integración.

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - De
     - A
     - Canal
   * - Frontend (cualquier componente)
     - Middleware Auth (backend)
     - HTTPS JSON
   * - Middleware RBAC
     - Módulos de dominio
     - Llamada interna
   * - Módulo Consulta
     - Adaptador API Personal
     - Llamada interna
   * - Adaptador API Personal
     - API Institucional RRHH
     - HTTPS JSON (solo lectura)
   * - Módulos de dominio
     - BD Local PostgreSQL
     - TCP / SQL parametrizado

Diagrama
---------

.. uml:: ../../diagrams/plantuml/06_componentes_arquitectura.puml
   :caption: Componentes de arquitectura — SECCAP
