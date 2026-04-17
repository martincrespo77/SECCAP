# Trazabilidad - Fase 1: Planificacion y Documentacion

> Registro cronologico de actividades realizadas en esta fase.

## Registro de actividades

| Fecha | Hora | Actividad | Motivo | Resultado |
|-------|------|-----------|--------|-----------|
| 30/03/2026 | -- | Auditoria completa de los 12 documentos PMBOK | Identificar campos faltantes, placeholders e inconsistencias antes de comenzar a completar | Se detectaron: 3 placeholders en 01_acta, horas en 05_costos como `X hs.`, glosario incompleto en 08_comunicaciones, riesgos desalineados entre 01 y 06, falta test de auditoria en 10_pruebas |
| 30/03/2026 | -- | Completar campos de 01_acta_constitucion.md | Los campos Patrocinador, Director y Fechas estaban genericos sin marcado claro | Se marcaron como `[PENDIENTE]` con descripcion de que dato se necesita. Se alinearon los 4 riesgos con IDs R-01 a R-04 consistentes con 06_riesgos.md |
| 30/03/2026 | -- | Estimar horas en 05_costos.md | Todas las lineas de esfuerzo estaban marcadas como `X hs.` sin valor | Se calcularon 230 hs totales (~16 hs/semana x 14 semanas): Analisis 30h, Infra 20h, Backend 60h, Frontend 70h, QA 30h, Implantacion 20h |
| 30/03/2026 | -- | Completar Glosario en 08_comunicaciones.md | Las definiciones de Aptitud y Capacidad estaban como `[Definicion formal]` | Se redactaron 9 definiciones formales: Aptitud, Capacidad, Capacitacion, Formacion Profesional, Proxy Local, Auditoria Interna, RBAC, DTO, Filtro Jerarquico |
| 30/03/2026 | -- | Validar coherencia entre documentos | Garantizar que riesgos, EDT, cronograma, criterios de aceptacion y pruebas esten alineados | Se alinearon riesgos 01-06 (4 riesgos con IDs consistentes). Se agrego TS-05 (Test de Auditoria) en 10_pruebas.md para cubrir criterio de aceptacion #3 del alcance. EDT-cronograma: 6 bloques = 6 fases, correcto |
| 10/04/2026 | 10:12 | Analizar la estructura del repositorio y crear bitacora compartida entre IAs | Necesidad de coordinar trabajo entre Codex y Claude en chats aislados sin contaminar `Contexto.md` | Se creo `COORDINACION_IA.md` como archivo append-only de handoff. Se confirmo que el repo actual es principalmente documental, con fases y agentes definidos en `.github/`, y se detecto ausencia de `.git` en la raiz actual |
| 13/04/2026 | 11:20 | Crear paquete UML inicial en carpeta `UML/` | Necesidad de traducir requisitos funcionales y no funcionales a diagramas utiles para analisis, defensa academica e implementacion futura | Se creo `UML/README.md` con el plan de diagramas y 7 archivos PlantUML: casos de uso, clases BCE, secuencia de login, secuencia de consulta, actividad de consulta, componentes y despliegue logico |
| 13/04/2026 | 12:11 | Auditar completitud de UML y casos de uso | Verificar que el modelado realmente cubriera requisitos, actores y documentos fuente sin afirmaciones falsas de completitud | Se completaron las fichas textuales faltantes de CU-02, CU-09, CU-11, CU-12 y CU-13; se corrigio el diagrama de casos de uso y la secuencia de login; se ajusto el BCE; y se dejo explicitado que RF-37 sigue sin caso de uso formal propio |
| 13/04/2026 | 12:11 | Eliminar contenido ajeno al proyecto en `lavadero/` | El usuario confirmo que la carpeta no pertenece al proyecto actual y solicito su eliminacion | Se identifico `lavadero/` como contenido ajeno al dominio SECCAP y se procedio a retirarlo junto con sus artefactos compilados |
| 14/04/2026 | 12:24 | Generar borrador consolidado del anteproyecto en un unico `.md` | Necesidad de revisar el estado actual completo del anteproyecto sin abrir archivo por archivo | Se creo `ANTEPROYECTO/18_borrador_anteproyecto_actual.md` con la consolidacion secuencial de todas las fases del anteproyecto y su trazabilidad |
| 14/04/2026 | 13:27 | Corregir codificacion del borrador consolidado del anteproyecto | El archivo 18_borrador_anteproyecto_actual.md mostraba mojibake por lectura incorrecta al consolidar | Se regenero el borrador con lectura/escritura UTF-8 explicita y desaparecieron las secuencias corruptas |
---

*Este documento se actualiza automaticamente cada vez que se trabaja en la Fase 1.*
