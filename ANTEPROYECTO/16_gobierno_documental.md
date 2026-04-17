# FASE 16 — GOBIERNO DOCUMENTAL
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Gobierno Documental y Control de Cambios**

## 2. Objetivo
Establecer los criterios de revisión, validación y aprobación de los entregables del proyecto, definir la política de control de cambios, el mecanismo de actualización documental y los responsables de cada instancia de gobierno.

---

## 3. Desarrollo

### 3.1. Estructura Documental del Proyecto

El proyecto produce dos cuerpos documentales diferenciados:

| Cuerpo | Ubicación | Contenido | Formato |
|--------|-----------|-----------|---------|
| **Anteproyecto** | `ANTEPROYECTO/` | 18 fases (FASE 0–17) del documento de análisis y planificación | Markdown (.md) |
| **Documentación PMBOK** | `DOCUMENTOS/` | 12 documentos de gestión formal (01–12) | Markdown (.md) |

Adicionalmente se mantiene:
- `TRAZABILIDAD/` — Registro cronológico de actividades por fase de desarrollo
- `Contexto.md` — Documento fuente con todo el análisis previo y datos de la institución
- Código fuente y configuración en `frontend/`, `backend/` (por crear)

### 3.2. Criterios de Revisión

Cada entregable documental debe evaluarse contra los siguientes criterios antes de considerarse aprobado:

| ID | Criterio | Descripción | Aplica a |
|----|----------|-------------|----------|
| CR-01 | Completitud | Todas las secciones obligatorias están presentes y desarrolladas | Todo documento |
| CR-02 | Consistencia interna | No hay contradicciones dentro del mismo documento | Todo documento |
| CR-03 | Consistencia cruzada | Referencias a IDs de otros documentos son correctas (RF→CU, CU→RN, etc.) | Anteproyecto |
| CR-04 | Trazabilidad | Cada elemento tiene trazabilidad hacia arriba (objetivo/problema) y hacia abajo (implementación/prueba) | Anteproyecto |
| CR-05 | Justificación | Decisiones técnicas están fundamentadas, no arbitrarias | FASE 10, FASE 11 |
| CR-06 | Pendientes explícitos | Los vacíos y pendientes están marcados como PEN/PENDIENTE, no ocultados | Todo documento |
| CR-07 | Formato estándar | Cumple la estructura de 8 secciones definida para el anteproyecto | Anteproyecto |
| CR-08 | Redacción técnica | Lenguaje formal, impersonal, sin ambigüedades ni contenido de relleno | Todo documento |

### 3.3. Responsables de Validación

| Instancia | Responsable | Alcance | Periodicidad |
|-----------|-------------|---------|--------------|
| **Revisión técnica** | RH-01 (Alumno) | Autodetección de inconsistencias, completitud, formato | Continua (al crear/editar) |
| **Revisión académica** | RH-02 (Director PPS) | Calidad académica, rigor metodológico, coherencia general | Por hito (H1, H5, H6) |
| **Validación funcional** | RH-03 (Referente institucional) | Adecuación a necesidades reales, prioridades, catálogos | Por hito (H1, H4, H5) |
| **Aprobación formal** | RH-02 + RH-03 (conjunta) | Aprobación final del entregable antes de pasar a la siguiente fase | Hitos H1 y H6 |

### 3.4. Mecanismo de Aprobación

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   BORRADOR   │────>│ REVISIÓN TÉCNICA  │────>│ REVISIÓN ACADÉM. │────>│   APROBADO   │
│   (RH-01)    │     │    (RH-01)        │     │    (RH-02)       │     │  (RH-02/03)  │
└──────────────┘     └───────┬───────────┘     └────────┬─────────┘     └──────────────┘
                             │                          │
                             │ Observaciones            │ Observaciones
                             ▼                          ▼
                      ┌──────────────┐          ┌──────────────┐
                      │  CORRECCIÓN  │          │  CORRECCIÓN  │
                      │   (RH-01)    │          │   (RH-01)    │
                      └──────────────┘          └──────────────┘
