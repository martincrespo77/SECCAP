Visión General de la Arquitectura
===================================

SECCAP implementa una **arquitectura desacoplada por capas**, donde el frontend nunca accede directamente a la 
API institucional. Toda integración con fuentes externas pasa por el backend proxy.

Principios de diseño
---------------------

1. **Mínimo privilegio** — Cada rol solo accede a lo que le corresponde.
2. **Proxy obligatorio** — El frontend no consume APIs institucionales directamente.
3. **Auditoría inmutable** — Toda acción queda registrada en ``audit_log`` sin posibilidad de borrado.
4. **Desacoplamiento** — El adaptador ACL aísla al sistema del contrato exacto de la API externa.
5. **Disponibilidad parcial** — Si la API institucional falla, el sistema responde con error controlado en lugar de caer.

Capas del sistema
-----------------

.. list-table::
   :header-rows: 1
   :widths: 20 30 50

   * - Capa
     - Tecnología
     - Responsabilidad principal
   * - **Frontend (SPA)**
     - React 19 + Vite + Tailwind
     - Presentación, filtros jerárquicos, navegación
   * - **Backend Proxy**
     - Node.js 22 + Express 5
     - Validación, integración, poda de campos, auditoría
   * - **Capa de Integración**
     - Adaptador ACL + HTTP Client
     - Aisla al sistema del contrato de la API institucional
   * - **Persistencia Local**
     - PostgreSQL 16 + Prisma 7
     - Usuarios, roles, sesiones, auditoría, caché de catálogos
   * - **API Institucional**
     - REST JSON (solo lectura)
     - Fuente de verdad para formaciones y aptitudes del personal
   * - **Seguridad (transversal)**
     - JWT, RBAC, Helmet, rate limiting
     - Autenticación, autorización, protección, trazabilidad

Flujo principal de una consulta
---------------------------------

.. code-block:: text

   Usuario
     │ HTTPS
     ▼
   Frontend SPA ──────────────────────── /api/formacion/consulta
     │
     │ HTTPS (proxy interno)
     ▼
   Backend Proxy
     ├── Middleware Auth: valida JWT
     ├── Middleware RBAC: verifica permiso de rol
     ├── Controlador Consulta: valida filtros (Zod)
     ├── Adaptador ACL: llama a API Institucional
     ├── Mapper: transforma respuesta
     ├── Poda: elimina campos no autorizados según rol
     ├── Auditoría: INSERT audit_log
     └── Respuesta al frontend: { items, total, page, source }
