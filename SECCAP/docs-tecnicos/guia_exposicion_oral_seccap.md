# Guía de Exposición Oral — SECCAP

> **Destinatario:** expositor del proyecto (alumno de PPS).
> **Objetivo:** permitir defender el sistema oralmente frente a docentes o evaluadores, explicando con claridad qué es, cómo está construido y por qué se tomaron las decisiones que se tomaron.
> **Uso:** leer, estudiar, y tener a mano como chuleta estructurada. No es un documento académico frío; está pensado para hablar.
> **Estilo:** cada sección explica primero en simple y después baja al código real de SECCAP. Los términos técnicos se definen la primera vez que aparecen.

---

## 1. Resumen ejecutivo del proyecto

SECCAP es una aplicación web institucional del Ejército que permite consultar de forma segura las **capacidades y aptitudes del personal** — formaciones militares, títulos civiles y acreditaciones de idioma — a partir de una API institucional de Recursos Humanos que es **solo de lectura** (Read-Only).

El sistema está pensado para que **distintos roles vean distinta información**: un consultor operativo ve los datos personales completos; un auditor ve la información agregada pero **sin DNI ni legajo**; un administrador tiene el superset de capacidades.

El producto funciona como **proxy seguro** entre los operadores y la API institucional. Nunca replica el padrón de personal en una base local: consulta en vivo, filtra, poda campos sensibles y audita.

En una sola frase: **SECCAP no es un sistema que guarde datos de personal; es un sistema que consulta, filtra, audita y devuelve.**

---

## 2. Qué problema resuelve SECCAP

### 2.1 El problema real

El área de Personal necesita que distintos operadores puedan buscar y filtrar capacidades y aptitudes del personal. Hoy esa información está en una base institucional estrictamente controlada, sin una interfaz moderna y sin control fino por rol. Esto genera tres problemas concretos:

1. **Exposición de información sensible** sin criterio por rol (por ejemplo, un auditor viendo DNI cuando no debería).
2. **Falta de trazabilidad** de quién consultó qué y cuándo.
3. **Riesgo de duplicar datos oficiales** fuera de la fuente autoritativa, con el consiguiente riesgo de desincronización.

### 2.2 Cómo lo resuelve SECCAP

SECCAP se inserta como capa intermedia:

- El **frontend** nunca habla con la API institucional directamente.
- El **backend** actúa como proxy: autentica al usuario, valida sus permisos, valida y traduce la consulta, pide los datos a la API externa, **poda** los campos que ese rol no puede ver, y **guarda un registro de auditoría** de esa operación.
- La **base de datos local** guarda solo lo que el sistema necesita para funcionar: usuarios, roles, permisos, sesiones, auditoría, configuración. **No** guarda el padrón.

### 2.3 Quiénes lo usan

Tres roles principales, definidos en [SECCAP/backend/prisma/seed.ts](../backend/prisma/seed.ts):

- **consultor**: operador habitual. Ve resultados completos con DNI y legajo, puede ver detalle y descargar certificados.
- **auditor**: ve resultados **sin DNI ni legajo**, no puede descargar certificados, y cuenta con el permiso `auditoria:leer` para consultar el log vía el endpoint backend `GET /auditoria`. **En esta entrega no existe una UI específica de auditoría en el frontend**; la lectura del log queda disponible a nivel API.
- **admin**: superset de permisos seedeado en la base (incluye `admin:usuarios`, `admin:roles`, `admin:config`). **En esta entrega no hay UI administrativa ni endpoints de administración expuestos**: administrar el sistema de forma visual u operativa queda como evolución futura documentada.

---

## 3. Visión general del sistema

SECCAP son tres piezas que corren como procesos separados:

1. **Frontend SPA** (Single Page Application) — [SECCAP/frontend/](../frontend/). Lo que ve el usuario en el navegador.
2. **Backend Proxy** — [SECCAP/backend/](../backend/). El intermediario seguro entre el frontend y la API externa.
3. **Mock API** — [SECCAP/mock-api/](../mock-api/). Un simulador local de la API institucional, usado **solo en desarrollo**.

Y dos almacenes:

4. **PostgreSQL local** — datos operativos del sistema (usuarios, roles, auditoría, configuración).
5. **API Institucional de RRHH** — la fuente oficial. En producción reemplaza al mock.

El usuario abre el frontend, inicia sesión, elige un tipo de formación, aplica filtros y recibe resultados. Internamente quien habló con la API institucional fue el backend, no el navegador.

---

## 4. Arquitectura general explicada simple

### 4.1 Qué es una arquitectura en capas

Una arquitectura en capas es cuando el sistema se organiza en niveles donde cada nivel solo le habla al siguiente, no a cualquiera. En SECCAP: el usuario habla con el frontend, el frontend habla con el backend, el backend habla con la API externa y con la base local. No hay atajos.

### 4.2 Cómo es en SECCAP

```
        [Navegador del usuario]
                   │   HTTPS
                   ▼
    [Frontend SPA — React + Vite]
                   │   HTTPS (axios → /api/*)
                   ▼
  [Backend Proxy — Node.js + Express]
      │              │                │
      ▼              ▼                ▼
 [PostgreSQL]   [API Externa RRHH]  [audit_log]
   (local)      (solo lectura)       (append-only)
```

### 4.3 Por qué esta arquitectura y no otra

Tres razones prácticas:

1. **Seguridad**: si el frontend llamara directo a la API externa, habría que entregarle credenciales al navegador. Malo. El proxy mantiene el secreto del lado del servidor.
2. **Control**: el proxy puede filtrar, podar y auditar. Un SPA directo contra la API externa no puede.
3. **Desacople**: si mañana cambia la API externa, solo cambia el backend. El frontend no se entera.

---

## 5. Capas y módulos del sistema

### 5.1 Capa de presentación (frontend)

Es lo que ve el usuario. Está en [SECCAP/frontend/src/](../frontend/src/).

- `pages/` — pantallas completas (login, home, consulta).
- `components/` — bloques reutilizables (drawer de detalle, botones, etc.).
- `layout/` — esqueleto común (AppShell).
- `auth/` — manejo de autenticación del lado cliente (AuthContext).
- `api/` — cliente HTTP hacia el backend (axios).
- `router/` — rutas de la SPA, con rutas protegidas.