```

**Estados de un documento:**
| Estado | Descripción |
|--------|-------------|
| BORRADOR | En elaboración; puede tener secciones incompletas |
| EN REVISIÓN | Completo; pendiente de revisión por RH-02 o RH-03 |
| OBSERVADO | Revisado con observaciones; requiere correcciones |
| APROBADO | Validado y aprobado; base para trabajo posterior |
| VIGENTE | Aprobado y en uso como referencia oficial |

### 3.5. Política de Control de Cambios

#### 3.5.1. Clasificación de Cambios

| Tipo | Descripción | Ejemplo | Aprobación Requerida |
|------|-------------|---------|---------------------|
| **Menor** | Corrección de errores, formato, redacción sin alterar contenido técnico | Corregir typo, ajustar tabla | RH-01 (auto-aprobado) |
| **Moderado** | Modificación de un elemento existente sin afectar otros documentos | Cambiar prioridad de un RF, ajustar umbral de métrica | RH-01 + RH-02 |
| **Mayor** | Agregado/eliminación de requisitos, cambio de arquitectura, o modificación que impacta múltiples documentos | Nuevo módulo, cambio de stack, novo riesgo crítico | RH-01 + RH-02 + RH-03 |

#### 3.5.2. Procedimiento de Cambio

1. **Solicitud:** RH-01 documenta el cambio propuesto con justificación, elementos afectados y análisis de impacto.
2. **Evaluación de impacto:** Identificar todos los documentos y elementos (RF, RNF, CU, RN, etc.) afectados por el cambio.
3. **Aprobación:** Según clasificación del cambio (ver tabla anterior).
4. **Implementación:** RH-01 aplica el cambio en todos los documentos afectados.
5. **Verificación de consistencia:** Revisar trazabilidad cruzada post-cambio.
6. **Registro:** Documentar el cambio en el registro de cambios (§3.5.3).

#### 3.5.3. Registro de Cambios

Cada documento mantiene implícitamente su historial a través del **control de versiones Git**. Adicionalmente, cambios significativos (moderados y mayores) se registran en el archivo de trazabilidad con:

| Campo | Descripción |
|-------|-------------|
| Fecha | Fecha del cambio |
| Documento(s) afectado(s) | Lista de archivos modificados |
| Tipo de cambio | Menor / Moderado / Mayor |
| Descripción | Qué se cambió y por qué |
| Elementos afectados | IDs de RF, CU, RN, etc. impactados |
| Aprobado por | Quién aprobó el cambio |

### 3.6. Política de Actualización Documental

| Principio | Descripción |
|-----------|-------------|
| **Documento vivo** | Los documentos del anteproyecto se actualizan a medida que se resuelven vacíos y pendientes. |
| **Propagación de cambios** | Un cambio en un documento de nivel superior (ej: objetivo) debe propagarse a todos los documentos derivados. |
| **Marcado de pendientes** | Todo elemento no confirmado se marca como `PENDIENTE` o `SUPUESTO` con su ID correspondiente. |
| **Versionado semántico** | Cambios mayores incrementan versión mayor (v2.0), moderados la menor (v1.1), menores el patch (v1.0.1). Implementado via Git tags. |
| **No eliminación** | Los elementos eliminados se marcan como `ELIMINADO — [motivo]` en lugar de borrarse, para preservar trazabilidad. |

### 3.7. Convenciones de Nombrado

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos de anteproyecto | `XX_nombre_descriptivo.md` | `05_requisitos_funcionales.md` |
| Archivos PMBOK | `XX_nombre.md` | `01_acta_constitucion.md` |
| IDs de elementos | `PREFIJO-NN` | `RF-01`, `RN-15`, `CU-08` |
| Pendientes | `PEN-FXX-NN` | `PEN-F14-01` |
| Branches (desarrollo) | `fase-X/descripcion-corta` | `fase-3/modulo-auth` |
| Commits | `[FASE-X] descripción imperativa` | `[FASE-3] Implementar middleware RBAC` |

### 3.8. Tabla de Prefijos de IDs del Proyecto

| Prefijo | Significado | Rango | Definido en |
|---------|-------------|-------|-------------|
| REST | Restricción | REST-01..07 | FASE 0 |
| VAC | Vacío de información | VAC-01..10 | FASE 0 |
| SUP | Suposición | SUP-01..08 | FASE 0 |
| DEC | Decisión previa | DEC-01..06 | FASE 0 |
| OE | Objetivo específico | OE-01..07 | FASE 2 |
| AF | Alcance funcional | AF-01..10 | FASE 3 |
| FA | Fuera de alcance | FA-01..10 | FASE 3 |
| LIM | Límite | LIM-01..06 | FASE 3 |
| STK | Stakeholder | STK-01..10 | FASE 4 |
| ACT | Actor | ACT-01..05 | FASE 4 |
| MOD | Módulo | MOD-01..09 | FASE 5 |
| RF | Requisito funcional | RF-01..44 | FASE 5 |
| RNF | Requisito no funcional | RNF-01..30 | FASE 6 |
| RN | Regla de negocio | RN-01..30 | FASE 7 |
| CU | Caso de uso | CU-01..15 | FASE 8 |
| B | Clase boundary | B-01..09 | FASE 9 |
| C | Clase control | C-01..08 | FASE 9 |
| E | Clase entity | E-01..09 | FASE 9 |
| I | Clase integración | I-01..03 | FASE 9 |
| H | Hito | H1..H6 | FASE 12 |
| RH | Recurso humano | RH-01..05 | FASE 13 |
| RS | Recurso software | RS-01..15 | FASE 13 |
| RW | Recurso hardware | RW-01..04 | FASE 13 |
| SV | Servicio | SV-01..05 | FASE 13 |
| SP | Supuesto presupuestario | SP-01..06 | FASE 13 |
| R | Riesgo | R-01..11 | FASE 14 |
| MF | Métrica funcional | MF-01..05 | FASE 15 |
| MC | Métrica de calidad | MC-01..06 | FASE 15 |
| MR | Métrica de rendimiento | MR-01..05 | FASE 15 |
| MS | Métrica de seguridad | MS-01..05 | FASE 15 |
| MA | Métrica de adopción | MA-01..05 | FASE 15 |
| MT | Métrica de auditoría | MT-01..04 | FASE 15 |
| MG | Métrica de gestión | MG-01..04 | FASE 15 |
| CR | Criterio de revisión | CR-01..08 | FASE 16 |
| PEN | Pendiente | PEN-FXX-NN | Todas las fases |

---

## 4. Tablas y Matrices

### 4.1. Matriz de Responsabilidad Documental (RACI)

| Documento / Actividad | RH-01 (Alumno) | RH-02 (Director) | RH-03 (Referente) |
|------------------------|:--------------:|:-----------------:|:------------------:|
| Anteproyecto (FASE 0–17) | **R, A** | **C, I** | **C** |
| Documentos PMBOK (01–12) | **R, A** | **C, I** | **I** |
| Código fuente (front/back) | **R, A** | **I** | — |
| Trazabilidad | **R, A** | **I** | — |
| Control de cambios (Menor) | **R, A** | — | — |
| Control de cambios (Moderado) | **R** | **A** | **I** |
| Control de cambios (Mayor) | **R** | **A** | **A** |
| Aprobación final (H1, H6) | **R** | **A** | **A** |

> **R** = Responsable (ejecuta) | **A** = Aprueba | **C** = Consultado | **I** = Informado

### 4.2. Calendario de Revisiones

| Hito | Semana | Documentos a Revisar | Revisor |
|------|--------|---------------------|---------|
| H1 — Documentación aprobada | S2 | Anteproyecto (FASE 0–17), PMBOK (01–09) | RH-02, RH-03 |
| H2 — PoC API validada | S5 | Actualización de FASE 0 (vacíos), FASE 10 (arquitectura) | RH-02 |
| H4 — Frontend integrado | S10 | PMBOK (10_pruebas) actualizado con resultados parciales | RH-02, RH-03 |
| H5 — Sistema validado | S12 | Métricas de éxito (FASE 15) con valores reales, PMBOK (10_pruebas) completo | RH-02, RH-03 |
| H6 — Producción | S14 | Todo el cuerpo documental final; PMBOK (11, 12) | RH-02, RH-03 |

---

## 5. Observaciones

1. **Git es la fuente de verdad** para el historial de cambios. Todo cambio documental se refleja en un commit con mensaje descriptivo.
2. **El gobierno documental es liviano** por diseño: un proyecto PPS con equipo unipersonal no requiere flujos de aprobación pesados. Se prioriza la trazabilidad sobre la burocracia.
3. **Los documentos PMBOK en `DOCUMENTOS/` son la versión formal** que se entrega a la institución educativa. El anteproyecto en `ANTEPROYECTO/` es el documento técnico de respaldo.
4. **La tabla de prefijos (§3.8) es el diccionario maestro del proyecto** y debe mantenerse actualizada ante cualquier nuevo tipo de elemento.
5. **Priorización funcional en la trazabilidad.** Al evaluar o trazar cualquier entregable, distinguir entre elementos del núcleo funcional prioritario y elementos complementarios, reflejando la priorización definida en FASE 3 y FASE 5.

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F16-01 | Validar el mecanismo de aprobación con RH-02 | RH-02 | Alta |
| PEN-F16-02 | Definir formato exacto del cuestionario de satisfacción UAT | PEN-F15-02 | Media |
| PEN-F16-03 | Crear template de solicitud de cambio mayor | RH-01 | Baja |
| PEN-F16-04 | Configurar Git tags para versionado semántico de documentos | RH-01 | Media |

---

## 7. Entregable de la Fase
- **8 criterios de revisión** (CR-01..CR-08)
- **Flujo de aprobación** con 5 estados documentales
- **Política de control de cambios** en 3 niveles (menor, moderado, mayor)
- **Matriz RACI** de responsabilidad documental
- **Diccionario maestro de prefijos** con 35+ tipos de IDs
- **Calendario de revisiones** alineado con hitos H1..H6

---

## 8. Conexión con la Siguiente Fase
El gobierno documental cierra el marco normativo del proyecto. La **FASE 17 — Consolidación Final** integrará todos los bloques en un índice general, verificará la consistencia cruzada, consolidará los pendientes abiertos y producirá el documento final del anteproyecto listo para presentación.
