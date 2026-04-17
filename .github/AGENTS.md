# Agentes del Proyecto PPS

Este proyecto utiliza agentes especializados de Copilot para dividir el trabajo en dominios independientes.

## Agentes disponibles

| Agente | Archivo | Dominio | Herramientas |
|--------|---------|---------|-------------|
| **Documentación** | `documentacion.agent.md` | Documentos PMBOK, actas, alcance, EDT, requisitos | read, edit, search, web, todo |
| **Backend** | `backend.agent.md` | Proxy, auth JWT, RBAC, DTOs, auditoría, API | read, edit, search, execute, todo |
| **Frontend** | `frontend.agent.md` | React, UI, filtros, tablas, componentes, Tailwind | read, edit, search, execute, todo |
| **QA** | `qa.agent.md` | Pruebas, seguridad OWASP, RBAC tests, UAT | read, edit, search, execute, todo |
| **DevOps** | `devops.agent.md` | Infra, BD, CI/CD, deploy, migraciones, Docker | read, edit, search, execute, todo |

## Prompt Modes (Fases de trabajo)

Cada fase se activa escribiendo `/` en el chat y seleccionando el prompt correspondiente:

| Fase | Prompt | Agente asignado | Semanas | Entregable principal |
|------|--------|-----------------|---------|---------------------|
| **1** | `/fase-1-planificacion` | Documentación | 1–2 | Documentación PMBOK completa y coherente |
| **2** | `/fase-2-infraestructura` | DevOps | 3–5 | Repo, BD, scaffolding, handshake API |
| **3** | `/fase-3-backend` | Backend | 6–7 | Proxy funcional: auth, RBAC, audit, filtros |
| **4** | `/fase-4-frontend` | Frontend | 8–10 | UI completa: login, filtros, tablas, detalle |
| **5** | `/fase-5-qa` | QA | 11–12 | Tests ejecutados, reporte de seguridad |
| **6** | `/fase-6-implantacion` | Documentación | 13–14 | Deploy, manual, capacitación, cierre |

## Cómo usar

1. **Seleccioná la fase actual** escribiendo `/fase-X-nombre` en el chat
2. El agente asignado se cargará automáticamente con contexto especializado
3. Seguí las tareas listadas en el prompt de la fase
4. Al terminar una fase, actualizá los documentos PMBOK correspondientes

## Flujo de dependencias

```
Fase 1 (Docs) ──────┐
                     ├──▶ Fase 2 (Infra) ──▶ Fase 3 (Backend) ──▶ Fase 4 (Frontend) ──▶ Fase 5 (QA) ──▶ Fase 6 (Cierre)
Contexto.md ─────────┘
```

## Trazabilidad

Cada fase tiene su archivo de registro cronológico en `TRAZABILIDAD/`:

| Fase | Archivo de trazabilidad |
|------|------------------------|
| 1 | `TRAZABILIDAD/fase-1-planificacion.md` |
| 2 | `TRAZABILIDAD/fase-2-infraestructura.md` |
| 3 | `TRAZABILIDAD/fase-3-backend.md` |
| 4 | `TRAZABILIDAD/fase-4-frontend.md` |
| 5 | `TRAZABILIDAD/fase-5-qa.md` |
| 6 | `TRAZABILIDAD/fase-6-implantacion.md` |

**Regla:** Cada vez que un agente realiza una tarea, DEBE agregar una fila al archivo de trazabilidad correspondiente con: fecha (DD/MM/AAAA), hora (HH:MM), actividad, motivo y resultado.

- **Fase 1** es prerequisito de todas las demás (documentación base)
- **Fase 2** desbloquea Fase 3 (no hay backend sin infra)
- **Fase 3** desbloquea Fase 4 (el frontend necesita endpoints)
- **Fase 4** desbloquea Fase 5 (QA necesita sistema funcional)
- **Fase 5** desbloquea Fase 6 (no se despliega sin QA aprobado)

## Información pendiente detectada

Los siguientes campos de los documentos PMBOK necesitan ser completados:

| Documento | Campo pendiente |
|-----------|----------------|
| `01_acta_constitucion.md` | Nombre del Patrocinador, Director de Proyecto, Fecha de Inicio |
| `05_costos.md` | Todas las estimaciones de horas (marcadas como `X hs.`) |
| `08_comunicaciones.md` | Definiciones formales del Glosario (Aptitud, Capacidad) |
| `09_requisitos.md` | F-02: Categoría de formación civil (pendiente de relevamiento) |
| `12_cierre.md` | Lecciones aprendidas (se completa al final del proyecto) |