### 5.2 Capa de aplicación (backend proxy)

Orquesta todo. Está en [SECCAP/backend/src/](../backend/src/).

- `routes/` — endpoints HTTP: [auth.ts](../backend/src/routes/auth.ts), [consulta.ts](../backend/src/routes/consulta.ts), [detalle.ts](../backend/src/routes/detalle.ts), [catalogos.ts](../backend/src/routes/catalogos.ts), [auditoria.ts](../backend/src/routes/auditoria.ts), [health.ts](../backend/src/routes/health.ts).
- `middleware/` — validaciones transversales: [authenticate.ts](../backend/src/middleware/authenticate.ts) (JWT + sesión) y [authorize.ts](../backend/src/middleware/authorize.ts) (permisos).
- `services/` — lógica de negocio: [external-api.ts](../backend/src/services/external-api.ts) (cliente HTTP al upstream), [mapper.ts](../backend/src/services/mapper.ts) (traducción snake_case → camelCase), [poda.ts](../backend/src/services/poda.ts) (quita campos sensibles), [auditoria.ts](../backend/src/services/auditoria.ts) (escribe registros).
- [prisma.ts](../backend/src/prisma.ts) — cliente de base de datos.
- [config.ts](../backend/src/config.ts) — lectura y validación de variables de entorno.

### 5.3 Capa de integración

Es el sub-módulo del backend que habla con la API externa. Físicamente vive en `services/external-api.ts` + `services/mapper.ts`. Se la llama **Anti-Corruption Layer** (ACL): si el proveedor externo cambia el shape de sus datos, el cambio queda contenido ahí y no se propaga al resto del sistema.

### 5.4 Capa de persistencia

PostgreSQL accedido vía Prisma. El schema está en [SECCAP/backend/prisma/schema.prisma](../backend/prisma/schema.prisma). Solo guarda datos operativos (ver sección 10).

### 5.5 Mock API

Proceso aparte, simulador del proveedor externo. Solo existe en desarrollo. Está en [SECCAP/mock-api/](../mock-api/).

---

## 6. Tecnologías utilizadas y dónde se aplican

El objetivo de esta sección es que el expositor pueda defender **por qué** cada tecnología está ahí.

### 6.1 Frontend

- **React 19** — biblioteca para construir interfaces compuestas por componentes. Se usa para que la UI esté hecha de piezas reutilizables (un filtro, un drawer, una tabla). Aparece en todo `src/pages/` y `src/components/`.
- **TypeScript** — JavaScript con tipos. Previene errores en tiempo de compilación. Todo el frontend es TS estricto.
- **Vite** — empaquetador y servidor de desarrollo moderno. En vez de Webpack, Vite levanta el entorno de dev casi instantáneo y compila la SPA para producción. Es el que corre `npm run dev`.
- **Tailwind CSS 4** — framework de estilos basado en clases utilitarias. Permite estilar escribiendo clases (`p-4 flex items-center`) directamente en el JSX.
- **Axios** — cliente HTTP. Se usa en [src/api/http.ts](../frontend/src/api/http.ts) para llamar al backend con manejo uniforme de errores.
- **React Router** — ruteo dentro del SPA. Se usa en [src/router/AppRouter.tsx](../frontend/src/router/AppRouter.tsx) para definir `/login`, `/app`, `/app/consulta`, etc., y para declarar rutas protegidas.
- **Lucide React** — íconos SVG livianos.
- **Vitest + Testing Library** — tests del frontend. Vitest es el runner, Testing Library simula un navegador (jsdom) y permite interactuar con la UI como un usuario. Los tests viven en `src/__tests__/*.test.tsx`.

### 6.2 Backend

- **Node.js 22** — motor de ejecución de JavaScript del lado servidor. Elegido porque permite compartir lenguaje con el frontend y tiene muy buen soporte de librerías para proxies.
- **Express 5** — framework HTTP minimalista. En [src/app.ts](../backend/src/app.ts) define la app, los middlewares globales y monta routers por feature.
- **TypeScript estricto** — igual que en el frontend, detecta errores antes de ejecutar.
- **Prisma 7** — ORM (Object-Relational Mapper). Traduce operaciones TypeScript a SQL parametrizado. El schema vive en `prisma/schema.prisma` y el cliente autogenerado en `src/prisma.ts`. Ventaja principal: **todas las consultas son parametrizadas, no se ejecuta SQL crudo interpolado**.
- **Zod** — librería de validación y parsing de datos. Se usa en `/auth/login` para validar el body antes de tocar la BD.
- **jsonwebtoken** — emite y verifica JWT. Se usa en `routes/auth.ts` y `middleware/authenticate.ts`.
- **helmet** — agrega headers HTTP de seguridad por default. Se aplica en `app.ts`.
- **cors** — controla qué origen web puede llamar al backend. Se configura con la variable `CORS_ORIGIN` (origen único, no comodín).
- **pino + pino-pretty** — logger JSON en producción, legible en desarrollo.
- **Vitest + Supertest** — tests backend. Supertest levanta la app en memoria y hace requests HTTP sin abrir un puerto real. Cubre smoke, contratos con el mock y auditoría crítica.

### 6.3 Base de datos

- **PostgreSQL 16** — motor relacional sólido y estándar. Corre como contenedor `seccap-pg`.

### 6.4 Documentación y diseño

- **PlantUML** — lenguaje de texto para describir diagramas UML. Los `.puml` de [UML/](../../UML/) se renderizan a imágenes, pero el fuente es texto versionable.
- **Markdown** — toda la documentación del proyecto: PMBOK (DOCUMENTOS/), anteproyecto (ANTEPROYECTO/), técnica (SECCAP/docs-tecnicos/), manuales (SECCAP/docs/).

### 6.5 Operación

- **PowerShell** — [scripts/qa-local.ps1](../../scripts/qa-local.ps1) corre el QA unificado (lint + type-check + prisma validate + tests) en Windows.

---

## 7. Explicación del backend

El backend es el corazón del sistema. Tres cosas clave para entenderlo.

### 7.1 Qué hace cada endpoint

