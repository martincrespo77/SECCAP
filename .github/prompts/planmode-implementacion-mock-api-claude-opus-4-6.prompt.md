---
description: "PlanMode para Claude Opus 4.6: implementacion inicial de SECCAP con mock de API del Area de Personal, backend proxy, filtros jerarquicos, RBAC y auditoria."
agent: "backend"
---
# PlanMode: Implementacion con Mock de API del Area de Personal

## Modo de trabajo
Trabaja en modo planificacion estricta.
No implementes codigo ni modifiques archivos hasta presentar el plan y explicitar supuestos, riesgos y decisiones.
Si falta informacion critica, no la inventes: marcala como supuesto o como vacio pendiente.

## Objetivo
Definir un plan ejecutable para construir la primera version funcional de SECCAP con:

- frontend SPA en React + TypeScript
- backend proxy en Node.js 22 + Express 5 + TypeScript
- mock server de la API institucional del Area de Personal
- filtros jerarquicos y transversales
- autenticacion local, RBAC, auditoria y health check
- sin persistir datos de personal en la BD local

## Restriccion estructural del repositorio
Toda la implementacion ejecutable debe vivir dentro de la carpeta `SECCAP/`.

La estructura objetivo es:

- `SECCAP/frontend/`
- `SECCAP/backend/`
- `SECCAP/mock-api/`
- `SECCAP/docs-tecnicos/`

No propongas crear `frontend/`, `backend/` ni `mock-api/` en la raiz del repositorio.

## Documentos obligatorios a leer antes de planificar
- [Contexto.md](../../Contexto.md)
- [ANTEPROYECTO/05_requisitos_funcionales.md](../../ANTEPROYECTO/05_requisitos_funcionales.md)
- [ANTEPROYECTO/10_arquitectura_tecnologias.md](../../ANTEPROYECTO/10_arquitectura_tecnologias.md)
- [UML/02_clases_analisis_bce.puml](../../UML/02_clases_analisis_bce.puml)
- [UML/04_secuencia_ejecutar_consulta.puml](../../UML/04_secuencia_ejecutar_consulta.puml)
- [UML/05_actividad_flujo_consulta.puml](../../UML/05_actividad_flujo_consulta.puml)
- [UML/06_componentes_arquitectura.puml](../../UML/06_componentes_arquitectura.puml)
- [UML/07_despliegue_logico.puml](../../UML/07_despliegue_logico.puml)
- [COORDINACION_IA.md](../../COORDINACION_IA.md)

## Contexto tecnico que debes respetar
- El frontend nunca accede directo a la API institucional.
- Toda integracion con el Area de Personal pasa por el backend proxy.
- La API externa es Read-Only.
- La BD local solo guarda usuarios, roles, permisos, sesiones, configuracion, cache de catalogos y auditoria.
- No se replica ni persiste localmente el padrón ni los datos maestros del personal.
- El backend debe aplicar validacion, sanitizacion, RBAC, poda de campos por rol y auditoria obligatoria.
- Debe existir Anti-Corruption Layer: adaptador + cliente HTTP + mapper de respuesta.
- El mock server no es accesorio: es mitigacion obligatoria del riesgo de no tener contrato o sandbox real.

## Alcance obligatorio del plan

### 1. Definir la estrategia general de implementacion
Debes decidir y justificar:

- estructura inicial del repositorio dentro de `SECCAP/`
- orden correcto de fases de implementacion
- que se implementa primero para destrabar el proyecto
- que depende del mock y que depende del acceso real al Area de Personal

### 2. Separar dos contratos de API
Debes proponer dos capas de endpoints:

- API mock del Area de Personal, como si fuera el sistema externo
- API propia del backend proxy SECCAP, consumida por frontend

No mezcles ambos contratos.

### 3. Resolver la estrategia de discriminacion por filtros
Debes decidir cual de estas dos opciones conviene mas y justificarla:

- opcion A: un endpoint de consulta unificado con filtros por query params
- opcion B: endpoints separados por dominio (`militar`, `idioma`, `civil`) mas endpoints de catalogos

No acepto una respuesta tibia. Elige una opcion principal, justifica por mantenibilidad, claridad contractual y facilidad de mockeo, y deja la otra como fallback si corresponde.

### 4. Modelar filtros jerarquicos y transversales
El plan debe contemplar al menos estos grupos:

