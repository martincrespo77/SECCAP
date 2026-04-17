# FASE 10 — ARQUITECTURA CANDIDATA Y TECNOLOGÍAS
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Arquitectura Candidata y Stack Tecnológico**

## 2. Objetivo
Definir la arquitectura preliminar del sistema, justificar las tecnologías seleccionadas, describir los componentes, el flujo general de datos, las integraciones externas y la estrategia de despliegue.

---

## 3. Desarrollo

### 3.1. Estilo Arquitectónico

Se adopta una **arquitectura en capas con desacoplamiento por capa de integración (Backend for Frontend + Anti-Corruption Layer)**.

**Justificación:**
- El sistema tiene dos fuentes de datos con responsabilidades distintas: la API institucional (datos de personal) y la BD local (usuarios, roles, auditoría).
- Se requiere una capa intermedia (proxy) que encapsule la lógica de integración, validación y filtrado por rol.
- Se necesita separar claramente: presentación (frontend), lógica de negocio y seguridad (backend), acceso a datos locales (BD) e integración externa (API).
- Este estilo permite que cambios en la API externa no afecten al frontend, y que cambios en la UI no afecten la lógica de negocio.

### 3.2. Componentes del Sistema

```
┌──────────────────────────────────────────────────────────────────┐
│                         USUARIO                                   │
│                    (Navegador Web)                                │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FRONTEND (SPA)                                 │
│  React 19 + TypeScript + Vite + Tailwind CSS                     │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐       │
│  │ Login     │ │ Consulta │ │ Resultados│ │ Auditoría    │       │
│  └───────────┘ └──────────┘ └──────────┘ └──────────────┘       │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐                        │
│  │ Dashboard │ │ Detalle  │ │ Admin    │                        │
│  └───────────┘ └──────────┘ └──────────┘                        │
└────────────────────────┬─────────────────────────────────────────┘
                         │ HTTPS / REST JSON
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    BACKEND PROXY                                  │
│  Node.js + Express (arquitectura candidata prioritaria — ver §3.5)  │
│  ┌─────────────────────────────────────────────────────┐         │
│  │ Middleware: Auth │ RBAC │ Rate Limit │ CORS │ Logger │         │
│  └─────────────────────────────────────────────────────┘         │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐           │
│  │ Módulo Auth  │ │ Módulo       │ │ Módulo         │           │
│  │ & Sesión     │ │ Consulta     │ │ Administración │           │
│  └──────────────┘ └──────┬───────┘ └────────────────┘           │
│  ┌──────────────┐        │         ┌────────────────┐           │
│  │ Módulo       │        │         │ Módulo         │           │
│  │ Auditoría    │◄───────┤         │ Catálogos      │           │
│  └──────────────┘        │         └────────────────┘           │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────┐         │
│  │        Capa de Integración (Anti-Corruption Layer)  │         │
│  │  AdaptadorAPI │ ClienteHTTP │ MapperRespuesta        │         │
│  └─────────────────────────┬───────────────────────────┘         │
└────────────────┬───────────┼─────────────────────────────────────┘
                 │           │
                 ▼           ▼
┌────────────────────┐  ┌────────────────────────────────────┐
│  BD LOCAL          │  │  API INSTITUCIONAL RRHH            │
│  PostgreSQL        │  │  (Sistema externo — Read-Only)     │
│  ┌──────────────┐  │  │  JSON / REST                       │
│  │ usuarios     │  │  │  Endpoints de consulta y catálogos │
│  │ roles        │  │  └────────────────────────────────────┘
│  │ permisos     │  │
│  │ auditoria    │  │
│  │ config       │  │
│  │ cache_cat    │  │
│  └──────────────┘  │
└────────────────────┘
```

### 3.3. Flujo General de una Consulta

