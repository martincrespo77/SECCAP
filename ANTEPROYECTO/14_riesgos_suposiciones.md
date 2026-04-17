# FASE 14 — RIESGOS Y SUPOSICIONES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Análisis de Riesgos y Formalización de Suposiciones**

## 2. Objetivo
Identificar, clasificar y evaluar los riesgos del proyecto, definir estrategias de respuesta con responsables asignados, y consolidar todas las suposiciones formuladas a lo largo de las fases anteriores, evaluando su probabilidad de fallo y su impacto.

---

## 3. Desarrollo

### 3.1. Metodología de Evaluación de Riesgos

Se utiliza una **matriz Probabilidad × Impacto** con escalas cualitativas:

**Probabilidad:**
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Muy Baja | 1 | < 10% de ocurrencia |
| Baja | 2 | 10–30% |
| Media | 3 | 30–50% |
| Alta | 4 | 50–70% |
| Muy Alta | 5 | > 70% |

**Impacto:**
| Nivel | Valor | Descripción |
|-------|-------|-------------|
| Muy Bajo | 1 | Ajuste menor, sin afectar alcance ni cronograma |
| Bajo | 2 | Retraso ≤ 1 semana o degradación menor |
| Medio | 3 | Retraso 1–2 semanas o reducción parcial de funcionalidad |
| Alto | 4 | Retraso > 2 semanas o funcionalidad crítica afectada |
| Muy Alto | 5 | Proyecto inviable o entregable inaceptable |

**Exposición al riesgo** = Probabilidad × Impacto

| Exposición | Rango | Acción |
|------------|-------|--------|
| Crítica | 15–25 | Plan de respuesta obligatorio e inmediato |
| Alta | 10–14 | Plan de respuesta obligatorio |
| Media | 5–9 | Monitorear activamente, plan de contingencia |
| Baja | 1–4 | Aceptar y monitorear |

### 3.2. Registro de Riesgos

#### R-01 — Dependencia total de la API institucional
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Integración |
| **Descripción** | El sistema depende al 100% de la disponibilidad y correcto funcionamiento de la API institucional de RRHH. Si la API no está disponible, no se pueden realizar consultas. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 5 (Muy Alto) |
| **Exposición** | **15 — Crítica** |
| **Restricciones relacionadas** | REST-01, REST-02 |
| **Vacíos relacionados** | VAC-02 (contrato), VAC-03 (auth), VAC-08 (staging) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Solicitar documentación de API en FASE 2. (2) Implementar mock server para desarrollo sin API real. (3) Diseñar capa de integración con timeout, circuit breaker y fallback a caché. (4) Incluir pantalla de estado de conexión (B-08). |
| **Responsable** | RH-01 (mitigación técnica), RH-03 (gestión de acceso) |
| **Indicador de activación** | No se obtiene acceso a API antes de S4 |

#### R-02 — Cambios en el contrato de la API
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Integración |
| **Descripción** | La API institucional podría cambiar su estructura de datos, endpoints o mecanismo de autenticación sin previo aviso, rompiendo la integración. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **12 — Alta** |
| **Restricciones relacionadas** | REST-01, REST-02 |
| **Vacíos relacionados** | VAC-02 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Implementar patrón Anti-Corruption Layer (I-01) para aislar cambios. (2) Centralizar mapeo API→dominio en MapperRespuestaAPI (I-03). (3) Versionado de DTOs de respuesta. (4) Tests de contrato automatizados. |
| **Responsable** | RH-01 |
| **Indicador de activación** | Respuesta de API difiere del mapeo esperado |

#### R-03 — Permisos insuficientes sobre datos de personal
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Acceso |
| **Descripción** | La institución podría restringir el acceso a ciertos campos o registros de la API, impidiendo implementar filtros planificados. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Restricciones relacionadas** | REST-03, REST-04 |
| **Vacíos relacionados** | VAC-04 (granularidad de permisos) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Solicitar catálogo completo de campos accesibles en FASE 2. (2) Diseño modular de filtros: si un campo no está disponible, el filtro se deshabilita sin romper la UI. (3) Documentar campos ausentes como limitación. |
| **Responsable** | RH-01, RH-03 |
| **Indicador de activación** | PoC revela campos inaccesibles |

#### R-04 — Datos incompletos o inconsistentes en la fuente
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Calidad de Datos |
| **Descripción** | Los datos devueltos por la API podrían tener campos nulos, formatos inconsistentes o registros duplicados, afectando la calidad de las consultas. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Vacíos relacionados** | VAC-09 (calidad de datos) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Validación y sanitización en la capa de integración (C-03, I-01). (2) Manejo de nulos con valores por defecto o indicador visual "Sin dato". (3) Logging de anomalías para cuantificar el problema. (4) No filtrar por campos con alta tasa de nulos. |
| **Responsable** | RH-01 |
| **Indicador de activación** | > 10% de registros con campos críticos nulos en PoC |

