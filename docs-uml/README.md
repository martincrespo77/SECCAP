# docs-uml — Módulo de Documentación UML Interactiva

Módulo independiente para generar y visualizar documentación UML interactiva y documentación Sphinx, sin impactar el proyecto principal.

## Características

- **Vista interactiva de arquitectura**: Grafo navegable con nodos, capas, relaciones, filtros y búsqueda.
- **Diagramas UML aislados**: PlantUML como fuente, renderizado a SVG/PNG.
- **Documentación Sphinx**: Documentación narrativa con diagramas embebidos.
- **Manifiesto declarativo**: JSON Schema validable que describe nodos, relaciones y capas.
- **Cero impacto**: No modifica dependencias, runtime ni base de datos del proyecto.
- **Portabilidad**: Funciona con cualquier stack tecnológico (Python, Java, Node.js, .NET, PHP).

## Requisitos

| Herramienta | Uso | Obligatorio |
|---|---|---|
| Python 3.10+ | Scripts de generación, Sphinx | Sí |
| Java JRE 11+ | Renderizado PlantUML | Solo para diagramas |
| plantuml.jar | Motor de renderizado | Solo para diagramas |

## Inicio rápido

### 1. Crear entorno virtual (una sola vez)

```powershell
# Windows (PowerShell)
python -m venv .venv-docs
.venv-docs\Scripts\Activate.ps1
pip install -r requirements-docs.txt
```

```bash
# Linux / macOS
python3 -m venv .venv-docs
source .venv-docs/bin/activate
pip install -r requirements-docs.txt
```

### 2. Validar manifiesto

```bash
python scripts/validate_manifest.py
```

### 3. Renderizar diagramas (requiere Java + plantuml.jar)

```bash
# Descargar plantuml.jar a tools/
python scripts/render_plantuml.py
```

### 4. Ensamblar vista interactiva

```bash
python scripts/build_interactive.py
```

### 5. Abrir vista interactiva

```bash
# Opción A: abrir directamente
start output/interactive/index.html

# Opción B: servidor local
python -m http.server 8080 --directory output/interactive
```

### 6. Generar todo de una vez

```bash
python scripts/generate.py --all
```

## Estructura

```text
docs-uml/
├── manifest/                  # Manifiesto declarativo
│   ├── manifest.json          # Nodos, capas, relaciones, diagramas
│   └── manifest.schema.json   # JSON Schema para validación
├── diagrams/                  # Fuentes de diagramas
│   ├── plantuml/              # Archivos .puml
│   └── mermaid/               # Archivos .mmd (opcionales)
├── templates/                 # Vista interactiva (fuentes)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/                    # Lógica de la vista
│   └── vendor/                # Librerías vendorizadas (Cytoscape.js)
├── sphinx/                    # Documentación Sphinx (Fase 3)
├── scripts/                   # Scripts de generación
│   ├── generate.py            # CLI principal
│   ├── validate_manifest.py   # Validar manifiesto
│   ├── render_plantuml.py     # Renderizar .puml → SVG/PNG
│   └── build_interactive.py   # Ensamblar vista interactiva
├── tools/                     # Herramientas (plantuml.jar)
├── output/                    # Artefactos generados (.gitignore)
├── config.yaml                # Configuración del módulo
├── requirements-docs.txt      # Dependencias Python
└── .gitignore
```

## Adaptación a otros proyectos

1. Copiar la carpeta `docs-uml/` al nuevo proyecto.
2. Editar `manifest/manifest.json` con los nodos, capas y relaciones del nuevo proyecto.
3. Colocar los diagramas `.puml` en `diagrams/plantuml/`.
4. Ejecutar `python scripts/generate.py --all`.

## Reglas de seguridad

- **Nunca** incluir archivos `.env`, secretos ni contraseñas en este módulo.
- El campo `sourcePath` del manifiesto es informativo y se elimina durante sanitización pública.
- Todas las librerías JS están vendorizadas; no se usan CDN en producción.
- Los artefactos en `output/` están en `.gitignore` y no deben comitearse.

## Licencia

Uso interno — Este módulo es reutilizable bajo la misma licencia del proyecto principal.
