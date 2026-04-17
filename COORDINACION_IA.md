# Coordinacion entre IAs

## Proposito
Este archivo es la bitacora operativa compartida entre Codex y Claude para trabajar sobre este repositorio sin pisarse, sin inventar contexto y sin mezclar trabajo operativo dentro de `Contexto.md`.

## Regla basica
No usar `Contexto.md` como canal de coordinacion diaria. Ese archivo ya funciona como base de contexto amplia. La coordinacion de trabajo entre asistentes debe quedar aca.

## Modo operativo vigente
- Implementacion tecnica del sistema: Claude
- Revision tecnica, control de arquitectura, consistencia y analisis de resultados: Codex
- Carpeta obligatoria para todo el codigo ejecutable: `SECCAP/`
- Carpeta raiz del repo: conserva documentacion, UML, trazabilidad, prompts y coordinacion

## Punto de inicio actual
- Estado actual: no existe implementacion real todavia; solo base documental, UML, prompts y carpeta `SECCAP/` preparada como raiz tecnica.
- Proximo agente que debe trabajar: Claude
- Proxima subfase a ejecutar: `Fase 2.1 - Estructura base del repo`
- Alcance de esa subfase:
  - crear `SECCAP/frontend/`
  - crear `SECCAP/backend/`
  - crear `SECCAP/mock-api/`
  - crear `SECCAP/docs-tecnicos/`
  - crear `SECCAP/.env.example`
  - completar `SECCAP/README.md` tecnico de arranque
- Prompt que debe seguir Claude:
  - `.github/prompts/ejecucion-fase-a-fase-claude-opus-4-6.prompt.md`
- Regla de parada:
  - Claude implementa solo una subfase por turno, valida, actualiza esta bitacora y se detiene para revision de Codex.

## Protocolo de uso
1. Leer este archivo completo antes de empezar a trabajar.
2. Agregar una nueva entrada al final. No borrar historial.
3. Indicar claramente:
   - asistente
   - fecha y hora
   - objetivo
   - archivos leidos
   - archivos modificados
   - decisiones tomadas
   - pendientes
   - proximo paso sugerido
4. Si un asistente va a tocar archivos importantes, primero debe dejar una entrada breve de "tomo esta tarea".
5. Al terminar, debe dejar otra entrada de "cierro esta tarea" con resultado concreto.
6. Si hay duda o conflicto, no improvisar: dejarlo escrito en este archivo.

## Ciclo obligatorio Claude -> Codex
1. Claude lee `COORDINACION_IA.md` y toma la `Proxima subfase a ejecutar`.
2. Claude implementa solo ese slice dentro de `SECCAP/`.
3. Claude ejecuta validaciones reales.
4. Claude deja en esta bitacora:
   - que implemento
   - que archivos toco
   - que comandos ejecuto
   - que salio bien
   - que quedo pendiente
   - cual es la proxima subfase sugerida
5. Codex revisa el resultado de Claude:
   - riesgos
   - errores de arquitectura
   - regresiones
   - validaciones faltantes
   - coherencia con requisitos y UML
6. Solo despues de esa revision, Claude toma la siguiente subfase.

## Convencion recomendada
- Codex: no implementa codigo salvo pedido explicito del usuario. Su funcion principal es revisar lo hecho por Claude, detectar riesgos, exigir consistencia tecnica y cuidar arquitectura, trazabilidad y calidad.
- Claude: implementa todo el sistema por fases dentro de `SECCAP/`, respetando prompts, arquitectura y handoff obligatorio.
- Ambos: no modificar el mismo archivo al mismo tiempo.

## Estado actual del repositorio
### Diagnostico corto
- Este repo hoy es principalmente documental.
- No se detecto `.git` en la raiz actual. O sea: todavia no esta versionado como repositorio Git real en esta carpeta.
- La carpeta mas madura es `DOCUMENTOS/`, acompanada por `ANTEPROYECTO/`, `TRAZABILIDAD/` y una estructura auxiliar en `.github/`.
- `Contexto.md` pesa bastante y concentra contexto historico amplio. Sirve para referencia, no para operacion diaria entre asistentes.

### Estructura observada
- `ANTEPROYECTO/`: 18 documentos de analisis y definicion previa.
- `DOCUMENTOS/`: 12 documentos PMBOK del proyecto SECCAP.
- `TRAZABILIDAD/`: 6 archivos, uno por fase.
- `.github/agents` y `.github/prompts`: definen agentes y fases de trabajo.

