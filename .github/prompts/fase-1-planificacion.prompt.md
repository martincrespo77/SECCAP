---
description: "Fase 1: Planificación y Documentación PMBOK. Completar documentos formales, definir alcance, revisar acta de constitución, EDT, cronograma, costos, riesgos."
agent: "documentacion"
---
# Fase 1: Planificación y Documentación

## Objetivo de esta fase
Completar y consolidar toda la documentación formal PMBOK del proyecto antes de comenzar a codificar.

## Contexto
Leé primero [Contexto.md](../../Contexto.md) para entender el proyecto completo.
Todos los documentos están en [DOCUMENTOS/](../../DOCUMENTOS/).

## Tareas de esta fase

### 1. Completar campos faltantes
Revisar los 12 documentos en `DOCUMENTOS/` e identificar toda información marcada como `[Nombre]`, `[Fecha]`, `X hs.` u otros placeholders. Listar qué falta y proponer valores realistas.

### 2. Validar coherencia entre documentos
- Los riesgos del acta (01) deben coincidir con el registro de riesgos (06)
- La EDT (03) debe cubrir todo lo mencionado en alcance (02)
- El cronograma (04) debe reflejar las fases de la EDT
- Los criterios de aceptación de alcance (02) deben reflejarse en pruebas (10)

### 3. Completar el Glosario
En `08_comunicaciones.md` hay definiciones formales pendientes (Aptitud, Capacidad, etc.).

### 4. Estimar horas
En `05_costos.md` hay estimaciones marcadas como `X hs.` que deben completarse con valores realistas para una PPS de ~14 semanas.

### 5. Entregable final de fase
Un reporte de estado de cada documento con formato:
- **Documento:** nombre
- **Estado:** Completo / Parcial / Pendiente
- **Campos faltantes:** lista
- **Recomendación:** acción necesaria
