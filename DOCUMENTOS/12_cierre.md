# Informe de Cierre y Lecciones Aprendidas — SECCAP

> Documento de cierre al finalizar la Fase 6. Consolida lo efectivamente entregado y distingue explícitamente qué queda **pendiente de validación humana/institucional** — esos puntos no se completan por el equipo de desarrollo.

## 1. Acta de aceptación técnica del producto

### 1.1 Alcance efectivamente entregado

El sistema SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal — fue desarrollado en seis fases iterativas con flujo Claude/Codex supervisado. Al cierre de Fase 5.3 y tras la producción documental de Fase 6, el producto cumple técnicamente con:

- Autenticación local basada en JWT con sesión persistida en BD y revocable.
- Control de acceso basado en roles y permisos (RBAC: `admin`, `consultor`, `auditor`).
- Consulta filtrada sobre API externa a través de un proxy seguro, con filtros jerárquicos (tipo → subcategorías) y validación estricta de entrada.
- Auditoría inmutable de todas las consultas (exitosas, denegadas, erróneas) en la BD local.
- Esquema **Read-Only** frente al sistema institucional.
- Hardening básico de errores: no se exponen stack traces ni internals en ninguna respuesta controlada.
- Harness de pruebas completo: 101 tests backend + 28 tests frontend, todos en verde, más lint, type-check, Prisma validate y build.

### 1.2 Firmas formales

> Las firmas físicas y nominales se completarán al ejecutarse la aceptación presencial. **No corresponde inventar nombres ni fechas** en este documento mientras el acto formal no se realice.

__________________________________
**Firma de Aceptación Operativa (Cliente — Área de Personal)**

Nombre y apellido: *pendiente de validación humana*
Fecha: *pendiente*

__________________________________
**Firma del Director del Proyecto**

Nombre y apellido: *pendiente de validación humana*
Fecha: *pendiente*

__________________________________
**Firma del Patrocinador**

Nombre y apellido: *pendiente de validación humana*
Fecha: *pendiente*

## 2. Documentos traspasados a la organización

| Artefacto | Ubicación | Estado |
|---|---|---|
| Código fuente | Repositorio Git (raíz del repo, rama principal) | Entregado |
| Documentación PMBOK | `DOCUMENTOS/` (12 documentos) | Entregado |
| UML | `UML/` (10 diagramas: casos de uso, clases, secuencia, componentes, despliegue, ER) | Entregado |
| Anteproyecto | `ANTEPROYECTO/` (18 documentos) | Entregado |
| Trazabilidad | `TRAZABILIDAD/fase-1..fase-6.md` | Entregado |
| Manual de usuario | `SECCAP/docs/manual_usuario.md` | Entregado |
| Guía técnica general | `SECCAP/README.md` | Entregado |
| Implantación técnica | `SECCAP/docs-tecnicos/implantacion.md` | Entregado |
| Operación y diagnóstico | `SECCAP/docs-tecnicos/operacion.md` | Entregado |
| QA y pruebas | `SECCAP/docs-tecnicos/qa.md` | Entregado |
| Capacitación de operadores | `SECCAP/docs-tecnicos/capacitacion_operadores.md` | Entregado |
| Bitácora de coordinación | `COORDINACION_IA.md` | Entregado (histórico de desarrollo) |

No se generó documentación OpenAPI/Swagger en esta entrega; los contratos de endpoints están documentados en `SECCAP/docs-tecnicos/qa.md` y en los tests de contrato (`SECCAP/backend/src/__tests__/contracts.test.ts`).

## 3. Lecciones aprendidas

### 3.1 Lo que funcionó

1. **Flujo Claude implementa / Codex revisa con handoff explícito.** Evitó que un solo asistente acumulara errores y sirvió como mecanismo real de revisión de pares. El archivo `COORDINACION_IA.md` funcionó como única fuente de verdad operativa.
2. **Iteración por subfases cortas con Definition of Done por subfase.** Cada subfase entregaba algo verificable (tests, endpoints, pantalla). Codex devolvió varias subfases a corrección antes de aprobarlas (2.3, 3.2, 3.3, 3.4, 4.2, 5.2) — eso demostró que el control cruzado efectivamente detectaba defectos que un único ejecutor no habría visto.
3. **Arquitectura desacoplada frontend / backend / mock-api.** Permitió avanzar en paralelo y probar integración sin depender de la API institucional real.
4. **Prisma + migraciones + seed idempotente.** El esquema de la BD local quedó versionado y reproducible.
5. **Hardening progresivo de errores.** La Fase 5 agregó una red de seguridad sobre mensajes de error que evita filtrar internals al cliente.

### 3.2 Obstáculos y cómo se resolvieron