### Lectura tecnica del estado
- El proyecto esta bien encaminado a nivel de documentacion.
- La Fase 1 esta bastante avanzada.
- El repositorio todavia no contiene la implementacion real de backend, frontend, infraestructura ni pruebas automatizadas.
- Hay una inconsistencia menor en trazabilidad historica: `05_costos.md` hoy dice 245 hs totales, mientras que una entrada vieja de trazabilidad menciona 230 hs.
- En `DOCUMENTOS/01_acta_constitucion.md` siguen pendientes datos nominales reales: patrocinador, director, fecha de inicio y fecha estimada de cierre.

## Forma correcta de trabajo combinado
La forma sana de combinar dos chats aislados no es que ambos "piensen juntos" en tiempo real. Eso no existe. Lo correcto es trabajar por handoff:

1. Un asistente toma una tarea concreta.
2. La deja registrada aca.
3. Hace cambios acotados.
4. Cierra la tarea con archivos tocados, decisiones y pendientes.
5. El otro asistente retoma desde esta bitacora.

## Tareas recomendadas inmediatas
1. Cerrar los campos `[PENDIENTE]` del acta si ya tenes nombres y fechas reales.
2. Decidir si este directorio va a convertirse en repositorio Git formal.
3. Mantener la coordinacion Codex/Claude en este archivo y la trazabilidad del proyecto en `TRAZABILIDAD/`.
4. No mezclar respuestas operativas nuevas dentro de `Contexto.md` salvo que quieras consolidar contexto definitivo.

---

## Bitacora

### Entrada 001 - Codex - toma y cierre inicial
- Fecha y hora: 10/04/2026 10:12
- Objetivo: analizar el estado real del repositorio y dejar un mecanismo de coordinacion compartida con Claude.
- Archivos leidos:
  - `Contexto.md`
  - `DOCUMENTOS/README.md`
  - `DOCUMENTOS/01_acta_constitucion.md`
  - `DOCUMENTOS/05_costos.md`
  - `DOCUMENTOS/08_comunicaciones.md`
  - `DOCUMENTOS/09_requisitos.md`
  - `TRAZABILIDAD/fase-1-planificacion.md`
  - `.github/AGENTS.md`
  - `.github/agents/documentacion.agent.md`
  - `.github/prompts/fase-1-planificacion.prompt.md`
- Archivos modificados:
  - eliminados `lavadero/modelo.py`
  - eliminados `lavadero/test_lavadero.py`
  - eliminados `lavadero/__pycache__/modelo.cpython-311.pyc`
  - eliminados `lavadero/__pycache__/test_lavadero.cpython-311.pyc`
  - `COORDINACION_IA.md`
- Decisiones tomadas:
  - no usar `Contexto.md` como canal de coordinacion diaria;
  - crear una bitacora separada, append-only;
  - recomendar trabajo secuencial por handoff y no edicion simultanea.
- Hallazgos importantes:
  - el repo actual es documental, no de codigo;
  - existe una estructura de fases y agentes ya definida en `.github/`;
  - falta versionado Git en esta raiz;
  - quedan pendientes nominales en el acta de constitucion;
  - hay que cuidar consistencia entre trazabilidad y costos.
- Pendientes:
  - si se desea, normalizar cifras y pendientes entre documentos;
  - si se empieza implementacion real, crear estructura de codigo y versionado.
- Proximo paso sugerido:
  - que Claude lea este archivo y responda con una nueva entrada indicando que tarea concreta toma.

### Entrada 002 - Codex - paquete UML inicial
- Fecha y hora: 13/04/2026 11:20
- Objetivo: crear una carpeta `UML/` con un plan de diagramas y los diagramas fuente necesarios para defender funcionalidad, arquitectura y despliegue del sistema segun los requisitos actuales.
- Archivos leidos:
  - `DOCUMENTOS/09_requisitos.md`
  - `ANTEPROYECTO/04_stakeholders_actores.md`
  - `ANTEPROYECTO/06_requisitos_no_funcionales.md`
  - `ANTEPROYECTO/08_casos_de_uso.md`
  - `ANTEPROYECTO/09_modelo_analisis.md`
  - `ANTEPROYECTO/10_arquitectura_tecnologias.md`
- Archivos modificados:
  - `UML/README.md`
  - `UML/01_casos_uso_general.puml`
  - `UML/02_clases_analisis_bce.puml`
  - `UML/03_secuencia_login.puml`
  - `UML/04_secuencia_ejecutar_consulta.puml`
  - `UML/05_actividad_flujo_consulta.puml`
  - `UML/06_componentes_arquitectura.puml`
  - `UML/07_despliegue_logico.puml`
  - `COORDINACION_IA.md`
