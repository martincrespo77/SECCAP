# Documentación Técnica — SECCAP

Esta carpeta contiene documentación técnica de implementación, operación, QA y capacitación del sistema.

## Contenido

| Documento | Descripción |
|---|---|
| [implantacion.md](implantacion.md) | Guía técnica de implantación (Fase 6) |
| [operacion.md](operacion.md) | Operación diaria y diagnóstico (Fase 6) |
| [capacitacion_operadores.md](capacitacion_operadores.md) | Material de capacitación para operadores (Fase 6) |
| [qa.md](qa.md) | Estrategia, alcance y comandos de QA (Fase 5) |

## Documentos relacionados fuera de esta carpeta

- Manual de usuario: [../docs/manual_usuario.md](../docs/manual_usuario.md)
- Guía técnica general del monorepo: [../README.md](../README.md)
- Documentación PMBOK y UML: raíz del repositorio (`DOCUMENTOS/`, `UML/`).

## docs-uml

Para regenerar toda la documentación UML desde la terminal del editor:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\docs-uml-local.ps1
```

Eso deja generado `docs-uml/output/PREVIEW.md`, útil para ver los SVG desde el editor sin navegador.

Si querés además la vista HTML interactiva y Sphinx servidas localmente:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\docs-uml-local.ps1 -Serve
```
