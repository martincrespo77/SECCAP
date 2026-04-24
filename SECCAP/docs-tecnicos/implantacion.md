# Implantación SECCAP — Guía Técnica

Fase 6. Documento operativo para poner en marcha el sistema SECCAP en un entorno local validado, y preparar el pase a un entorno institucional real cuando el Área de Sistemas lo autorice.

No reemplaza la futura guía de despliegue productivo (cuando haya servidor, dominio y API institucional reales); documenta el estado implementado y validado hasta Fase 5.3.

## 1. Alcance

Cubre los tres componentes del monorepo bajo `SECCAP/`:

- `SECCAP/backend` — proxy Node 22 + Express 5 + Prisma + PostgreSQL.
- `SECCAP/frontend` — SPA React 19 + Vite 6 + Tailwind.
- `SECCAP/mock-api` — simulador de la API institucional del Área de Personal (solo entorno de desarrollo/pruebas).

Fuera de alcance en este documento:

- Pase a producción institucional real.
- Firma de aceptación del cliente y patrocinio formal (pendiente humano, ver `DOCUMENTOS/12_cierre.md`).
- Integración con la API institucional real (a definir cuando se firme el contrato de integración).

## 2. Prerrequisitos

| Recurso | Versión / Estado | Observación |
|---|---|---|
| Node.js | 22.x LTS | Requerido en backend, frontend y mock-api |
| npm | 10.x+ | En PATH |
| PostgreSQL | 16.x | En desarrollo se usa contenedor `seccap-pg` |
| Docker Desktop | opcional | Solo para levantar PostgreSQL containerizado |
| PowerShell | 5.1 o 7+ | Scripts de QA/estado están en PowerShell |

Variables de entorno: ver `SECCAP/.env.example`. Se copia a `SECCAP/.env` y se ajustan valores. `JWT_SECRET` tiene validación de arranque: el backend no inicia si el secreto está vacío o tiene menos de 16 caracteres.

## 3. Orden de arranque

En desarrollo local, los servicios se levantan en este orden:

1. PostgreSQL (contenedor `seccap-pg` o servicio local en `localhost:5432`).
2. Mock-api (`SECCAP/mock-api`, puerto `3002`).
3. Backend proxy (`SECCAP/backend`, puerto `3001`).
4. Frontend (`SECCAP/frontend`, puerto `5173`).

Comandos por servicio (PowerShell):

```powershell
# 1. PostgreSQL vía Docker (si no está corriendo)
docker start seccap-pg

# 2. Mock API
Push-Location SECCAP/mock-api; npm run dev; Pop-Location

# 3. Backend
Push-Location SECCAP/backend; npm run dev; Pop-Location

# 4. Frontend
Push-Location SECCAP/frontend; npm run dev; Pop-Location
```

Equivalente Bash documentado en [SECCAP/README.md](../README.md).

## 4. Preparación de la base local

La BD local no replica datos de personal. Solo contiene usuarios del sistema, roles, permisos, sesiones, auditoría, configuración y caché de catálogos.

Desde `SECCAP/backend`:

```powershell
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones (crea tablas)
npm run db:migrate:deploy

# Cargar datos base (permisos, roles, usuarios de desarrollo)
npm run db:seed
```

El seed es idempotente (usa `upsert`), se puede reejecutar.

Usuarios creados por el seed (solo desarrollo):

| Username | Rol | Password inicial |
|---|---|---|
| `admin` | admin (9 permisos) | `admin123` |
| `consultor` | consultor (4 permisos) | `consultor123` |
| `auditor` | auditor (3 permisos) | `auditor123` |

> Advertencia: estos usuarios y sus passwords son únicamente para entorno de desarrollo. En un entorno institucional real deben reemplazarse por altas reales y el hash debe migrarse de SHA-256 a bcrypt/argon2 (ver limitaciones conocidas).

## 5. Build del frontend

Desde `SECCAP/frontend`:

```powershell
npm run build
```

