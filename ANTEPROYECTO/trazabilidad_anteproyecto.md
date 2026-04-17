# TRAZABILIDAD DEL ANTEPROYECTO

> **Proyecto:** SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal  
> **Documento:** Registro de trazabilidad de la elaboración del anteproyecto  
> **Última actualización:** Abril 2026

---

## 1. Resumen de Elaboración

| FASE | Archivo | Fecha | Elementos Principales Producidos |
|------|---------|-------|----------------------------------|
| 0 | `00_diagnostico_inicial.md` | Abril 2026 | REST-01..07, VAC-01..10, SUP-01..08, DEC-01..06 |
| 1 | `01_definicion_problema.md` | Abril 2026 | Problema 6 dimensiones, 7 consecuencias (CNR-01..07), 7 actores afectados |
| 2 | `02_objetivos.md` | Abril 2026 | OE-01..07, trazabilidad Objetivos→Problema |
| 3 | `03_alcance.md` | Abril 2026 | AF-01..10, FA-01..10, LIM-01..06, trazabilidad Alcance→Objetivos |
| 4 | `04_stakeholders_actores.md` | Abril 2026 | STK-01..10, ACT-01..05, matriz Influencia/Interés, permisos preliminares |
| 5 | `05_requisitos_funcionales.md` | Abril 2026 | MOD-01..09, RF-01..44 (37 esenciales + 7 deseables), diagrama dependencias |
| 6 | `06_requisitos_no_funcionales.md` | Abril 2026 | RNF-01..30 (17 esenciales + 13 deseables), 9 categorías |
| 7 | `07_reglas_negocio.md` | Abril 2026 | RN-01..30, 7 categorías, matriz impacto por componente |
| 8 | `08_casos_de_uso.md` | Abril 2026 | CU-01..15, relaciones include/extend, 10 CU especificados completamente |
| 9 | `09_modelo_analisis.md` | Abril 2026 | 29 clases BCE: B-01..09, C-01..08, E-01..09, I-01..03, diagrama relaciones |
| 10 | `10_arquitectura_tecnologias.md` | Abril 2026 | Stack completo (React 19 + Node.js 22 + PG 16), 9 tablas BD, Node.js como arquitectura candidata prioritaria |
| 11 | `11_viabilidad.md` | Abril 2026 | 5 dimensiones viables, restricciones identificadas |
| 12 | `12_planificacion_cronograma.md` | Abril 2026 | EDT/WBS ~40 tareas, 14 semanas, H1..H6, Gantt textual |
| 13 | `13_recursos_presupuesto.md` | Abril 2026 | RH-01..05, RS-01..15, RW-01..04, SV-01..05, SP-01..06, costo $0 + contingente ~USD 108 |
| 14 | `14_riesgos_suposiciones.md` | Abril 2026 | R-01..11, mapa de calor, consolidación de 14 suposiciones, plan de monitoreo |
| 15 | `15_metricas_exito.md` | Abril 2026 | 34 métricas (MF/MC/MR/MS/MA/MT/MG), criterio de aceptación global |
| 16 | `16_gobierno_documental.md` | Abril 2026 | CR-01..08, flujo de aprobación, política de cambios, RACI, diccionario de prefijos |
| 17 | `17_consolidacion_final.md` | Abril 2026 | Índice general, verificación de consistencia, consolidación de pendientes, conclusiones |

---

## 2. Decisiones Tomadas Durante la Elaboración

| ID | Decisión | Fase | Justificación |
|----|----------|------|---------------|
| DEC-01 | Arquitectura read-only con proxy backend | F0 | Restricción institucional: no se permite escritura en datos de personal |
| DEC-02 | Frontend SPA con React | F0, F10 | Interactividad requerida para filtros jerárquicos dinámicos |
| DEC-03 | Backend proxy como capa intermedia obligatoria | F0, F10 | Seguridad: el frontend nunca accede directo a la API institucional |
| DEC-04 | React 19 + TypeScript 5 + Vite 6 + Tailwind 4 | F10 | Stack moderno, tipado estricto, rendimiento de build, utilidades CSS |
| DEC-05 | Node.js 22 + Express 5 como arquitectura candidata prioritaria | F10 | Stack unificado TypeScript full-stack, mejor async I/O, npm ecosystem |
| DEC-06 | PostgreSQL 16 como BD local | F0, F10 | Solo para usuarios, roles, auditoría, config; no replica datos de personal |
| DEC-07 | Patrón Anti-Corruption Layer para integración | F9, F10 | Aislar el sistema de cambios en la API externa |
| DEC-08 | Ciclo de vida iterativo e incremental | F12 | Requerimientos no cerrados (REST-05), necesidad de validación temprana |
| DEC-09 | Métricas de seguridad con umbrales absolutos | F15 | Contexto militar/defensa: tolerancia cero vulnerabilidades |
| DEC-10 | Control de cambios en 3 niveles (menor/moderado/mayor) | F16 | Equipo unipersonal: gobierno liviano pero trazable |

