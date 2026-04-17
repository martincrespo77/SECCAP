---
description: "Fase 2: Infraestructura Base. Setup de repositorio, base de datos local, scaffolding de frontend y backend, conexión de prueba con API externa."
agent: "devops"
---
# Fase 2: Infraestructura Base

## Objetivo de esta fase
Establecer toda la infraestructura técnica necesaria para el desarrollo: repositorio, BD, entornos y prueba de conexión con la API institucional.

## Contexto
Revisá [03_edt.md](../../DOCUMENTOS/03_edt.md) sección 1.2 (Arquitectura e Infraestructura Base).
Revisá [04_cronograma.md](../../DOCUMENTOS/04_cronograma.md) Fase 1 del cronograma.

## Tareas de esta fase

### 1. Estructura del repositorio
```
PPS/
├── .github/          # Ya existe - Configuración Copilot
├── DOCUMENTOS/       # Ya existe - Docs PMBOK
├── Contexto.md       # Ya existe
├── frontend/         # CREAR - App React/Vite/TS/Tailwind
├── backend/          # CREAR - Capa Proxy
├── docs/             # CREAR - Manuales y docs técnicas
├── .gitignore        # CREAR
└── README.md         # CREAR - Descripción del proyecto
```

### 2. Scaffolding Frontend
- Inicializar con Vite + React + TypeScript
- Configurar Tailwind CSS
- Instalar dependencias base: Axios, React Router, Lucide React
- Estructura de carpetas: `src/components/`, `src/pages/`, `src/services/`, `src/types/`

### 3. Scaffolding Backend
- Inicializar proyecto (Node.js/Express o PHP según definición del stack)
- Configurar estructura: `routes/`, `controllers/`, `middleware/`, `models/`, `migrations/`
- Template `.env` con variables necesarias (API_URL, DB_HOST, JWT_SECRET, etc.)

### 4. Base de datos local
- Esquema inicial: `sys_usuarios`, `sys_roles`, `audit_logs`, `sys_config`
- Primera migración ejecutable

### 5. Handshake con API externa
- Prueba de concepto: conectar desde backend a la API institucional
- Si no hay acceso aún, crear mock API para no bloquear desarrollo

### 6. Entregable final de fase
- Repositorio funcional con frontend y backend inicializados
- BD local con esquema base migrado
- Documentar resultado del handshake (éxito o plan B con mock)