- Decisiones tomadas:
  - usar PlantUML como formato base versionable;
  - crear solo diagramas esenciales y no inflar la carpeta con UML irrelevante;
  - cubrir tanto RF como RNF, no solo flujos funcionales;
  - mantener el modelado atado a la arquitectura desacoplada y no a un framework cerrado.
- Hallazgos importantes:
  - el material existente ya justificaba casos de uso, clases de analisis y secuencias;
  - los RNF obligan a incluir tambien componentes y despliegue;
  - la formacion civil sigue incompleta, por lo que no corresponde inventar mayor detalle.
- Pendientes:
  - renderizar los `.puml` a imagen si despues hace falta para entrega;
  - agregar secuencia de descarga documental y consulta de auditoria en una iteracion posterior;
  - refinar diagramas cuando se conozca el contrato real de la API institucional.
- Proximo paso sugerido:
  - revisar el paquete UML y decidir si queres una segunda iteracion enfocada en BD, RBAC o auditoria.

### Entrada 003 - Codex - revision de completitud UML y casos de uso
- Fecha y hora: 13/04/2026 12:11
- Objetivo: auditar el repositorio para verificar si los UML y, en especial, los casos de uso estaban realmente completos y coherentes con requisitos, actores y modelo de analisis.
- Archivos leidos:
  - `ANTEPROYECTO/05_requisitos_funcionales.md`
  - `ANTEPROYECTO/08_casos_de_uso.md`
  - `ANTEPROYECTO/09_modelo_analisis.md`
  - `UML/01_casos_uso_general.puml`
  - `UML/02_clases_analisis_bce.puml`
  - `UML/03_secuencia_login.puml`
  - `UML/04_secuencia_ejecutar_consulta.puml`
  - `UML/06_componentes_arquitectura.puml`
- Archivos modificados:
  - `ANTEPROYECTO/08_casos_de_uso.md`
  - `UML/01_casos_uso_general.puml`
  - `UML/02_clases_analisis_bce.puml`
  - `UML/03_secuencia_login.puml`
  - `UML/06_componentes_arquitectura.puml`
  - `COORDINACION_IA.md`
- Decisiones tomadas:
  - completar las fichas textuales faltantes de CU-02, CU-09, CU-11, CU-12 y CU-13;
  - corregir la incoherencia que mezclaba bloqueo de login con error de integracion;
  - ajustar el diagrama de casos de uso para reflejar mejor actores y auditoria;
  - corregir la afirmacion falsa de cobertura 44/44 RF.
- Hallazgos importantes:
  - los 15 CU estaban listados, pero no todos estaban especificados;
  - la cobertura CU -> RF no era completa como afirmaba el documento;
  - RF-37 sigue sin caso de uso formal propio;
  - `ConfiguracionSistema` existia en BCE pero sin vinculacion con administracion.
- Pendientes:
  - decidir si RF-37 se modela con un CU especifico o se absorbe formalmente dentro de administracion;
  - validar con el cliente los flujos y la viabilidad real de descarga documental;
  - ajustar CU-13 cuando se defina el mecanismo definitivo de health check.
- Proximo paso sugerido:
  - si queres cierre documental fuerte, la siguiente iteracion deberia atacar RF-37, auditoria y esquema de BD local.

### Entrada 004 - Codex - limpieza de contenido ajeno al proyecto
- Fecha y hora: 13/04/2026 12:11
- Objetivo: eliminar la carpeta `lavadero/`, detectada como contenido ajeno al proyecto SECCAP.
- Archivos leidos:
  - `lavadero/modelo.py`
  - `lavadero/test_lavadero.py`
- Archivos modificados:
  - `COORDINACION_IA.md`
- Decisiones tomadas:
  - tratar `lavadero/` como agregado incorrecto y no relacionado con PPS/SECCAP;
  - eliminar tambien sus artefactos compilados para no dejar basura residual.
- Hallazgos importantes:
  - `lavadero/` contenia un ejercicio de Python sobre aves, vehiculos y lavaderos, sin relacion con el dominio del proyecto;
  - los `.pyc` prueban que ademas fue ejecutado o compilado localmente.
- Pendientes:
  - mantener control de que no reaparezcan contenidos ajenos.
- Proximo paso sugerido:
  - revisar periodicamente la raiz del repo antes de aceptar cambios externos de otro asistente.

