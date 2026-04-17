# FASE 17 — CONSOLIDACIÓN FINAL
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Consolidación, Verificación de Consistencia y Cierre del Anteproyecto**

## 2. Objetivo
Integrar todas las fases del anteproyecto en una visión unificada, verificar la consistencia cruzada entre todos los elementos, consolidar los pendientes abiertos, y producir el documento final listo para revisión y aprobación formal.

---

## 3. Desarrollo

### 3.1. Índice General del Anteproyecto

| FASE | Título | Archivo | Entregable Principal |
|------|--------|---------|---------------------|
| 0 | Diagnóstico Inicial | `00_diagnostico_inicial.md` | 7 restricciones, 10 vacíos, 8 suposiciones, 6 decisiones |
| 1 | Definición del Problema | `01_definicion_problema.md` | Problema en 6 dimensiones, 7 consecuencias, 7 actores afectados |
| 2 | Objetivos del Proyecto | `02_objetivos.md` | 1 objetivo general + 7 objetivos específicos (OE-01..07) |
| 3 | Alcance y Fuera de Alcance | `03_alcance.md` | 10 AF, 10 FA, 6 límites |
| 4 | Stakeholders y Actores | `04_stakeholders_actores.md` | 10 stakeholders, 5 actores, matriz de permisos |
| 5 | Requisitos Funcionales | `05_requisitos_funcionales.md` | 9 módulos, 44 RF (37 esenciales + 7 deseables) |
| 6 | Requisitos No Funcionales | `06_requisitos_no_funcionales.md` | 30 RNF en 9 categorías (17 esenciales + 13 deseables) |
| 7 | Reglas de Negocio | `07_reglas_negocio.md` | 30 RN en 7 categorías |
| 8 | Casos de Uso | `08_casos_de_uso.md` | 15 CU con relaciones include/extend, 10 especificados |
| 9 | Modelo de Análisis | `09_modelo_analisis.md` | 29 clases BCE (9B + 8C + 9E + 3I) |
| 10 | Arquitectura y Tecnologías | `10_arquitectura_tecnologias.md` | Stack completo, diagrama de componentes, 9 tablas BD |
| 11 | Viabilidad | `11_viabilidad.md` | 5 dimensiones evaluadas, todas viables |
| 12 | Planificación y Cronograma | `12_planificacion_cronograma.md` | EDT/WBS, 14 semanas, 6 hitos, Gantt |
| 13 | Recursos y Presupuesto | `13_recursos_presupuesto.md` | 5 RH, 15 RS, 4 RW, 5 SV, costo $0 + contingente |
| 14 | Riesgos y Suposiciones | `14_riesgos_suposiciones.md` | 11 riesgos (1 crítico, 6 altos, 4 medios), 14 suposiciones |
| 15 | Métricas de Éxito | `15_metricas_exito.md` | 34 métricas en 7 categorías, criterio de aceptación |
| 16 | Gobierno Documental | `16_gobierno_documental.md` | Criterios de revisión, control de cambios, RACI |
| 17 | Consolidación Final | `17_consolidacion_final.md` | Este documento |

### 3.2. Verificación de Consistencia Cruzada

#### 3.2.1. Trazabilidad Vertical (de arriba hacia abajo)

```
PROBLEMA (F1)
  └──> OBJETIVOS (F2): OE-01..07 ← cada OE responde a una dimensión del problema
        └──> ALCANCE (F3): AF-01..10 ← cada AF soporta al menos un OE
              └──> REQUISITOS (F5/F6): RF-01..44, RNF-01..30 ← cada RF pertenece a un módulo que soporta un AF
                    └──> REGLAS (F7): RN-01..30 ← restricciones de negocio sobre los RF
                          └──> CASOS DE USO (F8): CU-01..15 ← realizaciones de los RF
                                └──> CLASES (F9): B/C/E/I ← elementos que participan en los CU
                                      └──> ARQUITECTURA (F10) ← componentes que implementan las clases
                                            └──> MÉTRICAS (F15) ← criterios de verificación
```

