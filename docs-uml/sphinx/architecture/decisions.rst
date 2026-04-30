Decisiones de Arquitectura (ADR)
==================================

Esta sección registra las decisiones de arquitectura más relevantes tomadas durante el diseño del sistema.

ADR-01 — Node.js 22 + Express 5 como backend
---------------------------------------------

**Estado:** Aprobada

**Contexto:** Se necesitaba un runtime para la capa proxy que sea suficientemente maduro, con soporte TypeScript nativo y 
capacidad de integrarse con herramientas modernas de BD (Prisma 7).

**Decisión:** Node.js 22 LTS con Express 5 y TypeScript 5 en modo estricto.

**Consecuencias:**
- Runtime moderno con soporte LTS multi-año.
- Express 5 elimina callbacks legacy; manejo de errores más limpio.
- Prisma 7 requiere ``@prisma/adapter-pg`` como driver adapter obligatorio.

----

ADR-02 — Proxy obligatorio, frontend sin acceso directo a la API institucional
--------------------------------------------------------------------------------

**Estado:** Aprobada

**Contexto:** La API institucional del Área de Personal es sensible y no puede exponerse al browser.

**Decisión:** Todo acceso a la API institucional pasa por el backend proxy sin excepción.

**Consecuencias:**
- El frontend nunca tiene credenciales de la API institucional.
- El backend puede podar campos según el rol del usuario antes de responder.
- La auditoría se registra en el servidor; el cliente no puede omitirla.
- Mayor latencia (una hop adicional), aceptable para el caso de uso.

----

ADR-03 — Adaptador ACL / Anti-Corruption Layer
------------------------------------------------

**Estado:** Aprobada

**Contexto:** El contrato de la API institucional puede cambiar sin previo aviso.

**Decisión:** Implementar el patrón Adapter con una capa de ``MapperRespuestaAPI`` que aísla al dominio del contrato externo.

**Consecuencias:**
- Si la API cambia, solo se modifica el adaptador, no el dominio.
- El sistema puede sustituir la API por un mock durante desarrollo sin cambiar el backend.

----

ADR-04 — audit_log inmutable
------------------------------

**Estado:** Aprobada

**Contexto:** El sistema necesita trazabilidad legal de consultas y acciones administrativas.

**Decisión:** ``audit_log`` solo recibe INSERT. No existe endpoint de DELETE ni UPDATE sobre esta tabla en ningún módulo.

**Consecuencias:**
- La tabla crece indefinidamente. Se requiere política de archivo o purga por fuera del sistema.
- Los registros son evidencia de auditoría confiable.

----

ADR-05 — JWT sin refresh automático en primera versión
-------------------------------------------------------

**Estado:** Aprobada (revisable en Fase 6)

**Contexto:** Simplicidad de la primera versión, menor superficie de ataque.

**Decisión:** JWT con expiración fija. No se implementa refresh token en Fase 3. El usuario debe re-autenticarse al expirar.

**Consecuencias:**
- Menor complejidad en el backend.
- Experiencia de usuario degradada para sesiones largas.
- Revisable en Fase 6 si el cliente lo requiere.
