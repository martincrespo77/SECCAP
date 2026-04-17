# FASE 4 — STAKEHOLDERS Y ACTORES
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Mapa de Stakeholders y Actores**

## 2. Objetivo
Identificar formalmente a los interesados del proyecto (stakeholders) y los actores del sistema, clasificándolos por rol, interés, influencia, expectativa y relación con el proyecto. Los actores del sistema servirán como insumo directo para la especificación de casos de uso (FASE 8).

---

## 3. Desarrollo

### 3.1. Tabla de Stakeholders

| ID | Stakeholder | Rol | Interés | Influencia | Expectativa | Relación con el Proyecto |
|---|---|---|---|---|---|---|
| STK-01 | **Patrocinador del Proyecto** (Jefe/Director del Área de Personal) | Autoridad que valida y aprueba el proyecto | Alto | Alta | Obtener una herramienta que optimice la consulta de capacidades del personal bajo su responsabilidad | Sponsor. Aprueba alcance, cambios y entregables finales |
| STK-02 | **Director del Proyecto** (Practicante PPS) | Responsable de planificar, ejecutar y entregar el proyecto | Alto | Alta | Cumplir los objetivos del proyecto dentro del marco académico y temporal de la PPS | Líder técnico y de gestión. Ejecutor principal |
| STK-03 | **Tutor Académico** | Supervisor académico de la PPS | Medio | Media | Que el proyecto cumpla estándares académicos de ingeniería de software | Evaluador. Valida la calidad técnica y documental |
| STK-04 | **Responsable del Área de Informática / Infraestructura** | Proveedor de la API institucional y del soporte técnico | Alto | Alta | Que el nuevo sistema no comprometa la seguridad de la infraestructura existente; que no genere carga excesiva sobre la API | Proveedor técnico. Habilita acceso a la API, ambientes y recursos |
| STK-05 | **Jefes de Unidad / Dependencia** | Usuarios finales de nivel intermedio | Alto | Media | Consultar ágilmente las capacidades del personal bajo su mando para asignación de funciones y misiones | Usuarios directos del sistema |
| STK-06 | **Oficiales de Planeamiento** | Usuarios finales con necesidad de consultas transversales | Alto | Baja | Obtener información cruzada sobre aptitudes del personal para planificación operativa | Usuarios directos del sistema |
| STK-07 | **Personal administrativo del Área de Personal** | Operadores actuales de las consultas manuales | Medio | Baja | Reducir la carga de trabajo manual que les genera atender consultas por canales informales | Beneficiarios indirectos; pueden ser usuarios del sistema |
| STK-08 | **Área de Seguridad de la Información** | Responsable de políticas de protección de datos | Alto | Alta | Que el sistema cumpla con las normativas de seguridad, trazabilidad y mínimo privilegio | Regulador interno. Puede requerir auditorías y revisiones |
| STK-09 | **Personal sujeto de consulta** | Personas cuya información es consultada | Bajo (pasivo) | Baja | Que sus datos sean tratados con confidencialidad y solo accedidos por personal autorizado | Sujetos de datos. No interactúan con el sistema |
| STK-10 | **Dirección / Comandancia** | Nivel superior de toma de decisiones | Medio | Alta | Visibilidad consolidada sobre capacidades del personal para decisiones estratégicas | Consumidor indirecto de la información |

### 3.2. Matriz de Influencia / Interés

```
                    INFLUENCIA
                  Baja         Alta
              ┌───────────┬───────────┐
    Alto      │ STK-05    │ STK-01    │
              │ STK-06    │ STK-02    │
  INTERÉS     │           │ STK-04    │
              │           │ STK-08    │
              ├───────────┼───────────┤
    Bajo      │ STK-07    │ STK-03    │
              │ STK-09    │ STK-10    │
              └───────────┴───────────┘
```

**Estrategia por cuadrante:**

| Cuadrante | Stakeholders | Estrategia |
|---|---|---|
| Alto interés / Alta influencia | STK-01, STK-02, STK-04, STK-08 | **Gestionar de cerca.** Comunicación constante, participación en validaciones, aprobaciones formales |
| Alto interés / Baja influencia | STK-05, STK-06 | **Mantener informados.** Participan en validaciones de usabilidad y UAT |
| Bajo interés / Alta influencia | STK-03, STK-10 | **Mantener satisfechos.** Reportes periódicos, entregables formales |
| Bajo interés / Baja influencia | STK-07, STK-09 | **Monitorear.** Comunicación mínima, considerar si algo cambia su nivel de interés |

### 3.3. Actores del Sistema

Los actores del sistema son las entidades (humanas o no) que interactúan directamente con el sistema y que serán modelados en los casos de uso (FASE 8).

