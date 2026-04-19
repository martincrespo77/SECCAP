# SECCAP — Guía Técnica de Arranque

Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal.

## Estructura

```text
SECCAP/
├── frontend/          # SPA — React 19 + TypeScript + Vite + Tailwind CSS 4
├── backend/           # Proxy — Node.js 22 + Express 5 + TypeScript
├── mock-api/          # Mock de la API del Área de Personal (desarrollo)
├── docs-tecnicos/     # Documentación técnica de implementación
├── .env.example       # Variables de entorno (plantilla)
└── .gitignore
```

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 22.x LTS |
| npm | 10.x |
| PostgreSQL | 16.x (para Fase 2.2 en adelante) |

## Instalación rápida

### Bash / macOS / Linux / Git Bash

```bash
# 1. Copiar variables de entorno
cp .env.example .env          # y ajustar valores

# 2. Instalar dependencias de cada módulo
cd backend  && npm install && cd ..
cd mock-api && npm install && cd ..
cd frontend && npm install && cd ..
```

### PowerShell (Windows)

```powershell
# 1. Copiar variables de entorno
Copy-Item .env.example .env   # y ajustar valores

# 2. Instalar dependencias de cada módulo
Push-Location backend;  npm install; Pop-Location
Push-Location mock-api; npm install; Pop-Location
Push-Location frontend; npm install; Pop-Location
```

## Arranque en desarrollo

Abrir tres terminales dentro de `SECCAP/`:

### Bash / macOS / Linux / Git Bash

```bash
# Terminal 1 — Mock API (puerto 3002)
cd mock-api && npm run dev

# Terminal 2 — Backend Proxy (puerto 3001)
cd backend && npm run dev

# Terminal 3 — Frontend (puerto 5173)
cd frontend && npm run dev
```

### PowerShell (Windows)

```powershell
# Terminal 1 — Mock API (puerto 3002)
Set-Location mock-api; npm run dev

# Terminal 2 — Backend Proxy (puerto 3001)
Set-Location backend; npm run dev

# Terminal 3 — Frontend (puerto 5173)
Set-Location frontend; npm run dev
```

El frontend en dev proxy-a las llamadas `/api/*` hacia el backend en `localhost:3001`.

## Verificación de salud

```bash
# Mock API
curl http://localhost:3002/externa/v1/health

# Backend Proxy
curl http://localhost:3001/health
```

En PowerShell usar `Invoke-RestMethod` en lugar de `curl`:

```powershell
Invoke-RestMethod http://localhost:3002/externa/v1/health
Invoke-RestMethod http://localhost:3001/health
```

Ambos deben responder `{ "status": "ok", ... }`.

## Scripts disponibles

### Backend (`SECCAP/backend/`)

| Script | Uso |
|---|---|
| `npm run dev` | Arranque con hot-reload (tsx watch) |
| `npm run build` | Compilar TypeScript a `dist/` |
| `npm start` | Ejecutar build compilado |
| `npm run type-check` | Verificar tipos sin compilar |
| `npm run lint` | Linter ESLint |

### Mock API (`SECCAP/mock-api/`)

| Script | Uso |
|---|---|
| `npm run dev` | Arranque con hot-reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Ejecutar build compilado |
| `npm run type-check` | Verificar tipos |

### Frontend (`SECCAP/frontend/`)

| Script | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Build de producción |
| `npm run preview` | Previsualizar build |
| `npm run type-check` | Verificar tipos |
| `npm run lint` | Linter ESLint |

## Reglas de estructura

- Todo el código ejecutable debe vivir dentro de `SECCAP/`.
- No crear `frontend/`, `backend/` ni `mock-api/` en la raíz del repositorio.
- La documentación funcional, PMBOK, UML y trazabilidad permanece fuera de esta carpeta.
- La Mock API es parte del entorno de desarrollo, no un accesorio temporal.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript 5 (strict), Vite 6, Tailwind CSS 4, Axios, React Router 7, Lucide React |
| Backend | Node.js 22, Express 5, TypeScript 5, Pino (logger), Zod (validación), Helmet, CORS |
| Mock API | Node.js 22, Express 5, TypeScript 5 |
| BD Local | PostgreSQL 16 (usuarios, roles, auditoría, config, caché — sin datos de personal) |
| Auth | JWT (jsonwebtoken) |

## Licencia

Uso interno — Ejército Argentino.