---

## 3. Vacíos de Información — Estado Actualizado

| ID | Vacío | Estado a F17 | Acción Pendiente |
|----|-------|-------------|------------------|
| VAC-01 | Catálogo formal de formación civil | 🟡 ABIERTO | Validar con RH-03 usando datos de Contexto.md |
| VAC-02 | Contrato/Swagger de la API institucional | 🔴 CRÍTICO | PoC en FASE 2 del desarrollo; mock server como fallback |
| VAC-03 | Mecanismo de autenticación de la API | 🟡 ABIERTO | Descubrir en PoC |
| VAC-04 | Granularidad de permisos de consulta | 🟡 ABIERTO | Descubrir en PoC |
| VAC-05 | Normativa de seguridad institucional | 🟡 ABIERTO | Solicitar a RH-03/RH-04 |
| VAC-06 | Stack tecnológico del backend | 🟢 RESUELTO | Node.js 22 + Express 5 + TS (decidido en F10) |
| VAC-07 | Catálogos estructurados de aptitudes | 🟡 ABIERTO | Modelar desde Contexto.md; E-07 es administrable |
| VAC-08 | Entorno de staging disponible | 🟡 ABIERTO | Confirmar con RH-04; contingente VPS disponible |
| VAC-09 | Calidad de datos en la fuente | 🟡 ABIERTO | Evaluar en PoC |
| VAC-10 | Volumen de datos (cantidad de registros) | 🟡 ABIERTO | Estimar en PoC |

**Resumen:** 1 resuelto, 1 crítico, 8 abiertos. La PoC (H2, S5) resolverá la mayoría.

---

## 4. Suposiciones — Estado Actualizado

| ID | Suposición | Prob. Fallo | Estado |
|----|------------|-------------|--------|
| SUP-01 | API REST con JSON | Baja | PENDIENTE validación en PoC |
| SUP-02 | Catálogos relativamente estables | Media | PENDIENTE validación |
| SUP-03 | Datos incluyen campos para filtros diseñados | Media | PENDIENTE validación en PoC |
| SUP-04 | Referente participa activamente | Media | PENDIENTE (depende de RH-03) |
| SUP-05 | RBAC implementable sin cambios organizacionales | Baja | PENDIENTE |
| SUP-06 | Institución provee infraestructura | Media | PENDIENTE (VAC-08) |
| SUP-07 | Sistema Read-Only sin ABM | Muy Baja | ✅ VIGENTE |
| SUP-08 | 14 semanas suficientes para MVP | Media | ✅ VIGENTE (soportado por F12) |
| SP-01 | PPS no remunerada | Muy Baja | ✅ VIGENTE |
| SP-02 | Software open-source gratuito | Muy Baja | ✅ VIGENTE |
| SP-03 | Institución provee servidores (= SUP-06) | Media | PENDIENTE |
| SP-04 | GitHub Free tier suficiente | Baja | ✅ VIGENTE |
| SP-05 | Sin licenciamiento para API | Baja | PENDIENTE |
| SP-06 | Equipo del alumno cumple specs | Muy Baja | ✅ VIGENTE |

---

## 5. Riesgos — Resumen por Exposición

| Exp. | ID | Riesgo | Estrategia |
|------|----|--------|------------|
| **15** | R-01 | Dependencia total de la API | Mitigar (mock + ACL + health check) |
| **12** | R-02 | Cambios en contrato API | Mitigar (ACL + mapper + tests de contrato) |
| **12** | R-04 | Datos incompletos/inconsistentes | Mitigar (validación + sanitización + logging) |
| **12** | R-06 | Retraso por requisitos no cerrados | Mitigar (MoSCoW + freeze + buffer) |
| **12** | R-08 | Sin documentación de catálogos | Mitigar (Contexto.md + E-07 administrable) |
| **12** | R-09 | Sobrecarga del alumno | Mitigar + Aceptar (planificación + MoSCoW) |
| **10** | R-05 | Vulnerabilidades de seguridad | Mitigar (OWASP + audit + Helmet) |
| **9** | R-03 | Permisos insuficientes sobre datos | Mitigar (diseño modular) |
| **9** | R-10 | Falta de participación del cliente | Mitigar (canal formal + escalamiento) |
| **9** | R-11 | Desalineación de expectativas sobre alcance | Mitigar (documentación + validación en hitos) |
| **8** | R-07 | Incompatibilidad infra institucional | Mitigar (Docker + VPS contingente) |

