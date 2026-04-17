# FASE 15 — MÉTRICAS DE ÉXITO
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Definición de Métricas de éxito y Criterios de Aceptación**

## 2. Objetivo
Definir indicadores cuantitativos y cualitativos que permitan evaluar objetivamente el éxito del proyecto en las dimensiones funcional, de calidad, de rendimiento, de adopción y de auditoría, estableciendo umbrales de aceptación y métodos de medición.

---

## 3. Desarrollo

### 3.1. Criterio General de Éxito

El proyecto se considera **exitoso** si cumple las siguientes condiciones mínimas:
1. Se entrega un sistema funcional que permite consultas Read-Only sobre datos de personal a través de filtros jerárquicos.
2. El sistema implementa RBAC y auditoría completa.
3. Se entrega la documentación formal requerida por la PPS.
4. El sistema pasa las pruebas de aceptación del referente institucional (RH-03).

### 3.1.1. Priorización de Métricas

Las métricas que siguen aplican al proyecto integral SECCAP. Las métricas del núcleo funcional (identificadas como **críticas**) son las que determinan la aceptación mínima del sistema.

### 3.2. Métricas Funcionales

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Requisitos Vinculados |
|----|---------|-------------|------------------|--------------------|-----------------------|
| MF-01 | Cobertura de requisitos esenciales | % de RF esenciales implementados y verificados | ≥ 90% (33/37 RF esenciales) | Matriz de trazabilidad RF → tests | RF-01..RF-44 (esenciales) |
| MF-02 | Cobertura de filtros funcionales | Cantidad de filtros jerárquicos operativos sobre el total diseñado | ≥ 80% de filtros del módulo MOD-03 | Inventario de filtros activos vs. diseñados | RF-09..RF-20, RN-01..RN-07 |
| MF-03 | Casos de uso implementados | Cantidad de CU completamente implementados / total | ≥ 12/15 CU (80%) | Demo funcional contra CU-01..CU-15 | CU-01..CU-15 |
| MF-04 | Módulos operativos | Cantidad de módulos funcionales desplegados | ≥ 7/9 módulos (MOD-01..MOD-09) | Verificación de endpoints y pantallas | MOD-01..MOD-09 |
| MF-05 | Reglas de negocio implementadas | % de RN implementadas y verificadas | ≥ 85% (26/30 RN) | Tests unitarios/integración por RN | RN-01..RN-30 |

### 3.3. Métricas de Calidad de Software

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MC-01 | Cobertura de tests unitarios | % de código cubierto por tests en backend | ≥ 70% | Reporte de coverage (Vitest/Jest) | RNF-13 |
| MC-02 | Cobertura de tests de integración | Cantidad de flujos críticos con test de integración | ≥ 5 flujos (login, consulta, filtro, auditoría, error) | Conteo de tests de integración | RNF-13 |
| MC-03 | Defectos críticos en producción | Cantidad de bugs bloqueantes post-despliegue | 0 críticos, ≤ 3 mayores | Registro de incidentes | RNF-11 |
| MC-04 | Deuda técnica | Code smells + duplicaciones detectadas | ≤ 5% de duplicación; 0 critical smells | Análisis estático (ESLint, SonarQube si disponible) | RNF-15, RNF-16 |
| MC-05 | Compilación sin errores | Build exitoso de front y back en CI | 100% builds verdes en rama principal | GitHub Actions log | RNF-14 |
| MC-06 | Tipos estrictos | Compilación TypeScript en modo strict sin errores | 0 errores de tipo en `tsc --noEmit` | CI pipeline | RNF-14 |

### 3.4. Métricas de Rendimiento

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MR-01 | Tiempo de respuesta de consulta | Tiempo desde envío de consulta hasta visualización de resultados | ≤ 3 segundos (p95) sin contar latencia de API externa | Medición en logs del backend (timestamp request→response) | RNF-08 |
| MR-02 | Tiempo de carga inicial (frontend) | Time to Interactive (TTI) del SPA | ≤ 4 segundos en conexión 4G estándar | Lighthouse / DevTools | RNF-09 |
| MR-03 | Tiempo de carga de catálogos | Tiempo de obtención de catálogos desde caché o API | ≤ 1 segundo desde caché; ≤ 5 segundos desde API | Logs del módulo de catálogos | RNF-08, RN-25 |
| MR-04 | Disponibilidad del sistema | % de uptime durante periodo de evaluación | ≥ 95% (excluye caídas de API externa) | Logs de health check / monitoreo | RNF-10, RNF-11 |
| MR-05 | Concurrencia soportada | Usuarios simultáneos sin degradación | ≥ 10 usuarios concurrentes | Test de carga básico (Artillery/k6) | RNF-08 |

