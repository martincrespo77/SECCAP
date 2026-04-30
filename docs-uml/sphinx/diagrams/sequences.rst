Diagramas de Secuencia
=======================

Esta sección contiene los diagramas de secuencia del sistema SECCAP.
Cada diagrama describe el flujo interno de una operación principal.

.. contents::
   :local:
   :depth: 1

----

Secuencia de Login (CU-01)
---------------------------

Describe el proceso de autenticación: validación de credenciales, emisión de JWT, apertura de sesión y registro de auditoría.

**Participantes:** Frontend, Backend Proxy, Módulo Auth, BD Local, Módulo de Auditoría

.. uml:: ../../diagrams/plantuml/03_secuencia_login.puml
   :caption: Secuencia de login — SECCAP

----

Secuencia de Consulta (CU-06)
-------------------------------

Describe el flujo de una consulta: validación de filtros, consulta a la API institucional, poda de campos por rol y auditoría.

**Participantes:** Frontend, Backend Proxy, Middleware Auth, Middleware RBAC, Controlador Consulta, Adaptador API, BD Local, API Institucional

.. uml:: ../../diagrams/plantuml/04_secuencia_ejecutar_consulta.puml
   :caption: Secuencia de consulta — SECCAP

----

Secuencia de Consulta de Auditoría (CU-10)
--------------------------------------------

Describe el acceso a los logs de auditoría: autenticación, verificación de rol Auditor/Admin, filtrado, paginación y detalle.

**Participantes:** Auditor/Admin, Frontend, Backend Proxy, Módulo Auditoría, BD Local

.. uml:: ../../diagrams/plantuml/08_secuencia_consulta_auditoria.puml
   :caption: Secuencia de consulta de auditoría — SECCAP

----

Secuencia de Descarga de Documento (CU-09)
--------------------------------------------

Describe la descarga de documentos respaldatorios vía proxy: verificación de permisos, proxy a la API, manejo de errores (404, timeout).

**Participantes:** Consultor/Admin, Frontend, Backend Proxy, Middleware RBAC, Módulo Descarga, API Institucional, Módulo Auditoría

.. uml:: ../../diagrams/plantuml/09_secuencia_descarga_documento.puml
   :caption: Secuencia de descarga de documento respaldatorio — SECCAP