1. El **usuario** accede al frontend e inicia sesión.
2. El **frontend** presenta los filtros jerárquicos según el rol del usuario.
3. El usuario configura filtros y presiona "Consultar".
4. El **frontend** envía los filtros al **backend proxy** vía REST/JSON sobre HTTPS.
5. El **backend** autentica y autoriza al usuario (middleware Auth + RBAC).
6. El **módulo de consulta** valida y sanitiza los filtros.
7. La **capa de integración** (AdaptadorAPI) construye la consulta y la envía a la **API institucional**.
8. La API responde con datos en JSON.
9. El **MapperRespuesta** transforma los datos al modelo interno.
10. El **ControladorConsulta** filtra los campos según el rol.
11. El **módulo de auditoría** registra la operación en la **BD local**.
12. El backend devuelve los resultados al frontend.
13. El **frontend** renderiza la tabla de resultados.

### 3.4. Stack Tecnológico — Frontend

| Componente | Tecnología | Versión | Justificación |
|---|---|---|---|
| Framework UI | **React** | 19.x | Ecosistema maduro, componentes reutilizables, ideal para SPAs de consulta con formularios complejos |
| Lenguaje | **TypeScript** | 5.x (strict mode) | Tipado estático reduce errores en tiempo de desarrollo; mejora mantenibilidad |
| Bundler | **Vite** | 6.x | Desarrollo rápido (HMR), build optimizado, configuración mínima |
| Estilos | **Tailwind CSS** | 4.x | Utility-first; prototipado rápido; consistencia visual sin CSS custom complejo |
| HTTP Client | **Axios** | 1.x | Interceptores para manejo de tokens y errores; soporte de cancelación de requests |
| Routing | **React Router** | 7.x | Navegación SPA estándar; rutas protegidas por rol |
| Iconos | **Lucide React** | Última estable | Íconos ligeros, consistentes y open-source |

### 3.5. Stack Tecnológico — Backend

**Arquitectura candidata prioritaria: Node.js + Express**

> **Nota:** Node.js + Express + TypeScript se adopta como **arquitectura candidata prioritaria**, no como decisión definitiva e irreversible. La confirmación final depende de la validación con la infraestructura institucional (PEN-F10-01). Si la institución exige PHP, la arquitectura desacoplada permite la sustitución sin afectar el diseño.

| Componente | Tecnología | Versión | Justificación |
|---|---|---|---|
| Runtime | **Node.js** | 22.x LTS | Mismo lenguaje que el frontend (TypeScript); ecosistema npm robusto; eficiente para I/O (llamadas a API) |
| Framework HTTP | **Express** | 5.x | Framework minimalista, maduro, extensible vía middleware |
| Lenguaje | **TypeScript** | 5.x | Stack unificado frontend/backend; tipado de DTOs compartido |
| ORM / Query Builder | **Prisma** o **Knex.js** | Última estable | Migraciones versionadas, type-safe, consultas parametrizadas |
| Autenticación | **JWT** (jsonwebtoken) | — | Tokens stateless para autenticación; compatible con RBAC |
| Validación | **Zod** o **Joi** | Última estable | Validación de esquemas de entrada; sanitización de filtros |
| Logging | **Winston** o **Pino** | Última estable | Logging estructurado (JSON) con niveles y rotación |
| Testing | **Vitest** o **Jest** | Última estable | Consistente con herramientas del frontend |

**Justificación de Node.js sobre PHP:**

| Criterio | Node.js | PHP |
|---|---|---|
| Stack unificado (TypeScript full-stack) | ✅ | ❌ |
| Eficiencia en I/O asíncrono (llamadas a API) | ✅ Nativo | ⚠️ Requiere extensiones |
| Ecosistema de paquetes para proxying y middleware | ✅ npm/express middleware | ⚠️ Menos opciones estándar |
| Facilidad de desarrollo para equipo reducido | ✅ Un solo lenguaje | ⚠️ Dos lenguajes |
| Soporte institucional | **PENDIENTE** (SUP) | **PENDIENTE** (SUP) |
| Curva de aprendizaje del equipo | Se asume competencia (SUP-08) | Se asume competencia (SUP-08) |