| ID | Actor | Tipo | Descripción | Funcionalidades Accesibles |
|---|---|---|---|---|
| ACT-01 | **Administrador del Sistema** | Humano — Primario | Usuario con máximos privilegios. Gestiona usuarios, roles, configuraciones y accede a logs de auditoría | AF-01, AF-02, AF-03, AF-04, AF-05, AF-06, AF-07, AF-09, AF-10 |
| ACT-02 | **Consultor** | Humano — Primario | Usuario autorizado a realizar consultas sobre capacidades y aptitudes del personal. Sus resultados están filtrados por rol | AF-01, AF-03, AF-04, AF-05, AF-06, AF-09, AF-10 |
| ACT-03 | **Auditor** | Humano — Primario | Usuario con acceso a los registros de auditoría y trazabilidad del sistema. Puede consultar quién accedió a qué información | AF-01, AF-07, AF-09 |
| ACT-04 | **API Institucional de RRHH** | Sistema externo — Secundario | Sistema proveedor de datos. Recibe consultas parametrizadas del backend proxy y devuelve información de personal en formato JSON | AF-04, AF-10 |
| ACT-05 | **Módulo de Auditoría Local** | Componente interno del sistema | Subsistema interno que registra automáticamente cada operación de consulta. No es un actor externo sino un componente arquitectónico del SECCAP | AF-07 |

### 3.4. Relación Stakeholders → Actores

| Stakeholder | Actor del Sistema | Justificación |
|---|---|---|
| STK-02 (Director del Proyecto) | ACT-01 (Administrador) | Durante el desarrollo y pruebas, el director actuará como administrador |
| STK-05 (Jefes de Unidad) | ACT-02 (Consultor) | Su función principal es consultar capacidades del personal |
| STK-06 (Oficiales de Planeamiento) | ACT-02 (Consultor) | Consultas transversales sobre aptitudes |
| STK-07 (Personal administrativo) | ACT-02 (Consultor) o ACT-01 (Administrador) | Según nivel de acceso asignado |
| STK-08 (Área de Seguridad) | ACT-03 (Auditor) | Requiere acceso a registros de auditoría |
| STK-04 (Área de Informática) | — (no es usuario directo) | Provee la API; no interactúa con el frontend |
| STK-01, STK-03, STK-09, STK-10 | — (no son usuarios directos) | Son interesados del proyecto, no actores del sistema |

---

## 4. Tablas y Matrices

### 4.1. Matriz de Permisos Preliminar por Actor

| Funcionalidad | ACT-01 Admin | ACT-02 Consultor | ACT-03 Auditor |
|---|---|---|---|
| AF-01 Login | ✅ | ✅ | ✅ |
| AF-02 Gestión de roles | ✅ | ❌ | ❌ |
| AF-03 Filtros jerárquicos | ✅ | ✅ | ❌ |
| AF-04 Consumo API | ✅ | ✅ (filtrado por rol) | ❌ |
| AF-05 Visualización resultados | ✅ | ✅ (campos según rol) | ❌ |
| AF-06 Vista de detalle | ✅ | ✅ (campos según rol) | ❌ |
| AF-07 Auditoría | ✅ | ❌ | ✅ |
| AF-08 Manejo errores | ✅ | ✅ | ✅ |
| AF-09 Dashboard | ✅ (completo) | ✅ (parcial) | ✅ (solo auditoría) |
| AF-10 Catálogos | ✅ | ✅ | ❌ |

---

## 5. Observaciones

1. **Nombres de stakeholders pendientes:** Los nombres y cargos reales continúan como PENDIENTE (VAC-07). Los stakeholders están identificados por rol funcional, lo cual es suficiente para las fases de análisis.

2. **Actor ACT-04 (API externa):** Es un actor no humano pero fundamental para el modelado de casos de uso. Toda interacción del sistema con la API debe pasar por el backend proxy, nunca directamente desde el frontend.

3. **Rol de Auditor (ACT-03):** Se separó del Administrador intencionalmente para aplicar el principio de **segregación de funciones** — quien administra el sistema no debería ser quien audita su uso.

4. **Escalabilidad de roles:** La matriz de permisos es preliminar. El RBAC definitivo se detallará en la fase de reglas de negocio (FASE 7) y se validará en las pruebas de seguridad.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F4-01 | Completar nombres y cargos reales de STK-01, STK-04 y STK-08 | Director de Proyecto | Baja |
| PEN-F4-02 | Validar con el cliente si existen otros tipos de usuarios más allá de Administrador, Consultor y Auditor | Equipo + Cliente | Media |
| PEN-F4-03 | Confirmar si la Dirección/Comandancia (STK-10) requiere un rol de «solo dashboards» con datos agregados | Director de Proyecto | Baja |

---

## 7. Entregable Generado

**"Mapa de Stakeholders y Actores"** — Documento `04_stakeholders_actores.md`

Contenido entregado:
- ✅ Tabla de 10 stakeholders identificados
- ✅ Matriz de Influencia/Interés con estrategia por cuadrante
- ✅ 5 actores del sistema (3 humanos, 2 sistemas)
- ✅ Relación Stakeholders → Actores
- ✅ Matriz de permisos preliminar por actor
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 5 — Requisitos Funcionales**

Se formalizarán los requisitos funcionales del sistema, organizados por módulos, con prioridad, dependencias y reglas asociadas. Se usarán como referencia las funcionalidades del alcance (AF-01 a AF-10) y la estructura de filtros relevada en el contexto.

> **Precondición:** No existen dependencias bloqueantes. Los stakeholders y actores están identificados.