- `GET /health` — dice si el backend y la BD están vivos. Sin autenticación (es para liveness / readiness).
- `POST /auth/login` — recibe usuario y contraseña, valida, crea sesión en BD, devuelve JWT y permisos.
- `POST /auth/logout` — revoca la sesión activa.
- `GET /auth/me` — devuelve el usuario actual, roles y permisos (lo usa el frontend al recargar).
- `GET /formacion/catalogos/*` — tipos, categorías militares, aptitudes, idiomas, niveles, instituciones. Alimenta los dropdowns del frontend.
- `GET /formacion/consulta` — ejecuta la consulta con filtros. **Requiere** `tipo_formacion`. Valida, llama al upstream, mapea, poda y audita.
- `GET /formacion/:id` — detalle de un registro.
- `GET /formacion/:id/certificado` — descarga del PDF respaldatorio. Requiere el permiso `consulta:certificado`.
- `GET /auditoria` — lista el log de auditoría (requiere el permiso `auditoria:leer`, asignado hoy al auditor y al admin). Es un endpoint **backend**; **no hay pantalla frontend** dedicada a esta operación en la entrega actual.

### 7.2 Cómo se protegen

Tres capas ordenadas:

1. **`authenticate`** verifica que haya un JWT válido **y** una sesión activa en la BD.
2. **`authorize(...permisos)`** verifica que el usuario tenga al menos uno de los permisos listados.
3. **Validación de entrada** dentro del handler (zod o regex + lista blanca) antes de tocar la BD o el upstream.

### 7.3 Cómo se manejan los errores

Hay un **error handler global** en `app.ts`. Cualquier excepción se convierte en JSON estable:

- 4xx → `{ error: 'Solicitud inválida' }` con `logger.warn`.
- 5xx → `{ error: 'Error interno del servidor' }` con `logger.error`.

**Nunca se envía el stack trace al cliente.** Esto es seguridad básica: no filtrar internals.

### 7.4 Cómo traduce errores del upstream

Si la API institucional se cae, el backend traduce:

- Timeout (10 s) → `504`.
- 5xx del upstream → `502`.
- 4xx del upstream → passthrough (se reenvía tal cual).

---

## 8. Explicación del frontend

### 8.1 Qué es una SPA

**SPA** = Single Page Application. El navegador carga una sola vez el bundle de JavaScript y después todo cambia sin recargar la página. React Router se encarga de cambiar las "páginas".

### 8.2 Cómo se arma SECCAP frontend

- [AppRouter.tsx](../frontend/src/router/AppRouter.tsx) define las rutas: `/login`, `/app` (protegida), `/app/consulta`, y `*` (404).
- `ProtectedRoute.tsx` impide acceder a `/app/*` sin autenticación válida.
- `AuthProvider` (en [auth/AuthContext.tsx](../frontend/src/auth/AuthContext.tsx)) es el "manager" de sesión: arranca leyendo el token de `localStorage`, lo valida contra `/auth/me`, y expone `login`, `logout`, `user`, `status`.
- [api/http.ts](../frontend/src/api/http.ts) configura axios para que agregue `Authorization: Bearer <token>` automáticamente.

### 8.3 Flujo de una consulta desde la UI

1. Usuario entra a `/app/consulta`.
2. `ConsultaPage.tsx` carga catálogos (tipos de formación, categorías militares, idiomas) pidiéndolos al backend.
3. Usuario elige `tipo_formacion` (obligatorio). Según esa elección, se habilitan otros filtros jerárquicos.
4. Usuario aprieta "Buscar". El frontend llama a `/formacion/consulta` con los filtros.
5. Se muestra una tabla con los resultados paginados.
6. Cliqueando un registro se abre un drawer lateral (`FormacionDetalleDrawer.tsx`) que pide el detalle y habilita la descarga del certificado si existe.

### 8.4 Cómo maneja los errores

`http.ts` expone una clase `ApiError` con `status` y `detail`. Las pantallas mapean esos códigos a mensajes amigables: 401 → "Iniciá sesión nuevamente", 403 → "No tenés permiso", 502/504 → "El servicio no está disponible".

---

## 9. Explicación de la base de datos

### 9.1 Qué guarda (y qué NO guarda)

La BD local guarda **solo datos operativos** ([schema.prisma](../backend/prisma/schema.prisma)):

- `sys_usuario` — usuarios del sistema SECCAP.
- `sys_rol` — roles (admin, consultor, auditor).
- `sys_permiso` — permisos atómicos.
- `sys_usuario_rol`, `sys_rol_permiso` — relaciones N:N.
- `sys_sesion` — sesiones activas (para poder revocar sin esperar a la expiración del JWT).
- `audit_log` — registros de auditoría, inmutables por convención.
- `sys_configuracion` — parámetros del sistema.
- `cache_catalogo` — tabla preparada para un eventual caché de catálogos (tabla existe en el schema; el caché aún no está implementado en runtime).

**Lo que NO guarda:** el padrón de personal. Eso vive en la API institucional.

### 9.2 Por qué es así

Si guardáramos el padrón, tendríamos que sincronizarlo. Sincronización = riesgo de quedar desactualizado, de filtrar datos y de duplicar esfuerzo con el sistema oficial. Al ir siempre al origen, el dato es fresco y la responsabilidad de calidad queda donde debe: en el sistema institucional.

### 9.3 Diagrama ER

Está en [UML/10_er_bd_local.puml](../../UML/10_er_bd_local.puml). Resumido para oral: "ocho tablas operativas, ninguna con datos del padrón de personal".

---

## 10. Explicación del mock-api

### 10.1 Qué es y qué no es

**Es**: un servidor Express separado que simula la API institucional de RRHH en desarrollo, con datos estáticos en memoria.

**No es**: parte del sistema productivo. En producción el backend apuntará a la API institucional real.

### 10.2 Para qué sirve

- Permite desarrollar **sin depender** del Área de Sistemas institucional.
- Permite simular errores con el header `X-Mock-Error: timeout|500|503` para probar el manejo de fallos del backend.
- Permite contrastar contratos: los tests de contrato del backend lo usan como fuente real.

### 10.3 Dónde vive