**Estado de trazabilidad vertical:** ✅ Completa. Verificada en las matrices de trazabilidad incluidas en cada fase.

#### 3.2.2. Trazabilidad Horizontal (entre elementos del mismo nivel)

| Relación | Estado | Observación |
|----------|--------|-------------|
| RF → CU | ✅ Verificada | 44 RF cubiertos por 15 CU (FASE 8, §3.5) |
| RF → RN | ✅ Verificada | RN restringen RF específicos (FASE 7, §4.1) |
| RF → RNF | ✅ Verificada | RNF aplican transversalmente a todos los RF |
| CU → Clases BCE | ✅ Verificada | Participation matrix en FASE 9 |
| Riesgos → Suposiciones | ✅ Verificada | Mapeo en FASE 14, §3.4 |
| Métricas → RNF | ✅ Verificada | Columna de vinculación en FASE 15 |
| Recursos → Fases | ✅ Verificada | Matriz recurso-fase en FASE 13, §4.1 |

#### 3.2.3. Verificación de Cobertura

| Elemento | Total | Trazado hacia arriba | Trazado hacia abajo | Cobertura |
|----------|-------|---------------------|---------------------|-----------|
| Objetivos (OE) | 7 | → Problema (6 dimensiones) | → Alcance (AF) | 100% |
| Alcance Funcional (AF) | 10 | → OE | → Módulos (MOD) | 100% |
| Requisitos Funcionales (RF) | 44 | → MOD → AF → OE | → CU, RN | 100% |
| Requisitos No Funcionales (RNF) | 30 | → OE | → Métricas (M*) | 100% |
| Reglas de Negocio (RN) | 30 | → RF | → Clases (C) | 100% |
| Casos de Uso (CU) | 15 | → RF | → Clases (B, C, E) | 100% |
| Clases de Análisis | 29 | → CU | → Componentes (F10) | 100% |
| Riesgos (R) | 11 | → REST, VAC, SUP | → Plan de respuesta | 100% |
| Métricas (M*) | 34 | → OE, RNF, RF | → Método de medición | 100% |

### 3.3. Consolidación de Pendientes Abiertos

#### 3.3.1. Pendientes por Fase

| Fase | Cant. | IDs | Prioridad Máxima |
|------|-------|-----|------------------|
| F0 | 8 | PEN-F0-01..08 | Alta |
| F1 | — | (sin pendientes propios) | — |
| F2 | — | (sin pendientes propios) | — |
| F3 | — | (sin pendientes propios) | — |
| F4 | — | (sin pendientes propios) | — |
| F5 | — | (sin pendientes propios) | — |
| F6 | — | (sin pendientes propios) | — |
| F7 | — | (sin pendientes propios) | — |
| F8 | — | (sin pendientes propios) | — |
| F9 | — | (sin pendientes propios) | — |
| F10 | — | (sin pendientes propios) | — |
| F11 | — | (sin pendientes propios) | — |
| F12 | — | (sin pendientes propios) | — |
| F13 | 5 | PEN-F13-01..05 | Alta |
| F14 | 5 | PEN-F14-01..05 | Crítica |
| F15 | 5 | PEN-F15-01..05 | Alta |
| F16 | 4 | PEN-F16-01..04 | Alta |
| **TOTAL** | **27** | | |

#### 3.3.2. Pendientes Críticos (Deben resolverse antes de FASE 2 del desarrollo)

| ID | Descripción | Dependencia Principal | Plazo Sugerido |
|----|-------------|----------------------|----------------|
| PEN-F14-01 | Validar SUP-01 y SUP-03 con PoC de API | VAC-02, RH-04 | S4 (Hito H2) |
| PEN-F14-02 | Confirmar infraestructura institucional (SUP-06) | VAC-08, RH-04 | S3 |
| PEN-F13-01 | Confirmar disponibilidad de servidores staging/prod | VAC-08, RH-04 | S3 |
| PEN-F14-05 | Definir priorización MoSCoW formal de RF-01..44 | RH-01, RH-03 | S2 (Hito H1) |
| PEN-F16-01 | Validar mecanismo de aprobación con RH-02 | RH-02 | S1 |