#### R-05 — Vulnerabilidades de seguridad
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Seguridad |
| **Descripción** | El sistema podría presentar vulnerabilidades (XSS, CSRF, inyección, exposición de datos sensibles) que comprometan información de personal militar. |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 5 (Muy Alto) |
| **Exposición** | **10 — Alta** |
| **Restricciones relacionadas** | REST-03, REST-04 |
| **Requisitos relacionados** | RNF-01..RNF-07 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Aplicar OWASP Top 10 como checklist obligatorio. (2) Implementar Helmet, CORS restrictivo, rate limiting, CSP. (3) Sanitizar toda entrada con Zod/Joi. (4) Auditoría de dependencias con `npm audit`. (5) Revisión de seguridad en FASE 5. |
| **Responsable** | RH-01, RH-02 (revisión) |
| **Indicador de activación** | `npm audit` con vulnerabilidades high/critical |

#### R-06 — Retraso por requisitos no cerrados
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Alcance |
| **Descripción** | Los requerimientos no están completamente cerrados (REST-05). Cambios de alcance durante el desarrollo podrían retrasar el cronograma de 14 semanas. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Restricciones relacionadas** | REST-05 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Priorización MoSCoW de requisitos; implementar primero los esenciales. (2) Congelar alcance del ciclo actual antes de FASE 3. (3) Cambios posteriores se evalúan con control de cambios (FASE 16). (4) Buffer de 1 semana contemplado en cronograma FASE 12. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Solicitud de cambio que afecta > 3 requisitos esenciales después de S4 |

#### R-07 — Incompatibilidad tecnológica con infraestructura institucional
| Atributo | Valor |
|----------|-------|
| **Categoría** | Técnico / Infraestructura |
| **Descripción** | La infraestructura institucional podría no soportar Node.js, PostgreSQL o las versiones requeridas, impidiendo el despliegue. |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **8 — Media** |
| **Vacíos relacionados** | VAC-08 |
| **Supuestos relacionados** | SUP-06 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Validar stack con Admin TI (RH-04) en FASE 2. (2) Preparar despliegue con Docker como alternativa portable. (3) Mantener Express como backend por su bajo acoplamiento al runtime. (4) Como último recurso, considerar VPS externo (costo contingente FASE 13). |
| **Responsable** | RH-01, RH-04 |
| **Indicador de activación** | RH-04 informa restricciones de stack en S3 |

#### R-08 — Ausencia de documentación fuente de los catálogos
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Información |
| **Descripción** | No existe documentación formal de los catálogos de aptitudes, cursos y formaciones, dificultando la implementación de filtros jerárquicos. |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **12 — Alta** |
| **Vacíos relacionados** | VAC-01 (catálogo formación civil), VAC-07 (catálogos estructurados) |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Extraer catálogos del análisis de Contexto.md como base inicial. (2) Validar con RH-03 la completitud. (3) Diseñar catálogos como entidad administrable (E-07, CU-13). (4) Aceptar catálogos parciales en primera iteración. |
| **Responsable** | RH-01, RH-03 |
| **Indicador de activación** | RH-03 no puede validar > 50% de los catálogos propuestos antes de S5 |

#### R-09 — Sobrecarga del alumno por concentración de roles
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Recursos Humanos |
| **Descripción** | El alumno cumple todos los roles técnicos simultáneamente (RH-01). Enfermedad, compromisos académicos paralelos o burnout podrían detener el proyecto. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Exposición** | **12 — Alta** |
| **Recursos relacionados** | RH-01, SP-01 |
| **Estrategia** | Mitigar + Aceptar |
| **Plan de respuesta** | (1) Planificación realista con buffer (FASE 12). (2) Priorización MoSCoW para asegurar MVP ante reducción de disponibilidad. (3) Commits frecuentes para evitar pérdida de trabajo. (4) Comunicación temprana con RH-02 ante bloqueos. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Desvío > 1 semana respecto al cronograma |

#### R-10 — Falta de participación del cliente/referente
| Atributo | Valor |
|----------|-------|
| **Categoría** | Organizacional / Comunicación |
| **Descripción** | El referente institucional (RH-03) podría no estar disponible para validaciones, bloqueando decisiones de alcance, priorización y UAT. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Supuestos relacionados** | SUP-04 |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Establecer canal de comunicación formal desde FASE 1. (2) Definir ventanas de validación obligatorias alineadas con hitos (H1, H4, H5, H6). (3) Si no hay respuesta en 5 días, escalar a RH-02. (4) Documentar decisiones no validadas como SUPUESTO. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Sin respuesta de RH-03 en 5 días hábiles |