[SECCAP/mock-api/src/app.ts](../mock-api/src/app.ts) y [src/routes/formaciones.ts](../mock-api/src/routes/formaciones.ts). Expone:

- `/externa/v1/health`.
- `/externa/v1/catalogos/*`.
- `/externa/v1/formaciones` (consulta con filtros).
- `/externa/v1/formaciones/:id` (detalle).
- `/externa/v1/formaciones/:id/certificado` (PDF simulado).

---

## 11. Lógica de negocio principal

### 11.1 Regla central (RN-01)

`tipo_formacion` es obligatorio en toda consulta. Se valida en tres lugares: UI, proxy y mock. Se explica fácil: *"nunca podés pedir todos los registros sin decir de qué tipo"*.

### 11.2 Filtros jerárquicos

Los filtros **dependen** entre sí:

- **Militar**: primero elegís `categoria_militar`, y eso habilita `aptitud_capacitacion`.
- **Idioma**: primero `idioma`, eso habilita `institucion`; `nivel_idioma` es opcional e independiente.
- **Civil**: no hay filtros adicionales en esta entrega (limitación conocida VAC-01, catálogo civil pendiente institucionalmente).

### 11.3 Poda de datos sensibles

Implementada en [services/poda.ts](../backend/src/services/poda.ts). `CAMPOS_SENSIBLES = ['dni', 'legajo']`. Si el usuario tiene el permiso `consulta:detalle`, ve todo. Si no, se eliminan esos dos campos del DTO antes de responder. Esto es lo que diferencia al **consultor** del **auditor**.

### 11.4 Auditoría

Todo lo importante queda registrado en `audit_log`: quién, cuándo, qué endpoint, qué filtros aplicó, qué status HTTP volvió, cuántos registros devolvió, cuánto tardó, IP y user-agent. El módulo ([services/auditoria.ts](../backend/src/services/auditoria.ts)) está diseñado para **nunca romper el flujo**: si no puede escribir el log, lo registra en el logger y sigue.

### 11.5 Sesión y expiración

El JWT dura 8 horas por default. Pero además, cada login crea un registro en `sys_sesion`. El middleware `authenticate` valida las dos cosas: JWT válido **y** sesión `activa` y no expirada en la BD. Esto permite **revocar sesiones** sin esperar la caducidad natural del token.

### 11.6 Bloqueo por intentos fallidos

5 intentos fallidos → 30 minutos bloqueado. Implementado en [routes/auth.ts](../backend/src/routes/auth.ts) con el contador `intentos_fallidos` y `bloqueado_hasta` en `sys_usuario`. Protege frente a ataques de diccionario contra un usuario conocido.

### 11.7 Roles y permisos (seed)

Del [seed.ts](../backend/prisma/seed.ts):

- **consultor**: `consulta:leer`, `consulta:detalle`, `consulta:certificado`, `catalogos:leer`.
- **auditor**: `consulta:leer`, `catalogos:leer`, `auditoria:leer` (sin detalle → sin DNI/legajo, sin certificado).
- **admin**: superset de permisos (incluye `admin:usuarios`, `admin:roles`, `admin:config`). Estos permisos quedaron **seedeados** pero **en esta entrega no hay ni UI administrativa ni endpoints backend de administración expuestos**. Administrar el sistema queda fuera de alcance, documentado como evolución futura. En la práctica, hoy el admin se diferencia del consultor solo por ser un superset de capacidades operativas sobre la consulta y la auditoría.

---

## 12. Seguridad informática aplicada

SECCAP no tiene una única funcionalidad de seguridad: tiene **varias capas superpuestas**.

### 12.1 Autenticación con JWT y sesión

**JWT** = JSON Web Token. Un token firmado que incluye la identidad del usuario. Se firma con un secreto (`JWT_SECRET`) y se verifica en cada request. Si alguien lo modifica, la firma no valida.

**Por qué además hay sesión en BD**: para poder revocar. Un JWT puro no se puede invalidar antes de que expire. Si guardamos la sesión y la marcamos `activa=false`, el middleware rechaza el request aunque el JWT siga técnicamente vigente.

### 12.2 RBAC

**RBAC** = Role-Based Access Control. No se le dan permisos directos a los usuarios: se les dan **roles**, y los roles tienen **permisos**. Los permisos son strings cortos como `consulta:leer`, `consulta:detalle`, `consulta:certificado`, `auditoria:leer`.

El middleware `authorize('consulta:leer')` corta el request con `403` si el usuario no tiene ese permiso.

### 12.3 Poda de datos sensibles

Ver 11.3. Es RBAC llevado al nivel de los **campos** devueltos, no solo al del endpoint.

### 12.4 Auditoría

Ver 11.4. El log es append-only. Por convención documentada en el schema, no se permite UPDATE/DELETE sobre `audit_log`. El hardening a nivel de permisos de BD queda como mejora futura documentada.

### 12.5 Validación de entradas

Todos los filtros de `/formacion/consulta` pasan por regex y lista blanca antes de llegar al upstream. Un valor que no matchea se rechaza con 400. Esto protege contra inyecciones (aunque Prisma ya parametriza) y contra abusos del upstream.

### 12.6 Manejo de errores sin filtrar internals

El error handler global nunca devuelve `err.stack` ni `err.message` crudo al cliente. Solo códigos genéricos y mensajes estables.

### 12.7 Headers de seguridad

`helmet()` aplica defaults: `X-Content-Type-Options`, `X-DNS-Prefetch-Control`, `Strict-Transport-Security`, etc.

### 12.8 CORS restringido

Origen único configurable por `CORS_ORIGIN`. Sin comodines.

### 12.9 Bloqueo por intentos fallidos

Ver 11.6.

### 12.10 Riesgos pendientes / limitaciones reconocidas

El expositor debe conocer estas limitaciones **porque probablemente las pregunten**:

1. **Hash de contraseña SHA-256 sin sal**. Documentado en [DOCUMENTOS/12_cierre.md](../../DOCUMENTOS/12_cierre.md). En producción real se migra a bcrypt o argon2.
2. **`JWT_SECRET` placeholder**. El `.env.example` deja un valor dummy. En producción, el Área de Sistemas debe proveer el secreto real. El backend ya valida que el secreto tenga al menos 16 caracteres al arrancar y falla si no es así.
3. **Sin rate limiting HTTP global**. Hay bloqueo por usuario pero no por IP en `/auth/login`. Documentado como mejora para pase a producción.
4. **Token en `localStorage`**. Decisión de diseño consciente; riesgo real ante XSS, que hoy no existe (React escapa por default, no hay `dangerouslySetInnerHTML`, no se renderiza HTML desde el backend).

