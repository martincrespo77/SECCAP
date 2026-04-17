---
description: "Prompt de ejecucion para Claude Opus 4.6: implementar SECCAP fase por fase con mock API, backend proxy, frontend, RBAC, auditoria y validacion sin romper la arquitectura."
agent: "backend"
---
# Ejecucion Fase a Fase - Claude Opus 4.6

## Modo de trabajo
Trabaja en modo ejecucion controlada.
No hagas una replanificacion total del proyecto en cada turno.
Toma una sola fase o subfase acotada por vez, implementala completa, validala y deja handoff claro.

## Objetivo
Implementar SECCAP de manera incremental, respetando la arquitectura ya definida en el repositorio:

- frontend SPA con React 19 + TypeScript + Vite
- backend proxy con Node.js 22 + Express 5 + TypeScript
- BD local PostgreSQL para usuarios, roles, sesiones, configuracion, cache y auditoria
- mock server de la API del Area de Personal para desarrollo
- integracion obligatoria via backend proxy
- filtros jerarquicos y transversales
- RBAC, poda de campos por rol, auditoria obligatoria y health checks

## Archivos obligatorios a leer antes de tocar codigo
- [Contexto.md](../../Contexto.md)
- [COORDINACION_IA.md](../../COORDINACION_IA.md)
- [ANTEPROYECTO/05_requisitos_funcionales.md](../../ANTEPROYECTO/05_requisitos_funcionales.md)
- [ANTEPROYECTO/10_arquitectura_tecnologias.md](../../ANTEPROYECTO/10_arquitectura_tecnologias.md)
- [UML/02_clases_analisis_bce.puml](../../UML/02_clases_analisis_bce.puml)
- [UML/04_secuencia_ejecutar_consulta.puml](../../UML/04_secuencia_ejecutar_consulta.puml)
- [UML/05_actividad_flujo_consulta.puml](../../UML/05_actividad_flujo_consulta.puml)
- [UML/06_componentes_arquitectura.puml](../../UML/06_componentes_arquitectura.puml)
- [UML/07_despliegue_logico.puml](../../UML/07_despliegue_logico.puml)
- [planmode-implementacion-mock-api-claude-opus-4-6.prompt.md](./planmode-implementacion-mock-api-claude-opus-4-6.prompt.md)

## Decisiones tecnicas ya fijadas y no negociables
- El frontend nunca consume en forma directa la API del Area de Personal.
- La API externa es Read-Only.
- No se persisten datos maestros de personal en PostgreSQL.
- Toda consulta a datos de personal pasa por el backend proxy.
- Debe existir Anti-Corruption Layer: adaptador, cliente HTTP y mapper.
- La auditoria registra exito y fallo.
- La poda de campos segun rol se aplica en backend antes de responder al frontend.
- El mock server es parte de la solucion de desarrollo, no un accesorio temporal sin valor.
- La estrategia base de consulta es:
  - un endpoint de consulta unificado en el proxy: `GET /formacion/consulta`
  - endpoints separados de catalogos
  - endpoints separados de detalle, certificado, auditoria y health
- No atomices endpoints por filtro individual.
- No introduzcas GraphQL, microservicios ni replicacion local del padron.
- Todo el codigo ejecutable debe quedar dentro de `SECCAP/`.
- No crear `frontend/`, `backend/` ni `mock-api/` en la raiz del repo.

## Regla de colaboracion con otro agente
- Revisa `git status` antes de empezar.
- Revisa `COORDINACION_IA.md` antes de elegir tarea.
- Si hay cambios ajenos en archivos fuera de tu alcance, no los toques.
- Si hay cambios ajenos en el mismo archivo que necesitas editar, no los pises: adapta tu trabajo o deja bloqueo explicito.
- Al final de cada turno, actualiza `COORDINACION_IA.md` con objetivo, archivos leidos, archivos modificados, decisiones, pendientes y siguiente paso.
- Si corresponde a una fase formal, actualiza tambien `TRAZABILIDAD/fase-X-*.md`.

## Forma de ejecutar cada turno
En cada ejecucion debes hacer exactamente esto:

1. Inspeccionar el estado del repo y leer el handoff mas reciente.
2. Determinar la siguiente fase o subfase no implementada.
3. Explicar en 5 a 10 lineas que vas a implementar en ese turno.
4. Implementar solo ese slice, sin mezclar dos subfases grandes.
5. Ejecutar validaciones reales sobre lo tocado.
6. Dejar handoff y pendientes.
7. Detenerte.