#### R-11 — Desalineación de expectativas sobre el alcance entregable
| Atributo | Valor |
|----------|-------|
| **Categoría** | Gestión / Alcance |
| **Descripción** | Los stakeholders podrían generar expectativas sobre funcionalidades complementarias (exportación avanzada, administración extendida, integraciones adicionales) que exceden el núcleo funcional priorizado, provocando desalineación entre lo esperado y lo entregado. |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 3 (Medio) |
| **Exposición** | **9 — Media** |
| **Estrategia** | Mitigar |
| **Plan de respuesta** | (1) Mantener el alcance funcional documentado y priorizado según FASE 3. (2) Validar expectativas con el referente institucional en cada hito. (3) Documentar funcionalidades diferidas como trabajo futuro. |
| **Responsable** | RH-01, RH-02 |
| **Indicador de activación** | Solicitud de funcionalidades no priorizadas como núcleo funcional |

### 3.3. Mapa de Calor de Riesgos

```
                        IMPACTO
              1       2       3       4       5
         ┌───────┬───────┬───────┬───────┬───────┐
    5    │       │       │       │       │       │
         ├───────┼───────┼───────┼───────┼───────┤
P   4    │       │       │ R-04  │       │       │
R        │       │       │ R-06  │       │       │
O        │       │       │ R-08  │       │       │
B   ├───────┼───────┼───────┼───────┼───────┤
A   3    │       │       │ R-03  │ R-09  │ R-01  │
B        │       │       │ R-10  │       │       │
.   ├───────┼───────┼───────┼───────┼───────┤
    2    │       │       │       │ R-07  │ R-05  │
         ├───────┼───────┼───────┼───────┼───────┤
    1    │       │       │       │       │       │
         └───────┴───────┴───────┴───────┴───────┘
```

**Distribución:** 1 riesgo crítico (R-01), 6 riesgos altos (R-02, R-04, R-05, R-06, R-08, R-09), 4 riesgos medios (R-03, R-07, R-10, R-11), 0 riesgos bajos.

### 3.4. Consolidación de Suposiciones

A lo largo de las fases 0–13 se han formulado las siguientes suposiciones. Se presenta su estado actual y probabilidad de fallo:

| ID | Suposición | Origen | Prob. Fallo | Impacto si Falsa | Estado |
|----|------------|--------|-------------|-------------------|--------|
| SUP-01 | La API institucional sigue el patrón REST y devuelve JSON | F0 | Baja | Rediseño de capa de integración | PENDIENTE validación en PoC |
| SUP-02 | Los catálogos de aptitudes son relativamente estables | F0 | Media | Frecuencia alta de actualización de caché | PENDIENTE validación con RH-03 |
| SUP-03 | Los datos de personal incluyen los campos necesarios para los filtros diseñados | F0 | Media | Reducción del alcance de filtros | PENDIENTE validación con API |
| SUP-04 | El referente institucional participa activamente en validaciones | F0 | Media | Decisiones sin validar; riesgo de retrabajo | PENDIENTE (depende de RH-03) |
| SUP-05 | Se puede implementar RBAC con los roles identificados sin cambios organizacionales | F0 | Baja | Ajuste del modelo de roles | PENDIENTE validación en F1 |
| SUP-06 | La institución provee infraestructura para staging y producción | F0 | Media | Activar presupuesto contingente (FASE 13) | PENDIENTE (depende de VAC-08) |
| SUP-07 | El alcance del sistema se limita a consulta Read-Only (sin ABM de personal) | F0 | Muy Baja | Cambio mayor de arquitectura; fuera de alcance del proyecto | VIGENTE — confirmado por restricciones |
| SUP-08 | 14 semanas son suficientes para entregar el MVP con los requisitos esenciales | F0 | Media | Reducción de funcionalidad al MVP mínimo | VIGENTE — soportado por cronograma F12 |
| SP-01 | La PPS no es remunerada | F13 | Muy Baja | Contemplar compensación | VIGENTE |
| SP-02 | Software open-source se mantiene gratuito durante el proyecto | F13 | Muy Baja | Buscar alternativas | VIGENTE |
| SP-03 | La institución provee servidores (= SUP-06) | F13 | Media | Activar contingente ~USD 108 | PENDIENTE |
| SP-04 | GitHub Free tier es suficiente para CI/CD | F13 | Baja | Evaluar GitHub Pro | VIGENTE |
| SP-05 | No se requiere licenciamiento para consumir la API | F13 | Baja | Negociar con la institución | PENDIENTE |
| SP-06 | El equipo del alumno cumple especificaciones mínimas | F13 | Muy Baja | Actualización de equipo | VIGENTE |