---

## 6. Pendientes Críticos — Próximos Pasos

| # | Pendiente | Plazo | Responsable | Bloquea |
|---|-----------|-------|-------------|---------|
| 1 | Obtener aprobación formal del anteproyecto (PEN-F17-01) | S2 / H1 | RH-02, RH-03 | Inicio del desarrollo |
| 2 | Resolver VAC-02 — Contrato de API (PEN-F17-03) | S4 / H2 | RH-03, RH-04 | FASE 3 (backend proxy) |
| 3 | Confirmar infraestructura staging/prod (PEN-F13-01) | S3 | RH-04 | FASE 2 (infra) y FASE 6 (deploy) |
| 4 | Definir priorización MoSCoW de RF (PEN-F14-05) | S2 | RH-01, RH-03 | Planificación de sprints |
| 5 | Validar flujo de aprobación con Director PPS (PEN-F16-01) | S1 | RH-02 | Gobierno documental |

---

## 7. Inventario Completo de IDs del Proyecto

| Prefijo | Significado | Rango | Fase |
|---------|-------------|-------|------|
| REST | Restricción | 01–07 | F0 |
| VAC | Vacío de información | 01–10 | F0 |
| SUP | Suposición | 01–08 | F0 |
| DEC | Decisión previa | 01–06 | F0 |
| CNR | Consecuencia de no resolver | 01–07 | F1 |
| OE | Objetivo específico | 01–07 | F2 |
| AF | Alcance funcional | 01–10 | F3 |
| FA | Fuera de alcance | 01–10 | F3 |
| LIM | Límite | 01–06 | F3 |
| STK | Stakeholder | 01–10 | F4 |
| ACT | Actor | 01–05 | F4 |
| MOD | Módulo | 01–09 | F5 |
| RF | Requisito funcional | 01–44 | F5 |
| RNF | Requisito no funcional | 01–30 | F6 |
| RN | Regla de negocio | 01–30 | F7 |
| CU | Caso de uso | 01–15 | F8 |
| B | Clase boundary (BCE) | 01–09 | F9 |
| C | Clase control (BCE) | 01–08 | F9 |
| E | Clase entity (BCE) | 01–09 | F9 |
| I | Clase integración | 01–03 | F9 |
| H | Hito del proyecto | 1–6 | F12 |
| RH | Recurso humano | 01–05 | F13 |
| RS | Recurso software | 01–15 | F13 |
| RW | Recurso hardware | 01–04 | F13 |
| SV | Servicio | 01–05 | F13 |
| SP | Supuesto presupuestario | 01–06 | F13 |
| R | Riesgo | 01–11 | F14 |
| MF | Métrica funcional | 01–05 | F15 |
| MC | Métrica calidad | 01–06 | F15 |
| MR | Métrica rendimiento | 01–05 | F15 |
| MS | Métrica seguridad | 01–05 | F15 |
| MA | Métrica adopción | 01–05 | F15 |
| MT | Métrica auditoría | 01–04 | F15 |
| MG | Métrica gestión | 01–04 | F15 |
| CR | Criterio de revisión | 01–08 | F16 |
| PEN | Pendiente | FXX-NN | Todas |

**Total de tipos de IDs: 36 prefijos | Total de elementos: ~350+**

---

## 8. Estadísticas Finales

| Indicador | Valor |
|-----------|-------|
| Fases del anteproyecto | 18 (F0–F17) |
| Archivos producidos | 18 (.md) + 1 trazabilidad |
| Elementos identificados y trazados | ~350+ |
| Trazabilidad vertical completa | ✅ Sí |
| Trazabilidad horizontal completa | ✅ Sí |
| Vacíos resueltos | 1/10 |
| Vacíos abiertos | 9/10 (mayoría se resuelve en PoC) |
| Riesgo máximo | R-01 — Exposición 15 (crítica) |
| Costo base del proyecto | $0 |
| Pendientes totales | 27 (5 críticos) |
| Estado general | ✅ Listo para aprobación y desarrollo |