Estas limitaciones **no son defectos del producto**: son dependencias institucionales y decisiones de alcance documentadas con transparencia.

---

## 13. UML explicado para exposición oral

Todos los diagramas están en [UML/](../../UML/) como archivos `.puml` (PlantUML, texto plano versionable).

### 13.1 Casos de uso — [01_casos_uso_general.puml](../../UML/01_casos_uso_general.puml)

Muestra los actores (Usuario genérico, Admin, Consultor, Auditor, API Institucional, Módulo de Auditoría) y los casos de uso (iniciar sesión, aplicar filtros, ejecutar consulta, ver detalle, descargar documento, consultar logs, gestionar usuarios, verificar estado, registrar auditoría).

**Cómo explicarlo en oral:** *"Este diagrama describe el alcance conceptual del sistema, no solo lo entregado. Muestra que el Consultor y el Admin pueden consultar y ver detalle; que el Auditor, además de consultar, tiene el permiso para leer el log de auditoría; y que toda consulta incluye auditoría automática, representada como `<<include>>`. En la entrega actual, los casos de uso de consultar logs y gestionar usuarios existen a nivel modelo: 'consultar logs' está cubierto por el endpoint backend `GET /auditoria` sin UI propia, y 'gestionar usuarios' queda como alcance futuro."*

### 13.2 Clases de análisis — [02_clases_analisis_bce.puml](../../UML/02_clases_analisis_bce.puml)

Aplica el patrón **BCE**: Boundary (lo que ve el usuario), Control (los controladores), Entity (las entidades del dominio), Integration (adaptadores a sistemas externos).

**Cómo explicarlo:** *"No es un diagrama de clases de implementación. Es el análisis. Ayuda a pensar las responsabilidades sin comprometerse con un lenguaje particular. Después, en la implementación real, estas responsabilidades se distribuyen entre React (boundary), los handlers de Express (control), los modelos de Prisma (entity) y los services de integración — external-api + mapper — (integration)."*

### 13.3 Secuencia de login — [03_secuencia_login.puml](../../UML/03_secuencia_login.puml)

Muestra el intercambio de mensajes: navegador → backend → BD → navegador. Incluye validación de password, incremento de `intentos_fallidos`, creación de `sys_sesion`, emisión del JWT.

### 13.4 Secuencia de consulta — [04_secuencia_ejecutar_consulta.puml](../../UML/04_secuencia_ejecutar_consulta.puml) y [08_secuencia_consulta_auditoria.puml](../../UML/08_secuencia_consulta_auditoria.puml)

El primero muestra la consulta feliz. El segundo incluye explícitamente la auditoría. Para la exposición alcanza con narrar el segundo.

### 13.5 Actividad — [05_actividad_flujo_consulta.puml](../../UML/05_actividad_flujo_consulta.puml)

Diagrama de flujo operacional de una consulta: autenticar → autorizar → validar filtros → llamar upstream → mapear → podar → auditar → responder.

### 13.6 Componentes — [06_componentes_arquitectura.puml](../../UML/06_componentes_arquitectura.puml)

La vista técnica de la arquitectura. Muestra frontend, backend, capa de integración, BD local y API externa. Este es **el más útil** para la defensa oral porque visualiza de un golpe la arquitectura completa.

### 13.7 Despliegue — [07_despliegue_logico.puml](../../UML/07_despliegue_logico.puml)

Muestra cómo se distribuye el sistema en nodos: cliente (navegador), servidor web con frontend estático, servidor de aplicación con backend, PostgreSQL, API institucional.

### 13.8 Descarga de documento — [09_secuencia_descarga_documento.puml](../../UML/09_secuencia_descarga_documento.puml)

Flujo específico de descarga del certificado, con el permiso `consulta:certificado` validado antes del pase al upstream y con la auditoría del intento.

### 13.9 ER BD local — [10_er_bd_local.puml](../../UML/10_er_bd_local.puml)

Modelo entidad-relación de la base local. Sirve para defender "qué se guarda": usuarios, roles, permisos, sesiones, auditoría, configuración, cache. **Nada del padrón.**

### 13.10 Cómo se relaciona UML, requisitos y código

- Los **requisitos** de [DOCUMENTOS/09_requisitos.md](../../DOCUMENTOS/09_requisitos.md) se reflejan en los **casos de uso** (01).
- El **diagrama de componentes** (06) se mapea 1:1 con las carpetas de `SECCAP/backend/src/`.
- El **ER** (10) se mapea con `prisma/schema.prisma`.
- Las **secuencias** (03, 04, 08, 09) se pueden recorrer abriendo `routes/auth.ts` y `routes/consulta.ts`.
- Los **casos de uso** tienen su reflejo directo en las rutas del frontend ([AppRouter.tsx](../frontend/src/router/AppRouter.tsx)) y los permisos del seed.

Si un evaluador pregunta *"¿el UML sirve o es decoración?"*, la respuesta honesta es: **los diagramas se mantienen alineados al código real**. El diagrama de componentes es la guía de arquitectura que se siguió al implementar.

---

## 14. Flujo completo de uso del sistema

Este apartado es clave para defender oralmente. El expositor debería poder narrar una consulta de punta a punta.

### 14.1 Login

1. Usuario abre `/login` en el navegador.
2. Ingresa usuario y contraseña.
3. El frontend hace `POST /auth/login` con body JSON.
4. El backend valida con zod, hashea la contraseña con SHA-256 (hoy) y compara contra `sys_usuario.password_hash`.
5. Si coincide: resetea `intentos_fallidos`, crea un registro en `sys_sesion` con `token_hash` y `expira_en = now + 8h`, firma un JWT con `sub`, `username`, `sessionId`, y responde `{ token, user: { id, username, roles, permisos } }`.
6. El frontend guarda el token en `localStorage` y setea el header `Authorization` por default en axios.
7. El router redirige a `/app`.

