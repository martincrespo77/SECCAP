# FASE 11 — VIABILIDAD
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Estudio de Viabilidad del Anteproyecto**

## 2. Objetivo
Evaluar la factibilidad del proyecto en cinco dimensiones: técnica, económica, operativa, legal y medioambiental. Cada punto cierra con una conclusión: viable, viable con restricciones, o no viable.

---

## 3. Desarrollo

### 3.1. Viabilidad Técnica

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Existencia de la API** | ✅ Confirmada | La API institucional de solo lectura existe y es la fuente de datos. El sistema se diseña para consumirla |
| **Stack frontend (React/TS/Vite)** | ✅ Maduro y disponible | Tecnologías open-source, ampliamente documentadas, sin restricciones de licencia |
| **Stack backend (Node.js/Express/TS)** | ✅ Maduro y disponible | Tecnología estable, ecosistema npm robusto, soporte LTS |
| **PostgreSQL** | ✅ Disponible | Open-source, instalable en infraestructura institucional estándar |
| **Competencias del equipo** | ⚠️ Supuesto (SUP-08) | Se asume competencia en React y Node.js. Si no la hay, se requiere capacitación que impacta el cronograma |
| **Acceso a la API para desarrollo** | ⚠️ Pendiente (VAC-08) | No se ha confirmado si existe ambiente de staging/sandbox. Sin acceso de prueba, el desarrollo de integración se bloquea |
| **Infraestructura de despliegue** | ⚠️ Pendiente (SUP-06) | Se asume que la institución puede hostear una aplicación web con Node.js + PostgreSQL. Requiere confirmación |
| **Complejidad del sistema** | ✅ Abordable | 44 RF, 30 RNF, 15 CU — volumen manejable para un equipo reducido en ~14 semanas con enfoque iterativo |

**Conclusión: VIABLE CON RESTRICCIONES**
El proyecto es técnicamente factible con las tecnologías propuestas. Las restricciones dependen de la confirmación de acceso a la API en entorno de desarrollo (VAC-08) y de la disponibilidad de infraestructura de despliegue institucional (SUP-06). Si alguna de estas condiciones no se cumple, se deberán implementar planes de contingencia (mock de API para desarrollo; despliegue alternativo).

### 3.2. Viabilidad Económica

| Concepto | Costo Estimado | Observación |
|---|---|---|
| **Licencias de software** | $0 | Todo el stack es open-source (React, Node.js, PostgreSQL, Vite, Tailwind) |
| **Infraestructura de servidores** | PENDIENTE | Depende de si se usa infraestructura existente (costo $0 incremental) o se requiere nuevo hardware/VPS |
| **Recursos humanos** | $0 (recurso institucional) | El desarrollo lo realiza el alumno como parte del proyecto. No hay contratación externa |
| **Capacitación** | $0 / mínimo | Se asume competencia previa. Si se requiere, se estima en horas de autoformación |
| **Mantenimiento post-implantación** | PENDIENTE | Depende de si la institución asigna personal para soporte o si queda como responsabilidad del área de informática |
| **Certificados SSL** | $0 / mínimo | Let's Encrypt gratuito, o certificado institucional existente |
| **Dominio** | $0 | Se utilizaría subdominio institucional existente |

**Conclusión: VIABLE**
El costo directo del proyecto es mínimo al utilizar stack 100% open-source y recursos institucionales. Los costos de infraestructura dependen de la disponibilidad institucional. No se identifican barreras económicas significativas.

> **Nota:** Las estimaciones detalladas de horas y costos se desarrollarán en la FASE 13 (Recursos y Presupuesto). Los valores aquí presentados son de alto nivel.

### 3.3. Viabilidad Operativa

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Necesidad organizacional** | ✅ Confirmada | El problema está documentado y validado. Existe demanda real de una herramienta de consulta |
| **Disponibilidad del cliente** | ⚠️ Supuesto (SUP-04) | Se asume participación activa en validaciones. Si no se cumple, los ciclos iterativos se retrasan |
| **Resistencia al cambio** | ⚠️ Riesgo bajo-medio | Los usuarios actuales realizan consultas manuales. La herramienta simplifica su trabajo, pero requiere capacitación básica |
| **Capacitación de usuarios** | ✅ Factible | La interfaz se diseñará con principios de usabilidad. La capacitación requerida es básica |
| **Integración con procesos existentes** | ✅ No disruptiva | El sistema no reemplaza procesos existentes ni modifica datos; solo agrega un canal de consulta controlado |
| **Sostenibilidad post-proyecto** | ⚠️ Pendiente | Se requiere que la institución designe un responsable de operación y soporte post-implantación |

