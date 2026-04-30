Entidad-Relación — BD Local
============================

El diagrama entidad-relación describe el esquema de la base de datos local de SECCAP.
La BD local **no almacena datos del personal**; solo almacena información operativa del sistema.

Entidades principales
----------------------

.. list-table::
   :header-rows: 1
   :widths: 20 35 45

   * - Tabla
     - Propósito
     - Notas
   * - ``sys_usuario``
     - Usuarios internos del sistema
     - ``activo`` para habilitar/deshabilitar sin borrar.
   * - ``sys_rol``
     - Roles: admin, consultor, auditor
     - Extensible sin código si se agrega a través de administración.
   * - ``sys_permiso``
     - Permisos por módulo
     - Código único por permiso (``CONSULTA_FORMACIONES``, ``VER_AUDITORIA``, etc.).
   * - ``sys_usuario_rol``
     - Relación N:N usuario ↔ rol
     - Un usuario puede tener múltiples roles.
   * - ``sys_rol_permiso``
     - Relación N:N rol ↔ permiso
     - Un rol puede tener múltiples permisos.
   * - ``sys_sesion``
     - Sesiones activas
     - ``activa`` para invalidar sin borrar. Expiración por timestamp.
   * - ``audit_log``
     - Registro de auditoría
     - Solo INSERT. Nunca UPDATE/DELETE. Usa ``bigserial`` y ``jsonb`` para filtros.
   * - ``sys_configuracion``
     - Configuraciones del sistema
     - Clave-valor. Permite ajustar comportamiento sin redeploy.
   * - ``cache_catalogo``
     - Caché de catálogos de la API
     - TTL configurable. Reduce carga sobre la API institucional.

Invariantes de la BD
----------------------

* ``audit_log`` es inmutable: no se implementan operaciones UPDATE ni DELETE.
* ``sys_usuario.activo = false`` equivale a cuenta deshabilitada (no se borra el registro).
* ``public.cache_catalogo.vigente = false`` cuando el TTL expiró o el catálogo fue invalidado manualmente.

Diagrama
---------

.. uml:: ../../diagrams/plantuml/10_er_bd_local.puml
   :caption: Esquema Entidad-Relación de la BD local — SECCAP