### 14.2 Consulta

1. Usuario va a `/app/consulta`.
2. `ConsultaPage.tsx` pide catálogos al backend.
3. El backend valida auth + permiso `catalogos:leer`, llama a `/externa/v1/catalogos/*` y devuelve JSON.
4. Usuario elige `tipo_formacion` y filtros. Aprieta "Buscar".
5. El frontend llama a `GET /formacion/consulta?tipo_formacion=militar&categoria_militar=...`.
6. El backend: `authenticate` valida JWT + sesión → `authorize('consulta:leer')` valida permiso → `validarFiltros` valida cada filtro con regex y lista blanca.
7. `fetchExterna` llama al upstream con timeout de 10 s.
8. Respuesta del upstream → `mapper` (snake_case → camelCase) → `podar` (quita `dni` y `legajo` si no tiene `consulta:detalle`) → `registrarAuditoria` (append-only) → respuesta al cliente.
9. El frontend muestra la tabla paginada.

### 14.3 Detalle

1. Usuario hace clic en una fila.
2. `FormacionDetalleDrawer` abre y llama a `GET /formacion/:id`.
3. El backend autentica, autoriza `consulta:leer`, mapea, poda y audita.
4. Se muestra el detalle. Si el registro tiene certificado y el usuario tiene `consulta:certificado`, aparece el botón de descarga.

### 14.4 Descarga de certificado

1. Usuario aprieta "Descargar certificado".
2. El frontend llama a `GET /formacion/:id/certificado`.
3. El backend autentica, valida **inline** el permiso `consulta:certificado` (para que el 403 quede auditado explícitamente).
4. Si pasa, `fetchExternaRaw` pide el PDF al upstream; se reenvían `Content-Type` y `Content-Disposition`.
5. Se registra auditoría con el status correspondiente.
6. El navegador dispara la descarga.

### 14.5 Auditoría

La auditoría tiene dos caras que conviene distinguir bien al exponer:

**Auditoría automática (activa hoy, transversal a toda consulta).** Cada llamada a `/formacion/consulta`, `/formacion/:id` y `/formacion/:id/certificado` genera un registro en `audit_log` con quién, cuándo, qué endpoint, filtros aplicados, status HTTP, cantidad de registros, duración, IP y user-agent. Es append-only y no bloquea el flujo si falla. Esta parte no requiere ninguna acción del operador: corre sola en el proxy.

**Lectura del log de auditoría (disponible solo vía API en esta entrega).** Existe el endpoint backend `GET /auditoria`, protegido por el permiso `auditoria:leer`, que acepta filtros validados con regex y lista blanca (acción, resultado, rangos de fechas, usuario, endpoint) y devuelve el log paginado. **El frontend entregado no incluye una pantalla específica de auditoría**: las rutas expuestas por `AppRouter.tsx` son únicamente `/login`, `/app` y `/app/consulta`. Consumir `GET /auditoria` hoy se hace con un cliente HTTP autenticado (por ejemplo, herramientas como `curl` o Postman con un JWT válido de un usuario con el permiso), y la UI específica queda como evolución futura documentada.

---

## 15. Cómo explicar el proyecto en una exposición oral

### 15.1 Orden recomendado

1. **Qué es SECCAP** (30 s): una frase clara sobre el problema y la solución.
2. **Arquitectura** (2 min): mostrar el diagrama de componentes y narrar.
3. **Stack** (1 min): React, Express, Prisma, PostgreSQL, una línea por tecnología.
4. **Flujo de consulta** (3 min): narrar el flujo 14.2 de principio a fin.
5. **Seguridad** (3 min): autenticación → RBAC → poda → auditoría.
6. **UML** (2 min): qué diagrama sirvió para qué.
7. **Limitaciones reconocidas** (1 min): SHA-256, secret placeholder. Mostrar que se conocen.
8. **Cierre** (30 s): "sistema Read-Only, proxy seguro, auditable, alineado al alcance y listo para endurecimiento institucional".

### 15.2 Qué decir primero

Lo peor es arrancar con *"es una aplicación hecha en React con Express"*. Arrancá con el **problema**: *"Hay un área que necesita consultar capacidades y aptitudes del personal con distintos niveles de visibilidad según el rol, sin replicar el padrón oficial. Ese es el problema que SECCAP resuelve."*

### 15.3 Cómo explicar la arquitectura sin trabarse

Usá una sola figura en la cabeza: **tres cajas y dos flechas**. Frontend → Backend → {API externa, BD local}. Todo el resto se cuelga de ahí.

### 15.4 Cómo defender por qué hay proxy backend

- *"Si el frontend llamara directo a la API institucional, tendría que tener sus credenciales en el navegador. No se puede."*
- *"El proxy es el único lugar donde se puede podar información sensible según rol antes de devolverla."*
- *"El proxy es el único lugar donde podemos auditar de manera confiable."*

### 15.5 Cómo defender por qué no se guarda el padrón localmente

- *"El dato oficial es de otro sistema. Duplicarlo genera riesgo de desincronización."*
- *"Al consultar en vivo la API, siempre devolvemos el estado actual."*
- *"Guardar menos es un principio de seguridad: si se compromete nuestra BD, no se filtra el padrón."*

### 15.6 Cómo defender seguridad y auditoría

- *"Autenticación: JWT firmado **más** sesión en BD revocable."*
- *"Autorización: RBAC con permisos atómicos, no roles hardcodeados en los handlers."*
- *"Poda de campos por rol, no solo por endpoint."*
- *"Auditoría obligatoria y no bloqueante: toda consulta queda registrada, y si el log falla, no se corta la operación."*
- *"Bloqueo por intentos fallidos."*
- *"Errores sin stack al cliente."*
- *"Filtros validados con regex y lista blanca."*

### 15.7 Errores comunes al exponer este proyecto

