# QA SECCAP — Fase 5

Guia breve para correr el QA completo del proyecto en local.

## Que cubre la Fase 5

- **Fase 5.1 (backend):** smoke tests del `app`, contratos mock/proxy, auditoria critica y hardening de errores (404/401/500 sin stack ni internals).
- **Fase 5.2 (frontend):** harness Vitest + Testing Library con tests in-process de auth, router/rutas protegidas, consulta + filtros jerarquicos + paginacion, detalle y descarga de certificado.
- **Fase 5.3 (cierre):** refuerzo de casos negativos (catalogo fallido, consulta 502, consulta vacia, detalle 404, descarga 500, auditoria con filtros invalidos) y script unificado de QA.

## Como correr el QA completo

Desde la raiz del repo, en PowerShell (cualquier version: Windows PowerShell 5.1 o PowerShell 7+):

```powershell
powershell -File scripts/qa-local.ps1
```

Opciones:

```powershell
powershell -File scripts/qa-local.ps1 -SkipBackend    # solo frontend
powershell -File scripts/qa-local.ps1 -SkipFrontend   # solo backend
```

El script sale con `exit 1` si cualquiera de los pasos falla.

## Prerrequisitos

- Node 20+ y npm en PATH.
- Dependencias instaladas en ambos proyectos (`npm install` en `SECCAP/backend` y `SECCAP/frontend`).
- **Backend (integracion real):** contenedor `seccap-pg` arriba con la BD seedeada y mock-api escuchando en `http://localhost:3002`.
  - Los smoke y contract tests del backend NO requieren esos servicios (mockean `prisma` y `fetch`).
- **Frontend:** no requiere backend ni mock; los clientes HTTP se mockean con `vi.mock`.

## Comandos equivalentes manuales

### Backend (`SECCAP/backend`)

```powershell
npm run lint
npm run type-check
npx prisma validate
npm test
```

### Frontend (`SECCAP/frontend`)

```powershell
npm run lint
npm run type-check
npm test
npm run build
```

## Donde vive la cobertura

- Backend tests: `SECCAP/backend/src/__tests__/*.test.ts` (auth, consulta, detalle, catalogos, auditoria, auditoria-criticos, smoke, contracts).
- Frontend tests: `SECCAP/frontend/src/__tests__/*.test.tsx` (auth, router, consulta, detalle).

Si se agrega una ruta o flujo nuevo, ampliar la suite correspondiente antes de marcar la fase como cerrada.