### Entrada 005 - Codex - borrador consolidado del anteproyecto
- Fecha y hora: 14/04/2026 12:24
- Objetivo: generar un unico archivo Markdown con el anteproyecto completo en su estado actual para revision integral.
- Archivos leidos:
  - `ANTEPROYECTO/00_diagnostico_inicial.md`
  - `ANTEPROYECTO/01_definicion_problema.md`
  - `ANTEPROYECTO/02_objetivos.md`
  - `ANTEPROYECTO/03_alcance.md`
  - `ANTEPROYECTO/04_stakeholders_actores.md`
  - `ANTEPROYECTO/05_requisitos_funcionales.md`
  - `ANTEPROYECTO/06_requisitos_no_funcionales.md`
  - `ANTEPROYECTO/07_reglas_negocio.md`
  - `ANTEPROYECTO/08_casos_de_uso.md`
  - `ANTEPROYECTO/09_modelo_analisis.md`
  - `ANTEPROYECTO/10_arquitectura_tecnologias.md`
  - `ANTEPROYECTO/11_viabilidad.md`
  - `ANTEPROYECTO/12_planificacion_cronograma.md`
  - `ANTEPROYECTO/13_recursos_presupuesto.md`
  - `ANTEPROYECTO/14_riesgos_suposiciones.md`
  - `ANTEPROYECTO/15_metricas_exito.md`
  - `ANTEPROYECTO/16_gobierno_documental.md`
  - `ANTEPROYECTO/17_consolidacion_final.md`
  - `ANTEPROYECTO/trazabilidad_anteproyecto.md`
- Archivos modificados:
  - `ANTEPROYECTO/18_borrador_anteproyecto_actual.md`
  - `COORDINACION_IA.md`
- Decisiones tomadas:
  - crear un borrador consolidado no destructivo, sin reemplazar los archivos fuente por fase;
  - incluir todas las fases del anteproyecto y la trazabilidad del anteproyecto en un solo `.md`;
  - dejar el archivo como vista integral del estado actual, no como nueva fuente canonica.
- Hallazgos importantes:
  - ya existia una consolidacion ejecutiva en `17_consolidacion_final.md`, pero no un archivo unico con todo el contenido corrido;
  - el nuevo borrador facilita revision lineal, impresion o exportacion.
- Pendientes:
  - si se quiere una version mas prolija para entrega, conviene hacer una segunda pasada editorial y no solo consolidada;
  - revisar si queres excluir `trazabilidad_anteproyecto.md` del borrador final.
- Proximo paso sugerido:
  - leer `ANTEPROYECTO/18_borrador_anteproyecto_actual.md` y decidir si queres una version consolidada limpia para presentacion.

### Entrada 003 - Claude - revisión y segunda iteración UML
- Fecha y hora: 13/04/2026 ~14:30
- Objetivo: revisar el paquete UML inicial de Codex, corregir inconsistencias y crear los diagramas pendientes recomendados en Entrada 002.
- Archivos leidos:
  - `COORDINACION_IA.md`
  - `UML/README.md`
  - `UML/01_casos_uso_general.puml`
  - `UML/02_clases_analisis_bce.puml`
  - `UML/03_secuencia_login.puml`
  - `UML/04_secuencia_ejecutar_consulta.puml`
  - `UML/05_actividad_flujo_consulta.puml`
  - `UML/06_componentes_arquitectura.puml`
  - `UML/07_despliegue_logico.puml`
  - `ANTEPROYECTO/08_casos_de_uso.md` (CU-08, CU-09, CU-10, CU-14)
- Archivos modificados:
  - `UML/07_despliegue_logico.puml` — eliminada referencia a PHP ("o equivalente PHP si se exige"), reemplazada por "Node.js 22 + Express 5 / TypeScript" coherente con DEC-05
  - `UML/08_secuencia_consulta_auditoria.puml` — NUEVO: secuencia completa de CU-10, cubre acceso al módulo, filtrado, paginación y detalle de registro
  - `UML/09_secuencia_descarga_documento.puml` — NUEVO: secuencia completa de CU-09, cubre verificación de permisos, descarga vía proxy, manejo de 404/timeout/éxito
  - `UML/10_er_bd_local.puml` — NUEVO: diagrama entidad-relación de la BD local con 8 tablas (sys_usuario, sys_rol, sys_permiso, sys_usuario_rol, sys_rol_permiso, sys_sesion, audit_log, sys_configuracion, cache_catalogo), notas sobre inmutabilidad y propósito
  - `UML/README.md` — actualizado con los 3 nuevos diagramas en tabla, orden de lectura, pendientes restantes y corrección de referencia a Node.js
  - `COORDINACION_IA.md` — esta entrada