- **Arrancar con el stack tecnológico** en vez de con el problema.
- **Decir que "no tiene vulnerabilidades"**: sí tiene limitaciones conocidas (SHA-256, secret placeholder), y reconocerlas da más confianza que negarlas.
- **Mezclar mock-api con sistema productivo**: el mock es solo de desarrollo.
- **Sobrevender**: SECCAP no es un ERP ni un sistema administrativo completo; es un proxy seguro de consulta.
- **No saber explicar qué es un JWT** si te preguntan. Prepará una frase: *"Un JWT es un token firmado con un secreto del servidor; el cliente lo manda en cada request y el servidor verifica la firma sin tener que consultar la BD en cada request."*
- **Confundir autenticación con autorización**. Autenticación = *quién sos*. Autorización = *qué podés hacer*.

---

## 16. Guion sugerido de 10 a 15 minutos

**Minuto 0:00 – 1:00 — Apertura**

> Buenas tardes. Les presento SECCAP, el Sistema de Consulta Segura de Capacidades y Aptitudes del Personal. Es una aplicación web pensada para que operadores del Área de Personal consulten formaciones militares, civiles e idiomáticas del personal, con control fino por rol y trazabilidad completa, sin replicar el padrón oficial en ninguna base local.

**Minuto 1:00 – 3:00 — Problema y contexto**

> La información oficial del personal vive en un sistema institucional de RRHH, accesible vía API Read-Only. Hoy distintos roles necesitan consultar esos datos con distintos niveles de visibilidad: un consultor operativo ve DNI y legajo, un auditor ve el agregado sin datos personales identificables y además tiene habilitado el permiso para leer el log de auditoría a nivel API, y un administrador queda definido como superset de permisos, a la espera de una UI administrativa que está fuera del alcance de esta entrega. Además, toda consulta debe quedar trazada automáticamente. Ese es el problema que SECCAP resuelve.

**Minuto 3:00 – 5:30 — Arquitectura**

> *(Mostrar `UML/06_componentes_arquitectura.puml`.)* El sistema tiene tres piezas: frontend SPA en React, backend proxy en Node/Express, y base de datos local PostgreSQL. En desarrollo hay un mock-api que simula la API institucional. En producción, el backend apuntará a la API real. El frontend **nunca** llama a la API externa; todo pasa por el proxy. Esto por tres razones: seguridad (credenciales no viajan al navegador), control (el proxy puede filtrar, podar y auditar) y desacople (si cambia la API externa, solo cambia el backend).

**Minuto 5:30 – 8:30 — Flujo de consulta end-to-end**

> Voy a narrar una consulta completa. El usuario hace login, el backend valida usuario y contraseña, crea una sesión en BD y devuelve un JWT. El usuario entra a la pantalla de consulta, elige un tipo de formación (es obligatorio), aplica filtros jerárquicos, y ejecuta. El backend autentica el JWT y la sesión, valida el permiso `consulta:leer`, valida cada filtro con regex y lista blanca, llama al upstream con timeout de 10 segundos, mapea el JSON externo a camelCase interno, poda los campos `dni` y `legajo` si el usuario no tiene el permiso `consulta:detalle`, registra la auditoría con quién, qué filtros, qué status y cuántos registros, y devuelve la respuesta paginada. Eso es lo que pasa en una sola consulta.

**Minuto 8:30 – 10:30 — Seguridad**

> La seguridad no es una feature sino varias capas. Autenticación con JWT más sesión en BD revocable. Autorización con RBAC: los usuarios tienen roles, los roles tienen permisos atómicos como `consulta:leer` o `consulta:certificado`. Poda de datos sensibles por rol. Auditoría inmutable y no bloqueante. Validación estricta de entradas. Error handler global que no filtra stack traces. Bloqueo por intentos fallidos — 5 intentos, 30 minutos. Hay dos limitaciones institucionales documentadas que menciono por honestidad: el hash de contraseña es SHA-256 sin sal, a migrar a bcrypt antes de producción, y el secret del JWT es placeholder, a proveer por el Área de Sistemas en deploy.

**Minuto 10:30 – 12:00 — Calidad y testing**

> El proyecto tiene QA automatizado con 101 tests en backend y 28 en frontend, todos en verde. Cubren autenticación, consulta con filtros válidos e inválidos, traducción de errores del upstream, poda por rol, auditoría crítica, y el frontend tiene tests de router, rutas protegidas, consulta y descarga. Hay un script unificado `qa-local.ps1` que corre lint, type-check, prisma validate y tests en los tres módulos.

**Minuto 12:00 – 14:00 — UML y documentación**

> Hay 10 diagramas UML en formato PlantUML versionado: casos de uso, clases BCE, secuencias de login y consulta, actividad, componentes, despliegue, descarga, y ER de la BD local. Los diagramas están alineados al código: el de componentes se mapea con la estructura de carpetas del backend, y el ER se mapea con el schema de Prisma. La documentación PMBOK está completa en `DOCUMENTOS/` y hay un cuaderno de coordinación `COORDINACION_IA.md` que registra las iteraciones del proyecto.

**Minuto 14:00 – 15:00 — Cierre**

> Para cerrar: SECCAP es un proxy seguro de consulta Read-Only, con arquitectura proporcional al alcance, seguridad multicapa, lógica de negocio consistente entre UI, proxy y mock, QA automatizado y documentación alineada. Las limitaciones conocidas son dependencias institucionales, no defectos del producto. Muchas gracias.

---

## 17. Preguntas posibles del jurado y respuestas sugeridas

### 17.1 *"¿Por qué no usaste microservicios?"*

> Porque el dominio es acotado: consultar, filtrar, podar, auditar. Microservicios agregan complejidad operativa (red, orquestación, tracing distribuido) sin beneficio en un sistema de tres componentes cohesivos. La arquitectura actual respeta el principio de proporcionalidad al problema.

### 17.2 *"¿Por qué SHA-256 y no bcrypt?"*

> Es una limitación reconocida y documentada en el cierre del proyecto. El alcance aprobado era desarrollo con datos simulados, no deploy a producción institucional. La migración a bcrypt está explícitamente pendiente como condición de pase a producción, y no requiere cambios de schema — solo reemplazar la función de hash.

### 17.3 *"¿Qué pasa si se cae la API externa?"*

> El backend captura el error. Si es timeout, devuelve 504. Si es 5xx del upstream, devuelve 502. Si es 4xx, pasa el código original. En todos los casos la operación se registra en auditoría con el status correspondiente, y el frontend muestra un mensaje amigable. Hay tests de contrato que cubren esos casos.