#### 3.3.3. Vacíos de Información No Resueltos

| ID | Vacío | Estado | Estrategia Actual |
|----|-------|--------|-------------------|
| VAC-01 | Catálogo formal de formación civil | ABIERTO | Usar catálogos de Contexto.md + validar con RH-03 |
| VAC-02 | Contrato/Swagger de la API institucional | **CRÍTICO — ABIERTO** | PoC en FASE 2; mock server como fallback |
| VAC-03 | Mecanismo de autenticación de la API | ABIERTO | Probar token, API key, OAuth en PoC |
| VAC-04 | Granularidad de permisos de consulta | ABIERTO | Descubrir en PoC |
| VAC-05 | Normativa de seguridad institucional | ABIERTO | Solicitar a RH-03/RH-04 |
| VAC-06 | Stack tecnológico del backend | **RESUELTO** | Node.js 22 + Express 5 + TS (FASE 10) |
| VAC-07 | Catálogos estructurados de aptitudes | ABIERTO | Modelar desde Contexto.md; E-07 administrable |
| VAC-08 | Entorno de staging disponible | ABIERTO | Pedir a RH-04; contingente VPS si falla |
| VAC-09 | Calidad de datos en la fuente | ABIERTO | Evaluar en PoC; R-04 con plan de mitigación |
| VAC-10 | Volumen de datos (cantidad de registros) | ABIERTO | Estimar en PoC; impacto en paginación |

**Resueltos:** 1/10 (VAC-06). **Abiertos:** 9/10 (la mayoría se resuelven con la PoC en FASE 2).

### 3.4. Resumen Cuantitativo del Anteproyecto

| Categoría | Cantidad | Detalle |
|-----------|----------|---------|
| Fases del anteproyecto | 18 | FASE 0–17 |
| Restricciones | 7 | REST-01..07 |
| Vacíos de información | 10 | VAC-01..10 (9 abiertos) |
| Suposiciones | 14 | SUP-01..08 + SP-01..06 |
| Decisiones previas | 6 | DEC-01..06 |
| Objetivos específicos | 7 | OE-01..07 |
| Ítems de alcance funcional | 10 | AF-01..10 |
| Exclusiones de alcance | 10 | FA-01..10 |
| Límites | 6 | LIM-01..06 |
| Stakeholders | 10 | STK-01..10 |
| Actores del sistema | 5 | ACT-01..05 |
| Módulos funcionales | 9 | MOD-01..09 |
| Requisitos funcionales | 44 | RF-01..44 (37 esenciales + 7 deseables) |
| Requisitos no funcionales | 30 | RNF-01..30 (17 esenciales + 13 deseables) |
| Reglas de negocio | 30 | RN-01..30 |
| Casos de uso | 15 | CU-01..15 (10 especificados) |
| Clases de análisis | 29 | 9B + 8C + 9E + 3I |
| Tablas de base de datos | 9 | Esquema PostgreSQL (FASE 10) |
| Hitos del proyecto | 6 | H1..H6 |
| Recursos identificados | 29 | 5 RH + 15 RS + 4 RW + 5 SV |
| Riesgos | 11 | R-01..R-11 (1 crítico, 6 altos, 4 medios) |
| Métricas de éxito | 34 | 5 MF + 6 MC + 5 MR + 5 MS + 5 MA + 4 MT + 4 MG |
| Criterios de revisión | 8 | CR-01..CR-08 |
| Prefijos de ID definidos | 35+ | Diccionario completo en FASE 16 |
| Pendientes abiertos | 27 | PEN-F0 a PEN-F16 (5 críticos) |
| **Total de elementos trazados** | **~350+** | |

### 3.5. Conclusiones del Anteproyecto

#### 3.5.0. Encuadre de Ejecución

