# FASE 1 — DEFINICIÓN DEL PROBLEMA U OPORTUNIDAD
# SECCAP — Sistema del Ejército de Consulta Segura de Capacidades y Aptitudes del Personal

## 1. Nombre de la Fase
**Definición del Problema u Oportunidad**

## 2. Objetivo
Redactar con precisión el problema real que da origen al proyecto, centrado en la necesidad organizacional —no en la solución—, identificando su impacto, la oportunidad de mejora, las consecuencias de no resolverlo y los actores directamente afectados.

---

## 3. Desarrollo

### 3.1. Descripción del Problema

La institución de Defensa Nacional administra información crítica sobre las capacidades, aptitudes, formaciones profesionales, acreditaciones e idiomas de su personal. Esta información, almacenada en una base de datos corporativa privada y de acceso restringido, constituye un insumo esencial para la toma de decisiones operativas, la asignación de funciones, la planificación de capacitaciones y el cumplimiento de requisitos reglamentarios.

**El problema central radica en la inexistencia de un mecanismo unificado, seguro y estructurado que permita consultar esta información de forma transversal, oportuna y controlada.**

En la situación actual:

1. **Fragmentación del acceso:** La información de capacidades y aptitudes se consulta mediante procedimientos heterogéneos —solicitudes al Área de Personal, acceso a planillas dispersas, consultas verbales o correos electrónicos—, sin un canal único ni estandarizado.

2. **Ausencia de filtrado inteligente:** No existe un sistema que permita cruzar criterios de búsqueda (tipo de formación, categoría militar, aptitud específica, vigencia, idioma, unidad, grado) de forma jerárquica y dependiente. Las consultas actuales son lineales, manuales y propensas a errores de interpretación.

3. **Carencia de control de acceso diferenciado:** No se dispone de un esquema formal de roles que determine quién puede consultar qué información. Cualquier persona con acceso al canal informal puede potencialmente obtener datos que exceden su nivel de autorización.

4. **Inexistencia de trazabilidad y auditoría:** No se registra quién consulta qué información, cuándo, con qué filtros ni con qué resultado. Esto impide la rendición de cuentas y dificulta la detección de accesos indebidos.

5. **Exposición de datos sensibles:** Al no existir una capa intermedia que filtre y sancione los datos devueltos según el perfil del consultante, existe riesgo de exposición de información personal y militar que debería estar protegida bajo el principio de mínimo privilegio.

6. **Ineficiencia operativa:** Los tiempos de respuesta para obtener información consolidada sobre las capacidades del personal son significativamente mayores a lo aceptable para la operatoria institucional, generando cuellos de botella en procesos dependientes.

### 3.2. Impacto Actual en la Organización

| Dimensión | Impacto Observado |
|---|---|
| **Operativa** | Demoras en la obtención de información para asignación de funciones, conformación de equipos y planificación de misiones que requieren personal con aptitudes específicas |
| **Seguridad de la información** | Riesgo de acceso no autorizado a datos personales y militares sensibles por ausencia de RBAC y auditoría |
| **Toma de decisiones** | Decisiones basadas en información parcial, desactualizada o no verificada debido a la fragmentación de fuentes |
| **Cumplimiento normativo** | Incumplimiento potencial de regulaciones de protección de datos personales (Ley 25.326) y normativa interna de seguridad de la información en el ámbito de Defensa |
| **Administrativa** | Carga de trabajo excesiva en el Área de Personal, que actúa como intermediario manual para toda consulta |
| **Trazabilidad** | Imposibilidad de auditar el uso de información de personal, lo cual compromete la rendición de cuentas institucional |

### 3.3. Oportunidad de Mejora

El hecho de que la institución disponga de una **API de solo lectura** sobre la base de datos de personal constituye una **oportunidad técnica concreta** para resolver el problema sin comprometer la integridad ni la seguridad de los datos de origen.

La oportunidad se articula en los siguientes ejes:

> **Nota importante:** La oportunidad no consiste en reemplazar el sistema institucional de RRHH ni en construir un nuevo sistema de gestión de personal. Se trata de desarrollar una **solución de consulta controlada** (SECCAP) que consuma la API Read-Only existente, agregando una capa de seguridad (RBAC), trazabilidad (auditoría) y experiencia de usuario (filtros jerárquicos) que hoy no existen.

1. **Centralización controlada:** Construir un punto único de consulta que consuma la API institucional, eliminando la dispersión actual de canales informales.

2. **Filtrado inteligente y jerárquico:** Implementar un sistema de filtros dependientes que guíe al usuario a través de la estructura real de los datos (tipo de formación → categoría → aptitud → filtros transversales), reduciendo errores y mejorando la precisión de las consultas.

3. **Seguridad por diseño:** Incorporar desde el inicio un esquema RBAC que determine, por rol, qué datos puede consultar cada usuario, cumpliendo con el principio de mínimo privilegio.

4. **Auditoría y trazabilidad completa:** Registrar localmente toda operación de consulta, permitiendo verificar retrospectivamente quién accedió a qué información.

5. **Eficiencia operativa:** Reducir los tiempos de respuesta de horas o días (consulta manual) a segundos (consulta automatizada sobre API), liberando recursos del Área de Personal.

6. **No intrusión:** La naturaleza Read-Only del sistema garantiza que los datos de origen permanecen intactos, sin riesgo de modificación accidental o maliciosa.

### 3.4. Consecuencias de No Resolver el Problema