### 17.4 *"¿Por qué guardan sesiones en BD si ya hay JWT?"*

> Porque un JWT puro no se puede revocar antes de su expiración natural. Tener la sesión en BD nos permite invalidarla por logout explícito o por revocación técnica del registro de sesión sin esperar a que venza el token. El middleware valida las dos cosas: firma del JWT y estado activo en la BD.

### 17.5 *"¿Qué previene SQL injection?"*

> Prisma, el ORM. Todas las consultas a BD se hacen con operaciones tipadas (`findMany`, `findUnique`, `create`, `update`) que generan SQL parametrizado. No hay string interpolation hacia la BD. Además, los filtros de la API se validan con regex y lista blanca antes de llegar a Prisma.

### 17.6 *"¿Cómo saben que el auditor realmente no ve DNI?"*

> Hay un test automatizado explícito en `backend/src/__tests__/consulta.test.ts` que loguea como auditor, ejecuta una consulta y verifica que los campos `dni` y `legajo` no están en el DTO devuelto. La poda es una capa independiente del mapeo, en `services/poda.ts`, con una única fuente de verdad: `CAMPOS_SENSIBLES = ['dni', 'legajo']`.

### 17.7 *"¿Qué pasa si alguien modifica la tabla de auditoría?"*

> La tabla es inmutable por convención documentada en el schema. El código solo hace INSERT. Como mejora de endurecimiento antes de producción, se puede revocar los permisos UPDATE y DELETE a nivel del usuario de BD de la aplicación. Hoy la protección es por código y por acuerdo operativo, lo cual es proporcional al alcance académico.

### 17.8 *"¿Por qué React y no un framework más liviano?"*

> React tiene el ecosistema más grande, soporte institucional de largo plazo, y el equipo humano que va a mantener el sistema probablemente lo conoce. Las instrucciones de proyecto lo pedían explícitamente. Alternativas como Svelte o Vue serían válidas, pero no agregaban valor diferencial aquí.

### 17.9 *"¿Y si mañana el Área de Sistemas cambia la API institucional?"*

> El impacto queda contenido en la capa de integración (`services/external-api.ts` y `services/mapper.ts`). El resto del backend y todo el frontend se mantienen. Hay tests de contrato que van a fallar rápido si cambia el shape del upstream, lo cual es una alerta temprana.

### 17.10 *"¿Es seguro guardar el token en localStorage?"*

> Es una decisión de diseño consciente, aceptada para el alcance actual. El riesgo real es una vulnerabilidad XSS en el frontend, que hoy no existe: React escapa por default, no usamos `dangerouslySetInnerHTML`, y no renderizamos HTML proveniente del backend. La alternativa — httpOnly cookie más protección CSRF — es más segura pero agrega complejidad significativa y se puede considerar si el sistema se abre a internet público.

### 17.11 *"¿Por qué no cachean los catálogos?"*

> La tabla `cache_catalogo` existe en el schema como preparación, pero la implementación se dejó fuera del alcance inicial. Agregar caché implica definir política de invalidación, TTLs y tests, y hoy no hay presión de latencia que lo justifique. Es una mejora planificada, no un olvido.

### 17.12 *"¿El rol admin tiene UI?"*

> No en esta entrega. En producción el admin hoy funciona como un **superset de permisos** sobre las mismas pantallas operativas del consultor y sobre el endpoint backend de auditoría; no hay pantallas ni endpoints de administración expuestos. Los permisos `admin:usuarios`, `admin:roles` y `admin:config` están seedeados para cuando se implemente la UI administrativa, documentada explícitamente como alcance futuro en `DOCUMENTOS/12_cierre.md`. La decisión fue priorizar las capacidades de consulta y de auditoría automática que constituyen el núcleo del sistema.

### 17.13 *"¿Cómo probaron que todo el flujo anda?"*

> Tres niveles de tests: smoke tests in-process que levantan la app sin servicios externos, tests de contrato que validan la forma de las respuestas contra el mock, y tests de integración que conectan realmente a PostgreSQL y al mock-api. El `qa-local.ps1` corre los tres niveles más lint y type-check en un solo comando.

### 17.14 *"¿Qué mejorarían si pudieran?"*

> Cuatro cosas priorizadas: (1) migrar a bcrypt; (2) agregar rate limiting en `/auth/login`; (3) auditar el propio endpoint de auditoría (hoy no queda registro cuando un auditor consulta el log); (4) parametrizar el timeout upstream vía configuración. Todo está listado en el análisis integral del repositorio.

### 17.15 *"¿Cuál es la diferencia entre autenticación y autorización?"*

> Autenticación es saber **quién sos** — la valida el login con usuario y contraseña y se materializa en el JWT. Autorización es saber **qué podés hacer** — la valida el middleware `authorize` contra tus permisos. Primero siempre autenticás; después autorizás para cada acción.

### 17.16 *"¿Por qué pueden los tres roles leer catálogos?"*

> Porque los catálogos son información no sensible (tipos, idiomas, niveles, instituciones). Los tres roles los necesitan para poder armar una consulta. Lo que se restringe no son los catálogos, sino los datos personales del resultado.

---

## 18. Conclusión final para defensa oral

SECCAP es un sistema acotado, consistente y bien documentado, que resuelve un problema real del Área de Personal: consultar capacidades y aptitudes con control por rol y trazabilidad completa, sin replicar el padrón oficial.

La arquitectura es proporcional: tres componentes cohesivos, cero sobreingeniería. La seguridad está aplicada en capas independientes. La lógica de negocio está validada en tres lugares (UI, proxy, mock). El QA está automatizado y en verde. La documentación PMBOK está completa y alineada al código.

Las limitaciones conocidas — hash de contraseña y secret placeholder — son **condiciones de pase a producción institucional**, no defectos del producto entregado, y están documentadas con transparencia.

El expositor que entienda bien la arquitectura de componentes, el flujo de una consulta de punta a punta, y las capas de seguridad, tiene todo lo necesario para defender el trabajo frente a cualquier evaluador técnico.

---

*Guía preparada para exposición oral del proyecto SECCAP.*
