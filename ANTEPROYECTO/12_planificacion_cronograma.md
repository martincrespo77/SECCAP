# FASE 12 — PLANIFICACIÓN Y CRONOGRAMA
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Plan de Trabajo y Cronograma Preliminar**

## 2. Objetivo
Construir una planificación de alto nivel con EDT/WBS, fases, tareas principales, hitos, dependencias y cronograma preliminar, adoptando un enfoque iterativo e incremental.

---

## 3. Desarrollo

### 3.1. Enfoque de Ciclo de Vida

Se adopta un **ciclo de vida iterativo e incremental** con 6 fases secuenciales. Cada fase produce entregables verificables y permite retroalimentación antes de avanzar a la siguiente. Dentro de las fases de desarrollo (3 y 4), se contempla la posibilidad de ciclos iterativos internos.

**Justificación:** Los requerimientos no están completamente cerrados (REST-05), existe dependencia de una API externa con contrato no formalizado (VAC-02), y se requiere validación temprana con el cliente (SUP-04).

### 3.2. EDT / WBS de Baja Granularidad

```
1. PROYECTO: SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal
│
├── 1.1 FASE 1 — Planificación y Documentación
│   ├── 1.1.1 Elaboración del anteproyecto
│   ├── 1.1.2 Definición de requisitos funcionales y no funcionales
│   ├── 1.1.3 Casos de uso y reglas de negocio
│   ├── 1.1.4 Modelo de análisis preliminar
│   ├── 1.1.5 Arquitectura candidata
│   ├── 1.1.6 Plan de riesgos
│   ├── 1.1.7 Plan de calidad y pruebas (preliminar)
│   └── 1.1.8 Aprobación de documentación base
│
├── 1.2 FASE 2 — Infraestructura Base
│   ├── 1.2.1 Configuración del repositorio y CI/CD básico
│   ├── 1.2.2 Setup de proyecto frontend (React/Vite/TS/Tailwind)
│   ├── 1.2.3 Setup de proyecto backend (Node.js/Express/TS)
│   ├── 1.2.4 Setup de base de datos local (PostgreSQL)
│   ├── 1.2.5 Migraciones iniciales (usuarios, roles, auditoría)
│   ├── 1.2.6 Prueba de concepto (PoC) de conexión a la API
│   └── 1.2.7 Validación de la infraestructura base
│
├── 1.3 FASE 3 — Backend Proxy
│   ├── 1.3.1 Módulo de autenticación y sesión (JWT)
│   ├── 1.3.2 Módulo RBAC (roles, permisos, middleware)
│   ├── 1.3.3 Capa de integración con API (AdaptadorAPI)
│   ├── 1.3.4 Módulo de consulta (validación, sanitización, ejecución)
│   ├── 1.3.5 Módulo de auditoría (registro automático)
│   ├── 1.3.6 Módulo de catálogos (obtención, caché)
│   ├── 1.3.7 Manejo de errores de integración
│   ├── 1.3.8 Módulo de administración (CRUD usuarios/roles)
│   └── 1.3.9 Pruebas unitarias y de integración del backend
│
├── 1.4 FASE 4 — Frontend Funcional
│   ├── 1.4.1 Pantalla de login
│   ├── 1.4.2 Dashboard principal
│   ├── 1.4.3 Módulo de consulta con filtros jerárquicos
│   ├── 1.4.4 Visualización de resultados (tabla paginada)
│   ├── 1.4.5 Vista de detalle de registro
│   ├── 1.4.6 Módulo de auditoría (interfaz de consulta de logs)
│   ├── 1.4.7 Módulo de administración (interfaz)
│   ├── 1.4.8 Manejo de errores en la UI
│   ├── 1.4.9 Integración frontend ↔ backend
│   └── 1.4.10 Pruebas funcionales del frontend
│
├── 1.5 FASE 5 — Calidad y Seguridad
│   ├── 1.5.1 Pruebas de control de acceso (RBAC)
│   ├── 1.5.2 Pruebas de integración con API real
│   ├── 1.5.3 Revisión de seguridad (OWASP checklist)
│   ├── 1.5.4 Pruebas de rendimiento básicas
│   ├── 1.5.5 Pruebas de aceptación del usuario (UAT)
│   ├── 1.5.6 Corrección de defectos encontrados
│   └── 1.5.7 Documentación del plan de pruebas ejecutado
│
└── 1.6 FASE 6 — Implantación y Cierre
    ├── 1.6.1 Preparación del ambiente de producción
    ├── 1.6.2 Despliegue del sistema
    ├── 1.6.3 Capacitación de usuarios
    ├── 1.6.4 Manual de usuario y operación
    ├── 1.6.5 Período de soporte inicial
    ├── 1.6.6 Informe de cierre y lecciones aprendidas
    └── 1.6.7 Entrega formal y acta de aceptación
```

### 3.3. Cronograma Preliminar (~14 semanas)

El cronograma corresponde al **proyecto integral SECCAP**. El inicio formal del desarrollo se produce en el marco de la Práctica Profesional Supervisada, que constituye el hito de arranque académico e institucional.