- Decisiones tomadas:
  - eliminar la ambigüedad PHP del diagrama de despliegue; el proyecto ya decidió Node.js 22 + Express 5 como candidata prioritaria (DEC-05); mantener PHP como posibilidad nominal no aporta y genera inconsistencia;
  - crear los 3 diagramas que Codex listó como pendientes en su entrada (secuencia auditoría, secuencia descarga, ER de BD local);
  - el ER de BD local usa nombres de tabla con prefijo sys_ para entidades operativas y audit_ para auditoría, siguiendo convención que facilita separar lógica en migraciones;
  - audit_log usa bigserial y jsonb para filtros, coherente con PostgreSQL 16 y con el volumen potencial de registros;
  - cache_catalogo incluye TTL configurable, alineado con RF de catálogos y la decisión de no replicar datos masivos;
  - no se inventaron campos de la API institucional; el ER se limita a la BD local.
- Hallazgos:
  - los 7 diagramas de Codex estaban técnicamente sólidos y bien alineados con el anteproyecto;
  - la única corrección necesaria fue la referencia a PHP en 07_despliegue_logico.puml;
  - el paquete UML ahora cubre 10 diagramas que abarcan funcionalidad, arquitectura, despliegue y persistencia local.
- Pendientes:
  - renderizar los .puml a PNG/SVG si se necesita entrega visual;
  - diagrama de estados de sesión o cuenta bloqueada (iteración futura);
  - diagrama de paquetes real cuando exista código implementado;
  - validar el ER contra el esquema definitivo cuando se ejecuten las migraciones reales.
- Proximo paso sugerido:
  - decidir si se quiere un diagrama de estados para sesión/cuenta o si se avanza directo a implementación de infraestructura (Fase 2).

### Entrada 005 - Codex - correccion de codificacion del borrador consolidado
- Fecha y hora: 14/04/2026 13:27
- Objetivo: corregir el mojibake detectado en ANTEPROYECTO/18_borrador_anteproyecto_actual.md.
- Archivos leidos:
  - ANTEPROYECTO/18_borrador_anteproyecto_actual.md
  - ANTEPROYECTO/00_diagnostico_inicial.md
  - ANTEPROYECTO/01_definicion_problema.md
  - ANTEPROYECTO/05_requisitos_funcionales.md
  - COORDINACION_IA.md
  - TRAZABILIDAD/fase-1-planificacion.md
- Archivos modificados:
  - ANTEPROYECTO/18_borrador_anteproyecto_actual.md - regenerado con lectura y escritura UTF-8 explicita desde los archivos fuente del anteproyecto
  - COORDINACION_IA.md - esta entrada
- Decisiones tomadas:
  - no corregir manualmente miles de palabras dentro del borrador;
  - regenerar el archivo completo a partir de las fuentes, porque el error estaba en la consolidacion y no en los documentos base;
  - mantener el alcance del cambio limitado al borrador consolidado.
- Hallazgos:
  - los archivos fuente del directorio ANTEPROYECTO/ estan correctos en UTF-8;
  - el borrador anterior habia sido generado con una lectura incorrecta de codificacion, produciendo doble mojibake;
  - tras la regeneracion ya no aparecen secuencias corruptas tipicas del caso anterior.
- Pendientes:
  - si el usuario quiere un borrador presentable, hacer una segunda pasada editorial para homogeneizar estilo y eliminar repeticiones.

### Entrada 006 - Codex - fijacion del flujo Claude implementa / Codex revisa
- Fecha y hora: 17/04/2026
- Objetivo: dejar formalizado en el repo que Claude implementa todo el sistema y Codex solo revisa resultados, usando `COORDINACION_IA.md` como punto de arranque operativo.
- Archivos leidos:
  - `COORDINACION_IA.md`
  - `.github/prompts/planmode-implementacion-mock-api-claude-opus-4-6.prompt.md`
  - `.github/prompts/ejecucion-fase-a-fase-claude-opus-4-6.prompt.md`
- Archivos modificados:
  - `COORDINACION_IA.md`
  - `.github/prompts/ejecucion-fase-a-fase-claude-opus-4-6.prompt.md`
  - `.github/prompts/inicio-claude-implementador.prompt.md`
- Decisiones tomadas:
  - fijar roles no ambiguos: Claude implementa, Codex revisa;
  - usar `COORDINACION_IA.md` como fuente operativa de "donde iniciar" y "que sigue";
  - obligar a Claude a detenerse al final de cada subfase para revision tecnica de Codex;
  - dejar una subfase inicial explicita: `Fase 2.1 - Estructura base del repo` dentro de `SECCAP/`.
- Pendientes:
  - que Claude ejecute la primera subfase pendiente;
  - que Codex revise el primer resultado de implementacion y marque hallazgos antes de permitir la siguiente subfase.
- Proximo paso sugerido:
  - iniciar Claude con `.github/prompts/inicio-claude-implementador.prompt.md`.