| ID | Consecuencia | Gravedad |
|---|---|---|
| CNR-01 | Se mantiene la exposición de datos sensibles sin control de acceso formal | **Crítica** |
| CNR-02 | Se perpetúa la imposibilidad de auditar consultas sobre información de personal | **Alta** |
| CNR-03 | El Área de Personal sigue actuando como intermediario manual, con sobrecarga creciente a medida que aumentan las consultas | **Alta** |
| CNR-04 | Las decisiones operativas continúan basándose en información parcial, desactualizada o no verificable | **Alta** |
| CNR-05 | Se incrementa el riesgo de incumplimiento normativo ante posibles auditorías internas o externas | **Alta** |
| CNR-06 | La API institucional existente permanece subutilizada, desperdiciando una inversión tecnológica ya realizada | **Media** |
| CNR-07 | Se dificulta la planificación de capacitaciones, la detección de brechas formativas y la consulta de vigencias de acreditaciones | **Media** |

### 3.5. Actores Afectados

| Actor | Relación con el Problema | Efecto |
|---|---|---|
| **Área de Personal / RRHH** | Gestora y custodia de la información. Actualmente, intermediaria manual obligada de toda consulta | Sobrecarga operativa; responsabilidad difusa sobre el uso de la información |
| **Jefes de Unidad / Dependencia** | Necesitan información de capacidades para asignación de funciones y conformación de equipos | Demora en la obtención de datos; decisiones con información incompleta |
| **Oficiales de Planeamiento** | Requieren datos transversales sobre aptitudes para planificación de misiones y ejercicios | Incapacidad de realizar consultas cruzadas eficientes |
| **Personal consultado (sujeto de datos)** | Sus datos personales y profesionales son objeto de las consultas | Exposición potencial de información sensible sin trazabilidad |
| **Área de Seguridad de la Información** | Responsable de velar por el cumplimiento de políticas de protección de datos | Imposibilidad de controlar y auditar el flujo de consultas |
| **Dirección / Comandancia** | Autoridad que requiere información consolidada para decisiones estratégicas | Visibilidad limitada sobre las capacidades reales del personal |
| **Área de Informática / Infraestructura** | Proveedores de la API y del soporte tecnológico | Deben habilitar acceso controlado a la nueva aplicación |

---

## 4. Tablas y Matrices

### 4.1. Matriz Problema - Impacto - Actor

| Aspecto del Problema | Impacto Principal | Actor Más Afectado |
|---|---|---|
| Fragmentación del acceso | Ineficiencia operativa | Área de Personal, Jefes de Unidad |
| Ausencia de filtrado inteligente | Consultas imprecisas o incompletas | Oficiales de Planeamiento |
| Sin control de acceso diferenciado | Exposición de datos sensibles | Personal consultado, Área de Seguridad |
| Sin trazabilidad ni auditoría | Incumplimiento normativo | Dirección, Área de Seguridad |
| Exposición de datos sensibles | Riesgo legal y normativo | Personal consultado, Dirección |
| Ineficiencia operativa | Demoras en decisiones | Todos los actores |

---

## 5. Observaciones

1. **Centrado en el problema, no en la solución:** Esta fase describe exclusivamente la necesidad organizacional. La solución técnica se desarrollará en fases posteriores (FASE 10 en adelante).

2. **El problema es multidimensional:** Combina aspectos operativos (ineficiencia), de seguridad (exposición de datos), normativos (cumplimiento legal), y de gestión (toma de decisiones con información deficiente). Esta multidimensionalidad justifica la complejidad del proyecto.

3. **La oportunidad es concreta:** La existencia de la API institucional de solo lectura no es un supuesto —es una condición confirmada del entorno— y constituye el habilitador técnico principal del proyecto.

4. **Coherencia con la FASE 0:** Los vacíos y supuestos detectados en el diagnóstico inicial no contradicen la definición del problema aquí presentada; por el contrario, refuerzan la necesidad de un enfoque iterativo.

---

## 6. Pendientes

| ID | Pendiente | Responsable | Prioridad |
|---|---|---|---|
| PEN-F1-01 | Validar con el cliente que la descripción del problema refleja fielmente la realidad institucional | Director de Proyecto | Alta |
| PEN-F1-02 | Confirmar el volumen de consultas manuales actuales para cuantificar el impacto operativo | Equipo + Área de Personal | Media |
| PEN-F1-03 | Verificar si existen antecedentes de incidentes de seguridad o auditorías fallidas por falta de trazabilidad | Director de Proyecto | Media |

---

## 7. Entregable Generado

**"Definición del Problema y Oportunidad"** — Documento `01_definicion_problema.md`

Contenido entregado:
- ✅ Descripción formal del problema (6 dimensiones identificadas)
- ✅ Impacto actual en la organización (6 dimensiones)
- ✅ Oportunidad de mejora (6 ejes)
- ✅ Consecuencias de no resolverlo (7 consecuencias priorizadas)
- ✅ Actores afectados (7 actores identificados con relación y efecto)
- ✅ Matriz Problema - Impacto - Actor
- ✅ Observaciones y pendientes

---

## 8. Próxima Fase Recomendada

**FASE 2 — Objetivos del Proyecto**

Se definirán el objetivo general y los objetivos específicos, alineados directamente con el problema aquí descrito. Los objetivos deberán ser alcanzables, medibles y coherentes con el alcance que se delimitará en la FASE 3.

> **Precondición:** No existen dependencias bloqueantes. El problema está definido con suficiente precisión para derivar objetivos verificables.