**Conclusión: VIABLE CON RESTRICCIONES**
El proyecto es operativamente factible. Las restricciones se centran en la participación activa del cliente durante el desarrollo (SUP-04) y en la definición de un plan de sostenibilidad post-implantación.

### 3.4. Viabilidad Legal

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Protección de datos personales** | ⚠️ Requiere cumplimiento | Le aplica la Ley 25.326 (Protección de Datos Personales). El sistema no almacena datos de personal, pero los consulta y visualiza. Se implementa RBAC, auditoría y mínimo privilegio |
| **Normativa interna de Defensa** | ⚠️ Pendiente (VAC-05) | No se ha relevado formalmente qué normativas específicas de seguridad de la información aplican. Se requiere validación con el Área de Seguridad |
| **Licencias de software** | ✅ Sin restricción | Todo el stack es open-source con licencias permisivas (MIT, Apache 2.0, ISC) |
| **Acceso autorizado a la API** | ✅ Mandato institucional | El acceso a la API es autorizado por el Área de Personal como parte del proyecto |
| **No replicación de datos sensibles** | ✅ Por diseño | El sistema no almacena datos de personal localmente (REST-04). Esto mitiga riesgos legales de custodia de datos |

**Conclusión: VIABLE CON RESTRICCIONES**
Es viable legalmente siempre que se cumplan las normativas de protección de datos y se obtenga la validación del Área de Seguridad de la Información respecto a la normativa interna (VAC-05).

### 3.5. Viabilidad Medioambiental

| Aspecto | Evaluación | Detalle |
|---|---|---|
| **Consumo energético** | ✅ Mínimo | El sistema es una aplicación web que no requiere hardware adicional significativo. Se ejecuta sobre infraestructura existente |
| **Residuos electrónicos** | ✅ Nulo | No se adquiere hardware nuevo específico para el proyecto |
| **Reducción de papel** | ✅ Positivo | La digitalización de consultas reduce potencialmente la impresión de documentación en papel |
| **Huella de carbono** | ✅ Despreciable | El incremento de consumo energético por un servidor web adicional es insignificante |

**Conclusión: VIABLE**
No se identifican impactos medioambientales negativos. El proyecto contribuye marginalmente a la reducción de papel.

---

## 4. Tablas y Matrices

### 4.1. Resumen de Viabilidad

| Dimensión | Conclusión | Condiciones/Restricciones |
|---|---|---|
| Técnica | **Viable con restricciones** | Requiere confirmar acceso a API de staging y disponibilidad de infraestructura de despliegue |
| Económica | **Viable** | Costo mínimo (open-source + recursos institucionales). Infraestructura pendiente pero de bajo costo |
| Operativa | **Viable con restricciones** | Requiere participación activa del cliente y plan de sostenibilidad post-proyecto |
| Legal | **Viable con restricciones** | Requiere validación de normativa interna de seguridad (VAC-05) |
| Medioambiental | **Viable** | Sin impacto negativo |

---

## 5. Observaciones

1. **Ninguna dimensión resultó "No viable"**, lo cual confirma que el proyecto puede continuar con confianza razonable.

2. Las **restricciones** identificadas son gestionables y ya están registradas como pendientes y riesgos en fases anteriores. No representan barreras insalvables sino condiciones a verificar.

3. La viabilidad económica es particularmente favorable por el uso de stack 100% open-source y la disponibilidad de recursos institucionales.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F11-01 | Confirmar compatibilidad de infraestructura institucional con Node.js/Docker | Director de Proyecto + Área de Informática | Crítica |
| PEN-F11-02 | Relevar normativa interna de seguridad de la información aplicable (VAC-05) | Director de Proyecto | Alta |
| PEN-F11-03 | Definir plan de sostenibilidad/transferencia post-implantación | Director de Proyecto + Cliente | Media |

---

## 7. Entregable Generado

**"Estudio de Viabilidad del Anteproyecto"** — Documento `11_viabilidad.md`

Contenido:
- ✅ 5 dimensiones de viabilidad evaluadas
- ✅ Conclusión por dimensión con justificación
- ✅ Tabla resumen consolidada
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 12 — Planificación y Cronograma**

Se construirá la EDT/WBS de baja granularidad, se definirán fases, tareas principales, hitos, dependencias y un cronograma preliminar con enfoque iterativo e incremental.

> **Precondición:** Arquitectura y viabilidad definidas. No existen dependencias bloqueantes.