1. **Prisma 7 eliminó la conexión directa por URL.** Requirió adoptar `@prisma/adapter-pg` como driver adapter obligatorio. Se documentó en Entrada 011.
2. **Bug de UX por `useCallback` faltante** en `AuthContext`: el cleanup del `useEffect` borraba el mensaje de login fallido antes de ser visible (Entrada 044 → 045). El harness de tests detectó el bug antes de que llegara a usuario final.
3. **Validación numérica permisiva** en el endpoint de consulta: `/^\d+$/` aceptaba `0`, lo que degradaba la semántica de paginación (Entradas 026/027 → 028/029). Corregido con `/^[1-9]\d*$/`.
4. **Timeout upstream degradado a 502** por lógica de traducción de errores. Se corrigió para preservar `504` (Entradas 022 → 023).
5. **Dataset civil ausente en el mock** y `tipo_formacion` no impuesto como obligatorio (Entradas 014 → 015). Corregido y alineado al contrato `{ items, page, page_size, total, source }`.
6. **Contratos divergentes entre frontend y backend** (`id` vs `codigo`, `page_size` vs `pageSize`). Detectado por Codex en Fase 4.2 y corregido antes de avanzar a 4.3 (Entradas 036 → 037 → 038).

### 3.3 Mantenibilidad a futuro

- **Cambio del proveedor de API institucional**: si la integración migra de REST a GraphQL o cambia el contrato de campos, solo impacta en `SECCAP/backend/src/services/mapper.ts` y `external-api.ts`. El frontend no se ve afectado.
- **Nuevos roles o permisos**: se agregan vía seed + tablas `sys_rol` / `sys_permiso` / `sys_rol_permiso` sin cambiar el código (el middleware `authorize` trabaja contra el set de permisos del usuario autenticado).
- **Nuevos campos sensibles para poda**: se agregan al array `CAMPOS_SENSIBLES` en `services/poda.ts`.
- **Nuevos filtros de consulta**: se validan en `routes/consulta.ts` y se mapean en `mapper.ts`; el contrato hacia el frontend se actualiza en `src/types/`.

## 4. Indicadores al cierre

| Indicador | Valor |
|---|---|
| Tests backend verdes | 101 / 101 |
| Tests frontend verdes | 28 / 28 |
| Cobertura de subfases implementadas | Fase 1 a Fase 6 completas |
| Subfases devueltas a corrección | 6 (todas cerradas y aprobadas) |
| Endpoints backend expuestos | `auth` (3) + `catalogos` (6) + `consulta` (1) + `detalle` (2) + `auditoria` (1) + `health` (1) |
| Diagramas UML entregados | 10 |
| Documentos PMBOK | 12 |

## 5. Fuera de alcance entregado / trabajos futuros

Los siguientes puntos **no estaban en el alcance** de esta entrega o quedaron identificados como evolutivos:

- Migración de hash de password de SHA-256 a bcrypt/argon2 (prerrequisito de seguridad para producción).
- Integración real con la API institucional del Área de Personal (pendiente de contrato y credenciales).
- Módulo administrativo de alta/baja de usuarios con UI dedicada (hoy se hace vía seed y consulta directa a BD).
- Exportación/impresión masiva de resultados (explícitamente fuera de alcance).
- Pantalla de consulta de auditoría en el frontend (existe endpoint `/auditoria` pero no UI).
- Catálogo civil relevado formalmente (VAC-01 persiste como placeholder).
- Logging centralizado y monitoreo productivo.
- Validación E2E en navegador automatizada (Playwright/Cypress).
- Documentación OpenAPI/Swagger del backend.
- Política de backup, retención y alta disponibilidad (a definir con el Área de Sistemas).

## 6. Pendientes institucionales / validación humana

Los siguientes puntos dependen exclusivamente de decisiones fuera del equipo de desarrollo y deben resolverse antes del pase a producción:

- [ ] Designación formal de patrocinador y director del proyecto (completar `01_acta_constitucion.md`).
- [ ] Firma del acta de aceptación técnica (sección 1.2).
- [ ] Contrato de integración con la API institucional real.
- [ ] Provisión de infraestructura (servidor, dominio, TLS, firewall).
- [ ] Provisión de `JWT_SECRET` productivo de longitud adecuada.
- [ ] Plan de backup y retención aprobado.
- [ ] Aprobación de seguridad de la información (incluye migración de hash).
- [ ] Alta de usuarios productivos iniciales y eliminación de credenciales de desarrollo (`admin/admin123`, `consultor/consultor123`, `auditor/auditor123`).
- [ ] Fecha y lugar de los talleres de capacitación.

## 7. Cierre formal

El equipo de desarrollo declara el trabajo técnico de SECCAP **completo en el alcance de las seis fases iterativas aprobadas**, quedando el pase a producción y los puntos institucionales de la sección 6 supeditados a la validación formal del cliente y del Área de Sistemas.

El repositorio queda como entregable único con:

- Código fuente funcional (`SECCAP/`).
- Documentación PMBOK (`DOCUMENTOS/`), UML (`UML/`) y anteproyecto (`ANTEPROYECTO/`).
- Manuales de usuario, técnica y de capacitación (`SECCAP/docs/`, `SECCAP/docs-tecnicos/`).
- Trazabilidad completa por fase (`TRAZABILIDAD/`).
- Bitácora de coordinación (`COORDINACION_IA.md`).