Este anteproyecto documenta el **proyecto integral SECCAP**. La ejecución formal del proyecto se inicia en el marco de una Práctica Profesional Supervisada (PPS), que constituye el hito de arranque académico e institucional. El núcleo funcional priorizado (autenticación, RBAC, consulta con filtros, auditoría y documentación) define el entregable mínimo aceptable.

1. **El proyecto es técnicamente viable** con la arquitectura candidata prioritaria (React 19 + Node.js 22 + PostgreSQL 16), respaldado por el análisis de FASE 10 y FASE 11.

2. **El riesgo dominante es la dependencia de la API institucional** (R-01, exposición 15 — crítica), que condiciona la viabilidad operativa del sistema. La mitigación principal es la PoC temprana (H2, S5) y el diseño con Anti-Corruption Layer.

3. **El costo monetario directo es $0** bajo el escenario base (PPS con open-source e infraestructura institucional). Existe un contingente de ~USD 108 si la institución no provee servidores.

4. **El cronograma de 14 semanas es ajustado pero factible** si se priorizan los requisitos esenciales (90% de 37 RF) y se resuelven los vacíos críticos (VAC-02, VAC-08) antes de S4.

5. **9 de 10 vacíos de información permanecen abiertos**, pero la mayoría se resolverán orgánicamente durante la PoC (FASE 2 del desarrollo). El diseño modular permite adaptar el sistema sin retrabajo mayor.

6. **La seguridad es un pilar no negociable** dado el contexto militar/defensa. Los umbrales de métricas de seguridad (MS-01..MS-05) son absolutos y no admiten degradación.

7. **El anteproyecto produce una base sólida de ~350+ elementos trazados** que permiten iniciar el desarrollo con confianza metodológica, aun con los vacíos pendientes.

8. **El anteproyecto documenta un proyecto de ingeniería de software completo**, defendible académicamente y técnicamente coherente. Su ejecución formal inicia en el marco de la PPS como hito de arranque institucional.

### 3.6. Elementos que Quedan como Sugerencia de Anexos

Los siguientes elementos podrían desarrollarse como anexos complementarios durante el proyecto, pero no forman parte del cuerpo principal del anteproyecto:

| Anexo Sugerido | Contenido | Fase de Elaboración |
|----------------|-----------|---------------------|
| A — Glosario técnico | Definiciones de términos del dominio militar y técnico | Durante desarrollo |
| B — Mockups de interfaz | Wireframes de las pantallas principales (login, dashboard, consulta, resultados) | FASE 4 (frontend) |
| C — Diagrama de secuencia detallado | Secuencias UML para CU-06 (ejecutar consulta) y CU-01 (login) | FASE 3 (backend) |
| D — Esquema completo de BD | DDL de PostgreSQL con constraints, índices y triggers de auditoría | FASE 2 (infraestructura) |
| E — Catálogos de aptitudes y formaciones | Datos completos extraídos de Contexto.md y validados con RH-03 | FASE 2–3 |
| F — Contrato de API (cuando esté disponible) | Swagger/OpenAPI de la API institucional | Post-PoC |
| G — Manual de usuario preliminar | Guía de uso del sistema para consultores | FASE 6 (implantación) |
| H — Acta de aceptación | Documento formal de aprobación por RH-02 y RH-03 | FASE 6 (cierre) |

---

## 4. Tablas y Matrices

### 4.1. Matriz Global de Trazabilidad — Resumen de Relaciones

