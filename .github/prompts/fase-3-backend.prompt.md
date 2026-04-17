---
description: "Fase 3: Desarrollo del Backend Proxy. Autenticación JWT, RBAC, controlador proxy, validadores de filtros, DTOs, módulo de auditoría, manejo de errores."
agent: "backend"
---
# Fase 3: Desarrollo del Backend Proxy

## Objetivo de esta fase
Construir la capa backend completa que actúa como proxy seguro entre el frontend y la API institucional de RRHH.

## Contexto
Revisá [03_edt.md](../../DOCUMENTOS/03_edt.md) sección 1.3 (Desarrollo del Backend).
Revisá [09_requisitos.md](../../DOCUMENTOS/09_requisitos.md) para requisitos funcionales y no funcionales.
Revisá [Contexto.md](../../Contexto.md) para la tabla de filtros y endpoints lógicos.

## Módulos a desarrollar

### 1. Autenticación (EDT 1.3.1)
- Login con credenciales locales
- Generación de JWT o manejo de sesiones con cookies seguras
- Middleware de verificación de token en cada request
- Endpoint de logout / invalidación

### 2. RBAC - Control de acceso (EDT 1.3.1)
- Middleware que extrae el rol del usuario autenticado
- Reglas de poda: según el rol, se filtran campos de la respuesta
- Mínimo 2 roles: Admin y Lector Limitado
- Admin: acceso completo + gestión de usuarios locales
- Lector: solo consulta con campos restringidos

### 3. Controlador Proxy y Validadores (EDT 1.3.2)
- Recibir filtros del frontend
- Validar y sanitizar cada parámetro
- Construir la consulta a la API institucional
- Manejar timeouts y errores de la API externa
- Implementar caché temporal para catálogos estáticos

### 4. Transformador de respuestas / DTOs (EDT 1.3.3)
- Mapear JSON crudo de la API a interfaces/tipos definidos
- Filtrar campos según rol del solicitante
- Normalizar formatos de fecha, enums, etc.

### 5. Módulo de auditoría (EDT 1.3.4)
- Interceptar cada request que pase por el proxy
- Registrar: user_id, timestamp, endpoint, query_params, status_code, response_time_ms
- Almacenar en tabla `audit_logs` de la BD local

### 6. Endpoints REST
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /formacion/catalogos/tipos`
- `GET /formacion/catalogos/categorias-militares`
- `GET /formacion/catalogos/aptitudes?categoria=...`
- `GET /formacion/catalogos/idiomas`
- `GET /formacion/catalogos/niveles-idioma`
- `GET /formacion/consulta` (con filtros como query params)
- `GET /formacion/:id`
- `GET /formacion/:id/certificado`
- `GET /admin/usuarios` (solo Admin)
- `POST /admin/usuarios` (solo Admin)

## Entregable final de fase
- Backend proxy funcional con todos los módulos
- Tests de integración básicos (conexión API, auth, RBAC)
- Documentación de endpoints (README o Swagger básico)