> **Nota:** Si la institución tiene restricción técnica que obligue PHP, la arquitectura se mantiene idéntica; solo cambia el framework de backend (Laravel/Slim en lugar de Express). El diseño desacoplado permite esta sustitución.

### 3.6. Stack Tecnológico — Persistencia Local

> **Aclaración fundamental:** La base de datos local del SECCAP es **necesaria y mínima**. Su propósito es almacenar exclusivamente los datos operativos del sistema (usuarios, roles, permisos, auditoría, sesiones, configuración, caché de catálogos). **No replica ni almacena datos de personal** procedentes de la API institucional. Los datos de personal se consultan en tiempo real y no se persisten localmente.

| Componente | Tecnología | Justificación |
|---|---|---|
| RDBMS | **PostgreSQL** 16.x | Robusto, open-source, mejor manejo de JSON nativo (útil para almacenar filtros_json en auditoría), soporte de permisos granulares a nivel BD |
| Alternativa | MySQL 8.x | Si la infraestructura institucional lo requiere; funcionalmente equivalente para este alcance |

**Esquema lógico de tablas previsto:**

| Tabla | Propósito | Operaciones |
|---|---|---|
| `usuarios` | Usuarios internos del sistema | CRUD (soft delete) |
| `roles` | Definición de roles | CRUD |
| `permisos` | Permisos granulares | CRUD |
| `usuario_rol` | Relación N:N usuarios ↔ roles | INSERT/DELETE |
| `rol_permiso` | Relación N:N roles ↔ permisos | INSERT/DELETE |
| `auditoria` | Log inmutable de operaciones | **Solo INSERT** (RN-28) |
| `configuracion` | Parámetros del sistema | READ/UPDATE |
| `catalogo_cache` | Caché de catálogos de la API | INSERT/UPDATE/READ |
| `sesiones` | Sesiones activas (si no es JWT puro) | CRUD |

### 3.7. Seguridad

| Capa | Medida | Implementación |
|---|---|---|
| Transporte | HTTPS obligatorio | TLS 1.2+ en producción |
| Autenticación | JWT con expiración + refresh token | Middleware de Express |
| Autorización | RBAC basado en tabla de permisos | Middleware por ruta |
| Entrada | Validación + sanitización de todos los inputs | Zod/Joi en backend; validación HTML5 + Zod en frontend |
| Respuesta | Filtrado de campos por rol antes de enviar al frontend | ControladorConsulta (C-03) |
| Errores | Sin exposición de datos técnicos | ControladorErrores (C-07) |
| CORS | Whitelist de orígenes permitidos | Middleware Express |
| Rate limiting | Límite de requests por IP/usuario | express-rate-limit |
| Headers | Cabeceras de seguridad (CSP, X-Frame-Options, etc.) | Helmet middleware |
| BD | Consultas parametrizadas (ORM); contraseñas con bcrypt | Prisma/Knex + bcrypt |
| Auditoría | Tabla inmutable (sin UPDATE/DELETE a nivel SQL) | Permisos de BD + lógica de aplicación |

### 3.8. Despliegue Preliminar

| Ambiente | Propósito | Componentes |
|---|---|---|
| **Desarrollo** | Desarrollo local del equipo | Frontend (Vite dev server), Backend (Node.js local), PostgreSQL local, Mock de API |
| **Staging/Testing** | Pruebas integradas con API real (o sandbox) | Frontend + Backend desplegados en servidor de pruebas; BD de testing; acceso a API de staging (si existe) |
| **Producción** | Operación real del sistema | Frontend servido por Nginx/caddy; Backend en Node.js (PM2 o Docker); PostgreSQL en servidor institucional; Acceso a API de producción |

**Estrategia de despliegue recomendada:**
- Contenedores Docker para backend y BD (facilita reproducibilidad).
- Frontend como archivos estáticos servidos por servidor web (Nginx).
- Variables de entorno para toda configuración sensible (tokens, URIs de API, credenciales de BD).
- CI/CD básico vía GitHub Actions o equivalente institucional.
- **Despliegue inicial en entorno institucional de pruebas**, con pase a producción sujeto a validación y aprobación del Área de Informática.