- raiz: `tipo_formacion`
- militar: `compromiso_servicios_vigente`, `categoria_militar`, `aptitud_capacitacion`
- idioma: `tipo_acreditacion_idioma`, `idioma`, `institucion`, `nivel_idioma`, `certificado_adjunto`
- transversales: `q`, `apellido_nombre`, `dni`, `legajo`, `unidad`, `jerarquia`, `estado_vigencia`, `fecha_vencimiento_desde`, `fecha_vencimiento_hasta`, `tiene_documentacion`, `certificado_descargable`

Debes indicar cuales filtros se resuelven por catalogo, cuales por query exacta, cuales por busqueda parcial y cuales requieren validacion de compatibilidad.

### 5. Proponer el contrato minimo del mock del Area de Personal
Parte de estos endpoints candidatos y ajustalos si hace falta:

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

Para cada endpoint define:

- proposito
- query params o path params
- ejemplo de request
- ejemplo de response
- errores esperables
- si depende de otro filtro previo

### 6. Proponer el contrato minimo del backend proxy SECCAP
Parte de estos endpoints candidatos y refinarlos:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /formacion/catalogos/tipos`
- `GET /formacion/catalogos/categorias-militares`
- `GET /formacion/catalogos/aptitudes?categoria=...`
- `GET /formacion/catalogos/idiomas`
- `GET /formacion/catalogos/niveles-idioma`
- `GET /formacion/catalogos/instituciones?idioma=...`
- `GET /formacion/consulta`
- `GET /formacion/:id`
- `GET /formacion/:id/certificado`
- `GET /auditoria`
- `GET /health`

Debes indicar para cada uno:

- objetivo
- rol minimo requerido
- validaciones obligatorias
- relacion con requisitos funcionales
- dependencia del mock o de la API real

### 7. Definir el dataset minimo de mocks
No te limites a decir "crear mocks". Debes listar un dataset minimo realista para soportar:

- categorias militares
- aptitudes por categoria
- idiomas
- niveles de idioma
- instituciones
- al menos 12 a 20 registros de personal/formacion que permitan probar casos validos, vacios y conflictivos

El dataset debe cubrir:

- casos militares
- casos de idioma
- algun caso civil aunque quede limitado
- registros vigentes y vencidos
- registros con y sin documentacion
- registros con y sin certificado descargable
- campos faltantes o inconsistentes para testear robustez del mapper

### 8. Definir la persistencia local minima
Debes planificar al menos estas tablas o equivalentes:

- usuarios
- roles
- permisos
- usuario_rol
- rol_permiso
- sesiones
- auditoria
- configuracion
- catalogo_cache

Aclara expresamente que no se almacenan datos maestros de personal.

### 9. Definir la estrategia de testing
El plan debe incluir:

- tests unitarios de validadores de filtros
- tests del adaptador hacia la API mock
- tests de RBAC
- tests de auditoria
- tests de contrato mock/proxy
- tests de flujo critico: login, carga de catalogos, consulta exitosa, consulta sin resultados, timeout, 403 y descarga de certificado

### 10. Definir la estrategia de observabilidad y fallos
Debes contemplar:

- timeout configurable
- respuestas 400 por filtros invalidos
- respuestas 401/403 por sesion o rol
- respuestas 502/504 por falla del sistema externo
- health check para BD y API mock/API real
- logs estructurados
- registro obligatorio en auditoria para exito y fallo

## Restricciones no negociables
- No inventes que ya existe Swagger real si el repo dice que no esta disponible.
- No persistas resultados completos de personal en PostgreSQL.
- No propongas acceso directo desde React a la API del Area de Personal.
- No metas GraphQL ni microservicios; para este alcance es sobrediseño.
- No supongas que el bloque civil esta completamente relevado.
- Si propones descarga de certificado, debes tratarla como condicionada a que el origen exponga el recurso.

## Entregable esperado
Quiero una respuesta estructurada exactamente asi:

1. Resumen ejecutivo del enfoque recomendado
2. Supuestos y vacios que condicionan la implementacion
3. Decision sobre la estrategia de endpoints y justificacion
4. Arquitectura ejecutable propuesta
5. Contrato propuesto de la API mock externa
6. Contrato propuesto del backend proxy interno
7. Dataset minimo de mocks
8. Plan por iteraciones o fases tecnicas
9. Riesgos tecnicos y mitigaciones
10. Definition of Done por fase
11. Primeras 5 tareas concretas para empezar a implementar

## Nivel de profundidad
No quiero una respuesta superficial ni motivacional.
Quiero una planificacion tecnica, priorizada y defendible, lista para usar como base de implementacion real.
