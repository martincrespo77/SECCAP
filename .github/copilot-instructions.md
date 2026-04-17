# Instrucciones Globales del Proyecto PPS

## Contexto del Proyecto
- **Nombre:** Sistema de Gestión de Capacidades y Aptitudes del Personal
- **Tipo:** Práctica Profesional Supervisada (PPS) - 5to año de Ingeniería
- **Metodología:** Iterativa e Incremental (PMBOK adaptado a software)
- **Estado:** En desarrollo, requerimientos no completamente cerrados

## Stack Tecnológico
- **Frontend:** React 19, TypeScript estricto, Vite, Tailwind CSS, Axios, React Router, Lucide React
- **Backend:** Capa Proxy/Integrador seguro (PHP o Node.js — por definir)
- **Base de Datos Local:** MySQL o PostgreSQL (solo usuarios, roles, auditoría, configuraciones)
- **API Externa:** API institucional de RRHH (Read-Only, JSON)

## Arquitectura Fundamental
- El sistema es **Read-Only** respecto a los datos de personal oficial
- El Frontend **NUNCA** se conecta directo a la API institucional
- Todo pasa por el **Backend Proxy** que valida, filtra y audita
- La BD local **NO** replica datos de personal; solo guarda config, roles, logs y auditoría
- Control de acceso basado en roles (RBAC)
- Toda consulta debe quedar registrada en auditoría

## Estructura del Repositorio
```
PPS/
├── .github/              # Configuración de Copilot (agentes, prompts, instrucciones)
├── DOCUMENTOS/           # Documentación PMBOK formal (12 documentos)
├── TRAZABILIDAD/         # Registro cronológico de actividades por fase
├── Contexto.md           # Contexto completo del proyecto y análisis previo
├── frontend/             # (por crear) App React/Vite
├── backend/              # (por crear) Capa Proxy
└── docs/                 # (por crear) Manuales y documentación técnica
```

## Reglas Generales
1. Toda documentación formal va en `DOCUMENTOS/` en formato Markdown
2. Los archivos siguen la convención `XX_nombre.md` con numeración secuencial
3. El idioma de toda la documentación y comentarios es **español**
4. Se prioriza seguridad: RBAC, auditoría, principio de menor privilegio
5. Se respeta el ciclo iterativo: no cerrar todo de golpe, validar con el cliente
6. Los filtros de consulta son **jerárquicos y dependientes**, no planos
7. **Trazabilidad obligatoria:** Al trabajar en cualquier fase, registrar cada actividad en `TRAZABILIDAD/fase-X-nombre.md` con fecha, hora, qué se hizo y por qué

## Fases del Proyecto
El proyecto se divide en 6 fases secuenciales, cada una con su propio prompt mode:
1. **Planificación y Documentación** → `/fase-1-planificacion`
2. **Infraestructura Base** → `/fase-2-infraestructura`
3. **Backend Proxy** → `/fase-3-backend`
4. **Frontend Funcional** → `/fase-4-frontend`
5. **Calidad y Seguridad** → `/fase-5-qa`
6. **Implantación y Cierre** → `/fase-6-implantacion`