No intentes cerrar frontend, backend, mock, auth y auditoria en un solo turno.

## Orden obligatorio de implementacion

### Fase 2.1 - Estructura base del repo
Crear, si no existen:
- `SECCAP/frontend/`
- `SECCAP/backend/`
- `SECCAP/mock-api/`
- `SECCAP/docs-tecnicos/`
- `SECCAP/.env.example`
- `SECCAP/README.md` tecnico de arranque

Definition of Done:
- scaffolding inicial operativo
- scripts base de desarrollo
- estructura coherente con la arquitectura

### Fase 2.2 - Backend base y persistencia local
Implementar:
- Express + TypeScript
- manejo de configuracion por entorno
- logger estructurado
- endpoint `GET /health`
- conexion a PostgreSQL
- migraciones o schema inicial
- tablas minimas: usuarios, roles, permisos, usuario_rol, rol_permiso, sesiones, auditoria, configuracion, catalogo_cache

Definition of Done:
- backend levanta
- health responde
- BD inicializada
- sin tablas de datos maestros de personal

### Fase 2.3 - Mock API del Area de Personal
Implementar `SECCAP/mock-api/` como servicio separado.

Endpoints minimos del mock:
- `GET /externa/v1/catalogos/tipos-formacion`
- `GET /externa/v1/catalogos/categorias-militares`
- `GET /externa/v1/catalogos/aptitudes?categoria_militar=...`
- `GET /externa/v1/catalogos/idiomas`
- `GET /externa/v1/catalogos/niveles-idioma`
- `GET /externa/v1/catalogos/instituciones?idioma=...`
- `GET /externa/v1/formaciones`
- `GET /externa/v1/formaciones/:id`
- `GET /externa/v1/formaciones/:id/certificado`
- `GET /externa/v1/health`

Definition of Done:
- dataset minimo realista cargado
- soporte de filtros principales en `/formaciones`
- respuestas de error y timeout simulables

### Fase 3.1 - Autenticacion local y RBAC
Implementar:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- middleware de autenticacion
- middleware RBAC
- roles minimos: admin, consultor, auditor
- sesion o JWT segun decision tomada, pero consistente y documentada

Definition of Done:
- login y proteccion de rutas operativos
- tests minimos de auth y RBAC

### Fase 3.2 - Catalogos via proxy
Implementar en backend proxy:
- `GET /formacion/catalogos/tipos`
- `GET /formacion/catalogos/categorias-militares`
- `GET /formacion/catalogos/aptitudes?categoria=...`
- `GET /formacion/catalogos/idiomas`
- `GET /formacion/catalogos/niveles-idioma`
- `GET /formacion/catalogos/instituciones?idioma=...`

Reglas:
- los catalogos salen del mock o de la API real cuando exista
- opcionalmente pueden usar `catalogo_cache`
- no mezclar validacion de consulta principal en esta subfase

Definition of Done:
- catalogos responden desde proxy
- validaciones basicas de compatibilidad
- tests de integracion proxy -> mock

### Fase 3.3 - Consulta principal, mapper, poda y auditoria
Implementar:
- `GET /formacion/consulta`
- validadores de filtros
- sanitizacion
- adaptador hacia la API externa
- mapper de respuesta a modelo interno
- poda de campos segun rol
- auditoria obligatoria de exito y fallo
- manejo de 400, 401, 403, 502, 504

Filtros minimos a soportar:
- `tipo_formacion`
- `categoria_militar`
- `aptitud_capacitacion`
- `compromiso_servicios_vigente`
- `tipo_acreditacion_idioma`
- `idioma`
- `institucion`
- `nivel_idioma`
- `q`
- `apellido_nombre`
- `dni`
- `legajo`
- `unidad`
- `jerarquia`
- `estado_vigencia`
- `fecha_vencimiento_desde`
- `fecha_vencimiento_hasta`
- `tiene_documentacion`
- `certificado_descargable`

Definition of Done:
- consulta unificada funcional
- poda por rol validada
- auditoria insertada en exito y error
- tests de flujo critico

### Fase 3.4 - Detalle, certificado y auditoria consultable
Implementar:
- `GET /formacion/:id`
- `GET /formacion/:id/certificado`
- `GET /auditoria`

Reglas:
- detalle y certificado deben respetar RBAC
- certificado solo si el origen lo expone y el rol lo permite
- `GET /auditoria` solo para auditor y admin