### 3.5. Plan de Monitoreo de Riesgos

| Frecuencia | Actividad | Responsable |
|------------|-----------|-------------|
| Semanal | Revisión de estado de riesgos activos en reunión con tutor | RH-01, RH-02 |
| Por hito | Reevaluación de probabilidad e impacto de cada riesgo | RH-01 |
| Ante evento | Activación del plan de respuesta correspondiente; registro en bitácora | RH-01 |
| Fin de fase | Actualización del registro de riesgos y suposiciones | RH-01 |

---

## 4. Tablas y Matrices

### 4.1. Resumen Ejecutivo de Riesgos (Ordenado por Exposición)

| ID | Riesgo | Prob | Imp | Exp | Estrategia |
|----|--------|------|-----|-----|------------|
| R-01 | Dependencia total de la API | 3 | 5 | **15** | Mitigar |
| R-02 | Cambios en contrato API | 3 | 4 | **12** | Mitigar |
| R-04 | Datos incompletos/inconsistentes | 4 | 3 | **12** | Mitigar |
| R-06 | Retraso por requisitos no cerrados | 4 | 3 | **12** | Mitigar |
| R-08 | Sin documentación de catálogos | 4 | 3 | **12** | Mitigar |
| R-09 | Sobrecarga del alumno | 3 | 4 | **12** | Mitigar + Aceptar |
| R-05 | Vulnerabilidades de seguridad | 2 | 5 | **10** | Mitigar |
| R-03 | Permisos insuficientes sobre datos | 3 | 3 | **9** | Mitigar |
| R-10 | Falta de participación del cliente | 3 | 3 | **9** | Mitigar |
| R-07 | Incompatibilidad con infra institucional | 2 | 4 | **8** | Mitigar |

### 4.2. Trazabilidad Riesgos → Fases del Proyecto Afectadas

| Riesgo | F1 | F2 | F3 | F4 | F5 | F6 |
|--------|----|----|----|----|----|----|
| R-01 | — | ● | ● | ● | ● | ● |
| R-02 | — | — | ● | — | ● | ● |
| R-03 | ● | ● | ● | ● | — | — |
| R-04 | — | — | ● | ● | ● | — |
| R-05 | — | — | ● | ● | ● | ● |
| R-06 | ● | — | ● | ● | — | — |
| R-07 | — | ● | — | — | — | ● |
| R-08 | ● | — | ● | ● | — | — |
| R-09 | ● | ● | ● | ● | ● | ● |
| R-10 | ● | — | — | ● | ● | ● |

---

## 5. Observaciones

1. **El riesgo R-01 (dependencia de API) es el único con exposición crítica** y condiciona la viabilidad operativa del sistema. Su mitigación es prioritaria y debe validarse en la PoC (S4–S5).
2. **6 de 10 riesgos tienen exposición alta (12)**, lo cual es esperable en un proyecto con alta dependencia externa y equipo unipersonal.
3. **No se identificaron riesgos de exposición baja**, lo que refleja un proyecto con un perfil de riesgo medio-alto, coherente con la evaluación de viabilidad (FASE 11).
4. **Las suposiciones SUP-01, SUP-03 y SUP-06 son las más críticas** y deben validarse en las primeras semanas del proyecto (FASE 2).

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F14-01 | Validar SUP-01 y SUP-03 con PoC de conexión a API | FASE 2, RH-04, VAC-02 | Crítica |
| PEN-F14-02 | Confirmar SUP-06 (infraestructura institucional) | RH-04, VAC-08 | Alta |
| PEN-F14-03 | Establecer canal de comunicación formal con RH-03 | RH-01, RH-02 | Alta |
| PEN-F14-04 | Ejecutar `npm audit` en cada fase de desarrollo | RH-01 | Media |
| PEN-F14-05 | Definir criterio MoSCoW formal para requisitos RF-01..44 | RH-01, RH-03 | Alta |

---

## 7. Entregable de la Fase
- **Registro de riesgos** con 10 riesgos evaluados (R-01..R-10), cada uno con plan de respuesta, responsable e indicador de activación
- **Mapa de calor** de riesgos (Probabilidad × Impacto)
- **Consolidación de 14 suposiciones** (SUP-01..08 + SP-01..06) con estado y probabilidad de fallo
- **Trazabilidad** riesgos → fases afectadas
- **Plan de monitoreo** periódico

---

## 8. Conexión con la Siguiente Fase
Los riesgos y suposiciones alimentan la definición de **métricas de éxito** (FASE 15), particularmente las métricas de rendimiento (vinculadas a R-01, R-04), seguridad (R-05) y adopción (R-10). También proveen los criterios de aceptación para las pruebas de la FASE 5 del proyecto.
