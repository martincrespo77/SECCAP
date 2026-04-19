# Inicio Claude Implementador

Lee y respeta estos archivos en este orden:

1. `COORDINACION_IA.md`
2. `.github/prompts/ejecucion-fase-a-fase-claude-opus-4-6.prompt.md`
3. `.github/prompts/planmode-implementacion-mock-api-claude-opus-4-6.prompt.md`

Reglas fijas:

- Vos implementas todo el sistema.
- Codex no implementa; Codex revisa tus resultados.
- Todo el codigo ejecutable debe quedar dentro de `SECCAP/`.
- No hagas replanificacion global.
- Toma solo la `Proxima subfase a ejecutar` indicada en `COORDINACION_IA.md`.
- Implementa solo ese slice.
- Valida lo que toques.
- Actualiza `COORDINACION_IA.md` con handoff completo.
- No actualices `TRAZABILIDAD/`; esa parte la hace Codex despues de revisar.
- Luego detenete para revision de Codex.

Comenza ahora con la subfase pendiente indicada en `COORDINACION_IA.md`.
