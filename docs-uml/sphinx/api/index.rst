API y Contratos
================

Esta sección documenta los contratos de la API REST del backend proxy SECCAP.

.. note::
   Todos los endpoints requieren autenticación JWT (``Authorization: Bearer <token>``).
   Los endpoints marcados con ``[RBAC]`` requieren además el permiso de rol correspondiente.

Endpoints de autenticación
---------------------------

``POST /api/auth/login``
   Autenticar con credenciales internas.

   **Body:** ``{ "username": string, "password": string }``

   **Respuesta OK (200):**

   .. code-block:: json

      {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "expiresIn": 3600,
        "user": { "id": 1, "username": "jperez", "rol": "consultor" }
      }

``POST /api/auth/logout``
   Invalidar la sesión activa.

   **Respuesta OK (200):** ``{ "message": "Sesión cerrada correctamente" }``

Endpoints de consulta
----------------------

``GET /api/formacion/consulta`` ``[RBAC: CONSULTA_FORMACIONES]``
   Consultar formaciones del personal con filtros.

   **Parámetros de query:**

   .. list-table::
      :header-rows: 1
      :widths: 20 10 70

      * - Parámetro
        - Tipo
        - Descripción
      * - ``tipo_formacion``
        - string
        - Requerido. Ej: ``militar``, ``idioma``, ``civil``.
      * - ``categoria``
        - string
        - Opcional. Filtro dependiente del tipo de formación.
      * - ``aptitud``
        - string
        - Opcional. Filtro dependiente de la categoría.
      * - ``page``
        - number
        - Paginación. Default: 1.
      * - ``limit``
        - number
        - Resultados por página. Default: 20. Max: 100.

   **Respuesta OK (200):**

   .. code-block:: json

      {
        "items": [],
        "total": 47,
        "page": 1,
        "limit": 20,
        "source": "api-institucional"
      }

``GET /api/formacion/catalogo/:tipo`` ``[RBAC: CONSULTA_FORMACIONES]``
   Obtener catálogo dependiente (con caché TTL).

``GET /api/formacion/documento/:id`` ``[RBAC: DESCARGA_DOCUMENTOS]``
   Proxy de descarga de documento respaldatorio.

Endpoint de auditoría
----------------------

``GET /api/auditoria`` ``[RBAC: VER_AUDITORIA]``
   Consultar logs con filtros: ``usuario``, ``accion``, ``desde``, ``hasta``.

   **Respuesta OK (200):** Lista paginada de ``RegistroAuditoria``.

Health Check
------------

``GET /health``
   **Sin autenticación.** Verifica estado del backend y conectividad.

   **Respuesta OK (200):**

   .. code-block:: json

      {
        "status": "ok",
        "database": "ok",
        "timestamp": "2026-04-23T12:00:00Z"
      }

Códigos de error estándar
--------------------------

.. list-table::
   :header-rows: 1
   :widths: 15 85

   * - HTTP
     - Significado
   * - ``400 Bad Request``
     - Filtros inválidos (Zod validation error). Body contiene ``errors[]``.
   * - ``401 Unauthorized``
     - JWT ausente, expirado o inválido.
   * - ``403 Forbidden``
     - Rol del usuario no tiene el permiso requerido.
   * - ``404 Not Found``
     - Recurso (documento) no encontrado en la API institucional.
   * - ``503 Service Unavailable``
     - La API institucional no respondió en el timeout configurado.
   * - ``500 Internal Server Error``
     - Error interno no controlado. Registrado en auditoría.