---

## 4. Tablas y Matrices

### 4.1. Matriz de Componente → Objetivo

| Componente | Objetivos que Soporta |
|---|---|
| Frontend React/TS | OE-03 (Interfaz moderna) |
| Backend Express/TS | OE-01 (Proxy), OE-02 (RBAC), OE-06 (Errores) |
| Capa de Integración | OE-01 (Integración API) |
| PostgreSQL local | OE-04 (Auditoría), OE-05 (Persistencia mínima) |
| Seguridad transversal | OE-02 (RBAC), RNF-01..RNF-07 |
| Documentación | OE-07 |

### 4.2. Alternativas Consideradas y Descartadas

| Alternativa | Razón de Descarte |
|---|---|
| PHP/Laravel como backend | Stack no unificado; mayor complejidad para equipo reducido. Se mantiene como fallback si la institución lo exige |
| Replicación completa de datos en BD local | Viola REST-04 y el principio de mínimo privilegio; innecesario dado que la API provee consulta en tiempo real. La BD local del SECCAP es exclusivamente operativa |
| GraphQL en lugar de REST | Complejidad adicional no justificada para un sistema de consulta con flujo predecible |
| MongoDB como BD local | No aporta ventaja sobre PostgreSQL para el modelo relacional requerido (usuarios, roles, auditoría) |
| Server-Side Rendering (SSR) | No se justifica; la aplicación es de uso interno con usuarios autenticados, no requiere SEO |

---

## 5. Observaciones

1. **Stack unificado TypeScript:** La decisión de usar TypeScript tanto en frontend como en backend reduce la fricción de desarrollo, permite compartir tipos/DTOs y simplifica la curva de aprendizaje para un equipo reducido.

2. **PostgreSQL sobre MySQL:** La elección se fundamenta en el mejor soporte nativo de JSON (para `filtros_json` en auditoría) y permisos más granulares. Sin embargo, MySQL es una alternativa viable si la infraestructura lo requiere.

3. **La arquitectura es sustituible en backend:** El diseño desacoplado (interfaz de adaptador, controladores independientes) permite migrar de Node.js a PHP sin afectar frontend ni modelo de datos. Esto mitiga el riesgo de VAC-06.

4. **Docker es recomendado pero no obligatorio:** Si la infraestructura institucional no soporta contenedores, el despliegue tradicional (PM2 + Nginx) es igualmente viable.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F10-01 | Confirmar si la infraestructura institucional soporta Node.js y/o Docker | Director de Proyecto + Área de Informática | **Crítica** |
| PEN-F10-02 | Obtener acceso a ambiente de staging/sandbox de la API (VAC-08) | Director de Proyecto | Alta |
| PEN-F10-03 | Definir el mecanismo de autenticación ante la API (VAC-03) | Equipo + Área de Informática | Alta |
| PEN-F10-04 | Evaluar si se requiere proxy reverso (Nginx) o si el backend sirve también los estáticos | Equipo | Baja |

---

## 7. Entregable Generado

**"Arquitectura Candidata y Stack Tecnológico"** — Documento `10_arquitectura_tecnologias.md`

Contenido:
- ✅ Estilo arquitectónico definido y justificado
- ✅ Diagrama de componentes (textual)
- ✅ Flujo general de una consulta (13 pasos)
- ✅ Stack frontend completo con justificación
- ✅ Stack backend con decisión y comparativa Node.js vs PHP
- ✅ Estrategia de persistencia local (PostgreSQL)
- ✅ Medidas de seguridad por capa
- ✅ Plan de despliegue por ambiente
- ✅ Alternativas descartadas con justificación

---

## 8. Próxima Fase Recomendada

**FASE 11 — Viabilidad**

Se evaluará la factibilidad técnica, económica, operativa, legal y medioambiental del proyecto.

> **Precondición:** Arquitectura definida. Para la viabilidad técnica se requiere conocer el stack propuesto (ya definido).