| Fase | Semanas | Duración | Hito de Cierre | Dependencia |
|---|---|---|---|---|
| **FASE 1** — Planificación y Documentación | S1 – S2 | 2 semanas | **H1:** Documentación base aprobada | — |
| **FASE 2** — Infraestructura Base | S3 – S5 | 3 semanas | **H2:** PoC de conexión a API exitosa | H1 |
| **FASE 3** — Backend Proxy | S6 – S7 | 2 semanas | **H3:** Backend funcional con pruebas | H2 |
| **FASE 4** — Frontend Funcional | S8 – S10 | 3 semanas | **H4:** Frontend integrado y funcional | H3 |
| **FASE 5** — Calidad y Seguridad | S11 – S12 | 2 semanas | **H5:** Sistema validado (UAT + seguridad) | H4 |
| **FASE 6** — Implantación y Cierre | S13 – S14 | 2 semanas | **H6:** Sistema en producción + acta de cierre | H5 |

### 3.4. Diagrama de Gantt (Textual)

```
Semana:  S1  S2  S3  S4  S5  S6  S7  S8  S9  S10 S11 S12 S13 S14
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
FASE 1   ████████│                                              │
FASE 2           ████████████│                                  │
FASE 3                       ████████│                          │
FASE 4                               ████████████│              │
FASE 5                                           ████████│      │
FASE 6                                                   ████████
         ├───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
Hitos:   │   H1  │       H2  │   H3  │       H4  │   H5  │  H6│
```

### 3.5. Hitos del Proyecto

| ID | Hito | Fecha Estimada | Criterio de Verificación |
|---|---|---|---|
| H1 | Documentación base aprobada | Fin S2 | Anteproyecto, requisitos, CU, arquitectura aprobados |
| H2 | PoC de conexión a API exitosa | Fin S5 | Backend invoca la API y obtiene respuesta; infraestructura operativa |
| H3 | Backend funcional con pruebas | Fin S7 | Todos los módulos del backend implementados y con pruebas unitarias |
| H4 | Frontend integrado y funcional | Fin S10 | Frontend conectado al backend; flujo completo de consulta operativo |
| H5 | Sistema validado | Fin S12 | UAT completado; revisión de seguridad aprobada; defectos críticos resueltos |
| H6 | Sistema en producción | Fin S14 | Sistema desplegado; capacitación realizada; acta de cierre firmada |

### 3.6. Dependencias Críticas

| Dependencia | Origen | Impacto si se retrasa |
|---|---|---|
| Acceso a la API de staging (VAC-08) | FASE 2 (PoC) | Bloquea H2 y todo el desarrollo de integración |
| Definición de autenticación ante API (VAC-03) | FASE 3 (Backend) | Bloquea el módulo de integración |
| Participación del cliente en validaciones (SUP-04) | FASE 1, 5 | Retrasa aprobación y UAT |
| Disponibilidad de infraestructura de producción (SUP-06) | FASE 6 | Bloquea el despliegue final |

---

## 4. Tablas y Matrices

### 4.1. Distribución de Esfuerzo por Fase (Estimación)

| Fase | % del Esfuerzo Total | Justificación |
|---|---|---|
| Planificación | ~15% | Documentación formal extensa por naturaleza académica |
| Infraestructura | ~15% | Setup + PoC de API (riesgo clave) |
| Backend | ~25% | Módulo más crítico: integración, RBAC, auditoría |
| Frontend | ~25% | Interfaz con filtros complejos e integración con backend |
| Calidad | ~10% | Pruebas, revisión de seguridad, UAT |
| Implantación | ~10% | Despliegue, capacitación, cierre |

---

## 5. Observaciones

1. **Cronograma intencionalmente holgado en FASE 2 (3 semanas):** La PoC de conexión a la API es el punto de mayor incertidumbre técnica. Si se resuelve rápido, el tiempo sobrante se reasigna a FASE 3.

2. **Superposición posible:** Las fases 3 y 4 podrían solaparse parcialmente (iniciar pantallas de login y dashboard mientras se termina el backend de autenticación). Esto se gestionará según avance real.

3. **El cronograma es preliminar:** Se ajustará al inicio de cada fase según el avance real y los pendientes resueltos.

4. **Buffer implícito:** Los tiempos estimados incluyen un margen implícito para iteraciones de corrección dentro de cada fase.

5. **Priorización ante restricciones de tiempo:** Si al llegar a la semana 12 el núcleo funcional (autenticación + RBAC + consulta + auditoría + documentación) está completo pero quedan funcionalidades complementarias pendientes, se prioriza el cierre formal del proyecto y las funcionalidades restantes se documentan como alcance futuro.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F12-01 | Definir fecha real de inicio de la PPS para anclar el cronograma | Director de Proyecto | Alta |
| PEN-F12-02 | Confirmar disponibilidad de API para la PoC (semana 3-5) | Director de Proyecto + Área de Informática | Crítica |
| PEN-F12-03 | Definir las fechas de revisión con el tutor académico | Director de Proyecto | Media |

---

## 7. Entregable Generado

**"Plan de Trabajo y Cronograma Preliminar"** — Documento `12_planificacion_cronograma.md`

Contenido:
- ✅ EDT/WBS de baja granularidad (6 fases, ~40 tareas)
- ✅ Cronograma de 14 semanas con distribución por fase
- ✅ 6 hitos con criterio de verificación
- ✅ Dependencias críticas identificadas
- ✅ Distribución estimada de esfuerzo
- ✅ Diagrama de Gantt textual

---

## 8. Próxima Fase Recomendada

**FASE 13 — Recursos y Presupuesto**

Se identificarán los recursos humanos, tecnológicos y de infraestructura necesarios, y se estimará el presupuesto preliminar del proyecto.

> **Precondición:** Cronograma definido. No existen dependencias bloqueantes.