### 3.5. Métricas de Seguridad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | RNF Vinculado |
|----|---------|-------------|------------------|--------------------|--------------------|
| MS-01 | Vulnerabilidades conocidas en dependencias | Cantidad de vulnerabilidades high/critical en `npm audit` | 0 high, 0 critical | `npm audit` en CI | RNF-01 |
| MS-02 | OWASP Top 10 compliance | Cantidad de categorías OWASP verificadas | 10/10 categorías revisadas | Checklist manual + herramientas | RNF-01..RNF-07 |
| MS-03 | Protección de datos sensibles | Ningún dato sensible expuesto en logs, respuestas de error o frontend | 0 exposiciones detectadas | Revisión de código + tests de penetración básicos | RNF-02, RNF-03 |
| MS-04 | Autenticación robusta | Intentos de acceso no autorizado bloqueados | 100% bloqueados en tests | Tests de autenticación (token inválido, expirado, sin permisos) | RNF-04, RN-11..RN-15 |
| MS-05 | Auditoría completa | % de operaciones de consulta con registro de auditoría | 100% | Comparación logs API vs registros auditoría | RNF-06, RN-27..RN-30 |

### 3.6. Métricas de Adopción y Usabilidad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Vinculación |
|----|---------|-------------|------------------|--------------------|-------------|
| MA-01 | Satisfacción del cliente (UAT) | Evaluación del referente institucional sobre el sistema | ≥ 7/10 en encuesta de satisfacción | Cuestionario post-UAT a RH-03 y RH-05 | CU-01..CU-15 |
| MA-02 | Tasa de completitud de tareas | % de usuarios de prueba que completan una consulta sin ayuda | ≥ 80% | Observación durante sesiones UAT | RNF-20..RNF-23 |
| MA-03 | Errores de usuario | Cantidad promedio de errores por tarea durante UAT | ≤ 2 errores por tarea | Registro durante sesiones UAT | RNF-20 |
| MA-04 | Tiempo para primera consulta exitosa | Tiempo desde login hasta obtener resultados (usuario nuevo) | ≤ 5 minutos | Medición en sesión UAT | RNF-21 |
| MA-05 | Accesibilidad básica | Navegabilidad completa por teclado; contraste adecuado | WCAG 2.1 nivel A en vistas principales | Lighthouse Accessibility / axe | RNF-23 |

### 3.7. Métricas de Auditoría y Trazabilidad

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición | Vinculación |
|----|---------|-------------|------------------|--------------------|-------------|
| MT-01 | Completitud del registro de auditoría | % de acciones auditables registradas vs. ejecutadas | 100% | Comparación de logs de aplicación vs. tabla auditoría | RNF-06, RN-27 |
| MT-02 | Inmutabilidad de registros | Registros de auditoría no modificables post-creación | 0 modificaciones detectadas | Intento de UPDATE/DELETE en tabla auditoría (debe fallar) | RN-28 |
| MT-03 | Datos mínimos por registro | Cada registro contiene: usuario, rol, acción, timestamp, IP, filtros, resultado | 100% de registros con todos los campos | Query de validación contra esquema | RF-31..RF-34 |
| MT-04 | Consulta de auditoría funcional | El módulo de auditoría permite buscar y exportar registros | Funcional al 100% | Test funcional de CU-10, CU-11 | CU-10, CU-11 |

### 3.8. Métricas de Gestión del Proyecto

| ID | Métrica | Descripción | Umbral de Éxito | Método de Medición |
|----|---------|-------------|------------------|--------------------|
| MG-01 | Cumplimiento del cronograma | Desviación respecto al plan de 14 semanas | ≤ 2 semanas de desvío | Comparación fechas reales vs. planificadas |
| MG-02 | Documentación entregada | Cantidad de documentos PMBOK completos / 12 | 12/12 documentos | Inventario de DOCUMENTOS/ |
| MG-03 | Hitos alcanzados | Cantidad de hitos cumplidos / 6 (H1..H6) | ≥ 5/6 hitos | Registro de hitos |
| MG-04 | Riesgos materializados gestionados | % de riesgos materializados con plan de respuesta ejecutado | 100% | Registro de riesgos actualizado |