Genera `SECCAP/frontend/dist/`. Esos estáticos se sirven:

- En desarrollo: `npm run dev` (Vite dev server con proxy `/api/*` hacia backend).
- En producción institucional: se publicarán desde el servidor web que defina el Área de Sistemas (Apache/Nginx). El artefacto es únicamente HTML/CSS/JS estático.

El frontend toma `VITE_BACKEND_URL` si está definida; si no, usa `/api` en desarrollo y `http://localhost:3001` como fallback. En producción deberá fijarse `VITE_BACKEND_URL` al host real del proxy antes del build.

## 6. Smoke test post-arranque

1. Verificar salud de servicios:

    ```powershell
    Invoke-RestMethod http://localhost:3002/externa/v1/health
    Invoke-RestMethod http://localhost:3001/health
    ```

    Deben responder `status: ok`. El backend responde `503 degraded` si PostgreSQL no está disponible.

2. Probar login real desde el frontend:

    - Abrir `http://localhost:5173`.
    - Ingresar con `consultor / consultor123`.
    - Verificar que el shell autenticado se muestra y la pantalla de consulta en `/app/consulta` carga el catálogo de tipos de formación.

3. Flujo mínimo de consulta:

    - Seleccionar tipo `militar`.
    - Presionar Buscar.
    - Abrir el detalle de un registro con la acción "Ver".
    - Si el registro tiene certificado descargable, probar la descarga.

4. Logout: debe volver a `/login` y limpiar el token local.

Si alguno de estos pasos falla, consultar [operacion.md](operacion.md) — sección de diagnóstico.

## 7. Rollback

El sistema no reemplaza ningún sistema previo y no modifica datos de personal. El rollback se limita a revertir el artefacto desplegado.

- Frontend: publicar el `dist/` anterior.
- Backend: revertir el commit/tag anterior, reiniciar el servicio.
- Base local: las migraciones son forward-only; un rollback real requiere backup de la BD local previo al despliegue. Se recomienda capturar backup antes de aplicar migraciones en producción.

No hay rollback sobre datos institucionales porque el sistema es Read-Only frente a la API externa.

## 8. Validación automatizada

El script unificado `scripts/qa-local.ps1` ejecuta lint, type-check, tests y build del backend y frontend. Antes del pase a un entorno compartido debe correr en verde:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/qa-local.ps1
```

Detalles de la suite en [qa.md](qa.md).

## 9. Limitaciones conocidas y pendientes institucionales

Las siguientes limitaciones están documentadas explícitamente y deben resolverse antes o durante el pase a producción real:

- **Hash de password**: hoy SHA-256. Debe migrar a bcrypt/argon2 antes de producción.
- **API institucional**: hoy se consume un mock local (`mock-api`). El contrato real deberá relevarse y validarse.
- **Catálogo civil**: datos placeholder; pendiente relevamiento formal (VAC-01).
- **Servidor de publicación**: no existe host institucional definido.
- **Certificados digitales / dominio**: pendiente de definición con el Área de Sistemas.
- **Patrocinio y firmas formales**: pendiente validación humana (ver `DOCUMENTOS/12_cierre.md`).
- **Monitoreo / logs centralizados**: no implementado en esta entrega; el backend usa Pino a stdout.

## 10. Referencias cruzadas

- Manual de usuario: [../docs/manual_usuario.md](../docs/manual_usuario.md)
- Operación y diagnóstico: [operacion.md](operacion.md)
- Capacitación de operadores: [capacitacion_operadores.md](capacitacion_operadores.md)
- QA y pruebas: [qa.md](qa.md)
- Guía técnica general: [../README.md](../README.md)
- Plan de implantación institucional (PMBOK): [../../DOCUMENTOS/11_implantacion.md](../../DOCUMENTOS/11_implantacion.md)
- Cierre del proyecto (PMBOK): [../../DOCUMENTOS/12_cierre.md](../../DOCUMENTOS/12_cierre.md)