```
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│PROBLEMA │──>│OBJETIVOS│──>│ ALCANCE │──>│REQUISIT.│──>│CASOS USO│
│ (F1)    │   │ (F2)    │   │ (F3)    │   │(F5/F6)  │   │  (F8)   │
│ 6 dim.  │   │ 7 OE    │   │ 10 AF   │   │ 44 RF   │   │ 15 CU   │
└─────────┘   └─────────┘   └─────────┘   │ 30 RNF  │   └────┬────┘
                                           └────┬────┘        │
                                                │              │
                                           ┌────▼────┐   ┌────▼────┐
                                           │ REGLAS  │   │ CLASES  │
                                           │  (F7)   │   │  (F9)   │
                                           │ 30 RN   │   │ 29 BCE  │
                                           └─────────┘   └────┬────┘
                                                               │
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌────▼────┐
│MÉTRICAS │<──│ RIESGOS │<──│RECURSOS │<──│CRONOG.  │<──│ARQUITEC.│
│  (F15)  │   │  (F14)  │   │  (F13)  │   │ (F12)   │   │ (F10)   │
│ 34 métr.│   │ 11 R    │   │ 29 rec. │   │ 6 hitos │   │ stack   │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
```

### 4.2. Estado General del Anteproyecto por Fase

| FASE | Estado | Observación |
|------|--------|-------------|
| F0 | ✅ Completa | 8 pendientes heredados hacia fases de desarrollo |
| F1 | ✅ Completa | — |
| F2 | ✅ Completa | — |
| F3 | ✅ Completa | — |
| F4 | ✅ Completa | — |
| F5 | ✅ Completa | Priorización MoSCoW pendiente (PEN-F14-05) |
| F6 | ✅ Completa | — |
| F7 | ✅ Completa | — |
| F8 | ✅ Completa | 5 CU sin especificación detallada (secundarios) |
| F9 | ✅ Completa | — |
| F10 | ✅ Completa | Actualizar post-PoC si hay cambios |
| F11 | ✅ Completa | — |
| F12 | ✅ Completa | — |
| F13 | ✅ Completa | Depende de validación de infraestructura |
| F14 | ✅ Completa | Reevaluar riesgos post-PoC |
| F15 | ✅ Completa | Umbrales se configuran como baseline en CI |
| F16 | ✅ Completa | Validar flujo con RH-02 |
| F17 | ✅ Completa | Este documento |

---

## 5. Observaciones

1. **Este documento no agrega contenido nuevo**, sino que integra, verifica y consolida todo lo producido en FASE 0–16. Su valor radica en la visión unificada y la verificación de consistencia.
2. **Los 5 pendientes críticos identificados** (§3.3.2) deben abordarse en las primeras 2–4 semanas del proyecto para no bloquear el desarrollo.
3. **El anteproyecto está diseñado para ser un documento vivo**: las fases se actualizarán a medida que se resuelvan vacíos y se validen suposiciones durante el desarrollo.
4. **La trazabilidad es completa al 100%** entre todos los niveles de abstracción, lo que permite rastrear cualquier requisito desde el problema original hasta su métrica de verificación.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F17-01 | Obtener aprobación formal del anteproyecto por RH-02 | Hito H1, S2 | Crítica |
| PEN-F17-02 | Validar prioridades funcionales con RH-03 | PEN-F14-05 | Alta |
| PEN-F17-03 | Iniciar resolución de VAC-02 (contrato API) | RH-03, RH-04 | Crítica |
| PEN-F17-04 | Elaborar anexos sugeridos según necesidad durante desarrollo | RH-01 | Baja |

---

## 7. Entregable de la Fase
- **Índice general** del anteproyecto con 18 fases
- **Verificación de consistencia cruzada** completa (vertical y horizontal)
- **Consolidación de 27 pendientes** abiertos con 5 identificados como críticos
- **Resumen cuantitativo** con ~350+ elementos trazados
- **Conclusiones** del anteproyecto con 7 hallazgos principales
- **Sugerencia de 8 anexos** para desarrollo futuro

---

## 8. Conexión con la Siguiente Fase
Este documento cierra el anteproyecto. La siguiente actividad es la **presentación y aprobación formal** por parte del Director PPS (RH-02) y el Referente Institucional (RH-03) en el **Hito H1 (Semana 2)**. Una vez aprobado, se inicia la **FASE 2 del proyecto — Infraestructura Base**, comenzando por la configuración del repositorio y la PoC de conexión a la API.