---

## 4. Tablas y Matrices

### 4.1. Resumen de Métricas por Categoría

| Categoría | Cantidad | IDs |
|-----------|----------|-----|
| Funcionales | 5 | MF-01..MF-05 |
| Calidad de Software | 6 | MC-01..MC-06 |
| Rendimiento | 5 | MR-01..MR-05 |
| Seguridad | 5 | MS-01..MS-05 |
| Adopción y Usabilidad | 5 | MA-01..MA-05 |
| Auditoría | 4 | MT-01..MT-04 |
| Gestión | 4 | MG-01..MG-04 |
| **TOTAL** | **34** | |

### 4.2. Trazabilidad Métricas → Objetivos Específicos

| Métrica(s) | OE vinculado |
|------------|-------------|
| MF-01, MF-04, MR-01, MS-04 | OE-01 (Capa proxy segura) |
| MS-02, MS-04, MT-01 | OE-02 (RBAC) |
| MF-02, MA-01, MA-02, MA-04 | OE-03 (UI moderna con filtros jerárquicos) |
| MT-01..MT-04, MS-05 | OE-04 (Módulo de auditoría) |
| MC-01..MC-06 | OE-05 (Persistencia local mínima) |
| MR-01, MR-04, MC-03 | OE-06 (Manejo de errores) |
| MG-02, MG-03 | OE-07 (Documentación) |

### 4.3. Criterio de Aceptación Global

**Aceptación mínima obligatoria:**
- ✅ MF-01 ≥ 90% (cobertura de requisitos esenciales)
- ✅ MS-04 = 100% (RBAC verificado)
- ✅ MS-05 = 100% (auditoría completa)
- ✅ MT-01 = 100% (registro de auditoría)
- ✅ MA-01 ≥ 7/10 (satisfacción UAT)
- ✅ MG-02 = 12/12 (documentación PMBOK)

**Meta extendida:** Todas las 34 métricas en umbral de éxito.

**Rechazo:**
- ❌ MF-01 < 70% o MS-05 < 90% o cualquier vulnerabilidad critical no resuelta

---

## 5. Observaciones

1. **Las métricas de seguridad y auditoría tienen umbrales absolutos** (100%, 0 vulnerabilidades) dado el contexto militar/defensa del proyecto. No admiten degradación.
2. **Las métricas de rendimiento** excluyen la latencia de la API externa (REST-02), ya que está fuera del control del proyecto. Se mide solo el tiempo agregado por el sistema.
3. **Las métricas de adopción** se evalúan en sesiones UAT controladas con RH-05 (3–5 usuarios de prueba). No se contempla medición en producción real durante el primer tramo de ejecución.
4. **MF-01 tiene un umbral del 90% y no 100%** para acomodar la posibilidad de que algunos requisitos esenciales dependan de información aún no disponible (VAC-01, VAC-02).

---

## 6. Pendientes y Elementos a Validar

| ID | Pendiente | Dependencia | Prioridad |
|----|-----------|-------------|-----------|
| PEN-F15-01 | Definir herramienta de análisis estático (SonarQube o alternativa gratuita) | RH-01 | Media |
| PEN-F15-02 | Diseñar cuestionario de satisfacción para UAT (MA-01) | RH-01, RH-02 | Media |
| PEN-F15-03 | Configurar métricas automatizadas en CI (MC-01, MC-05, MC-06, MS-01) | RH-01 | Alta |
| PEN-F15-04 | Definir protocolo de sesiones UAT para métricas MA-02, MA-03, MA-04 | RH-01, RH-03 | Media |
| PEN-F15-05 | Establecer baseline de rendimiento de la API externa para aislar MR-01 | RH-01 | Alta |

---

## 7. Entregable de la Fase
- **34 métricas de éxito** organizadas en 7 categorías, cada una con umbral, método de medición y trazabilidad
- **Criterio de aceptación global** con umbrales obligatorios, deseables y de rechazo
- **Trazabilidad** métricas → objetivos específicos (OE-01..OE-07)

---

## 8. Conexión con la Siguiente Fase
Las métricas definidas proveen los **criterios de verificación** para el **gobierno documental** (FASE 16), permitiendo establecer qué debe medirse, quién lo valida y cómo se documenta la evidencia de cumplimiento en cada revisión del proyecto.