Definition of Done:
- detalle y descarga controlados
- consulta de auditoria operativa

### Fase 4.1 - Shell frontend y autenticacion
Implementar:
- app React base
- layout inicial
- login
- rutas protegidas
- manejo de sesion
- pagina de error basica

Definition of Done:
- usuario puede autenticarse
- navegacion protegida operativa

### Fase 4.2 - Filtros jerarquicos y carga de catalogos
Implementar:
- pantalla de consulta
- selector raiz `tipo_formacion`
- carga dependiente de catalogos
- filtros transversales
- validaciones de UI

Definition of Done:
- UI consulta catalogos al proxy
- habilita y deshabilita filtros correctamente

### Fase 4.3 - Resultados, detalle y descarga
Implementar:
- tabla de resultados
- paginacion
- detalle
- descarga de certificado si aplica
- mensajes de sin resultados y fallos controlados

Definition of Done:
- flujo completo de consulta visible desde frontend

### Fase 5 - QA, contratos y endurecimiento
Implementar:
- tests unitarios
- tests de integracion
- tests de contrato mock/proxy
- casos de error
- smoke tests de health
- validacion de logs y auditoria

Definition of Done:
- suite minima ejecutable
- cobertura de flujos criticos

## Contrato minimo del mock externo que debes respetar
Modela el mock como sistema ajeno al proyecto.
No lo contamines con detalles internos del proxy.

Respuesta de lista sugerida para `GET /externa/v1/formaciones`:
- `items`
- `page`
- `page_size`
- `total`
- `source`

Cada item puede incluir como base:
- `id`
- `tipo_formacion`
- `apellido_nombre`
- `dni`
- `legajo`
- `unidad`
- `jerarquia`
- `categoria_militar`
- `aptitud_capacitacion`
- `compromiso_servicios_vigente`
- `tipo_acreditacion_idioma`
- `idioma`
- `institucion`
- `nivel_idioma`
- `estado_vigencia`
- `fecha_vencimiento`
- `tiene_documentacion`
- `certificado_descargable`
- `campos_sensibles_mock`

## Contrato minimo del proxy interno que debes respetar
El proxy es el que consumira el frontend.

Endpoints internos minimos:
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /formacion/catalogos/tipos`
- `GET /formacion/catalogos/categorias-militares`
- `GET /formacion/catalogos/aptitudes`
- `GET /formacion/catalogos/idiomas`
- `GET /formacion/catalogos/niveles-idioma`
- `GET /formacion/catalogos/instituciones`
- `GET /formacion/consulta`
- `GET /formacion/:id`
- `GET /formacion/:id/certificado`
- `GET /auditoria`
- `GET /health`

## Dataset minimo que debes construir en el mock
- 3 tipos de formacion: militar, idioma, civil
- 8 a 12 categorias militares o una muestra suficientemente representativa
- aptitudes dependientes por categoria
- al menos 5 idiomas
- varios niveles de idioma
- instituciones acreditantes
- 12 a 20 registros de formaciones/personas

Debe haber:
- casos militares vigentes
- casos militares vencidos
- casos de idioma vigentes
- casos de idioma sin certificado
- algun caso civil limitado
- registros sin documentacion
- registros con datos faltantes o inconsistentes para probar robustez del mapper

## Reglas de validacion y seguridad
- valida query params con esquemas formales
- rechaza combinaciones incompatibles con 400
- no devuelvas stack traces al frontend
- usa timeouts configurables
- registra auditoria con filtros, usuario, resultado y cantidad
- protege auditoria, admin y certificado por RBAC
- si la API externa falla, responde con error controlado y registra auditoria

## Reglas de salida al terminar cada turno
Al finalizar cada turno debes entregar:

1. fase o subfase implementada
2. archivos creados o modificados
3. comandos de validacion ejecutados
4. resultado de validacion
5. decisiones tecnicas tomadas
6. pendientes concretos
7. siguiente subfase recomendada

## Si aparece un bloqueo
Si se bloquea una fase por dependencia externa:
- no te detengas sin alternativa
- usa mock, stubs o contrato interno para seguir avanzando
- deja el bloqueo documentado en `COORDINACION_IA.md`

## Tono y profundidad esperada
No quiero motivacion ni relleno.
Quiero ejecucion tecnica, incremental, con criterio de ingenieria y sin romper la arquitectura ya decidida.
