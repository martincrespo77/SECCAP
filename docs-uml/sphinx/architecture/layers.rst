Capas y Módulos
================

Esta sección describe cada capa del sistema y sus módulos internos.

Frontend (SPA)
--------------

**Tecnología:** React 19 + TypeScript 5 + Vite 6 + Tailwind CSS 4

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Módulo
     - Descripción
   * - ``AppShell`` / ``AppRouter``
     - Layout principal, rutas protegidas, redirección por rol.
   * - ``LoginPage``
     - Formulario de autenticación con manejo de errores.
   * - ``ConsultaPage``
     - Filtros jerárquicos dependientes (tipo → categoría → aptitud).
   * - ``ResultadosPage``
     - Tabla paginada de resultados con columnas adaptadas al rol.
   * - ``DetallePage``
     - Ficha individual con posibilidad de descarga de documento.
   * - ``AuditoriaPage``
     - Vista de logs de auditoría (solo Auditor/Admin).
   * - ``AdminPage``
     - Gestión de usuarios y roles.

Backend Proxy
-------------

**Tecnología:** Node.js 22 + Express 5 + TypeScript 5 + Prisma 7

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Módulo
     - Descripción
   * - ``Middleware Auth``
     - Valida JWT en el encabezado ``Authorization``.
   * - ``Middleware RBAC``
     - Verifica que el rol del usuario tenga el permiso requerido para el endpoint.
   * - ``Middleware CORS/RateLimit``
     - Configura CORS, aplica rate limiting por IP.
   * - ``Módulo Auth y Sesión``
     - Login, refresh, cierre de sesión. Genera y rota tokens.
   * - ``Módulo Consulta``
     - Valida filtros con Zod, llama al adaptador, poda campos según rol.
   * - ``Módulo Catálogos``
     - Gestiona catálogos dependientes con caché TTL en BD local.
   * - ``Módulo Auditoría``
     - INSERT inmutable en ``audit_log``. Expone endpoint de consulta de logs.
   * - ``Módulo Administración``
     - CRUD de usuarios, roles y permisos.
   * - ``Health Check``
     - ``GET /health`` — verifica backend + BD + API externa.

Capa de Integración (ACL / Adaptador)
---------------------------------------

**Patrón:** Adapter + Anti-Corruption Layer

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Componente
     - Descripción
   * - ``AdaptadorAPIPersonal``
     - Implementa el patrón Adapter. Aísla al sistema del contrato de la API institucional.
   * - ``ClienteHTTP``
     - Wrapper sobre ``fetch``/``axios`` con timeout, retry y manejo de errores.
   * - ``MapperRespuestaAPI``
     - Transforma la respuesta cruda de la API al modelo interno del sistema.

Persistencia Local (BD Local)
------------------------------

**Tecnología:** PostgreSQL 16 + Prisma 7 + ``@prisma/adapter-pg``

.. list-table::
   :header-rows: 1
   :widths: 25 35 40

   * - Tabla
     - Prefijo
     - Propósito
   * - ``sys_usuario``
     - ``sys_``
     - Usuarios internos del sistema
   * - ``sys_rol``
     - ``sys_``
     - Roles (admin, consultor, auditor)
   * - ``sys_permiso``
     - ``sys_``
     - Permisos habilitados por módulo
   * - ``sys_usuario_rol``
     - ``sys_``
     - Asignación usuario ↔ rol (N:N)
   * - ``sys_rol_permiso``
     - ``sys_``
     - Asignación rol ↔ permiso (N:N)
   * - ``sys_sesion``
     - ``sys_``
     - Sesiones activas y expiradas
   * - ``audit_log``
     - ``audit_``
     - Registro inmutable de auditoría (solo INSERT)
   * - ``sys_configuracion``
     - ``sys_``
     - Configuraciones del sistema
   * - ``cache_catalogo``
     - ``cache_``
     - Caché de catálogos con TTL configurable

.. important::
   La BD local **no almacena datos del personal**. Solo contiene información operativa del sistema.
   Los datos de formaciones y aptitudes se obtienen en tiempo real desde la API institucional.
