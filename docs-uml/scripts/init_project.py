#!/usr/bin/env python3
"""
init_project.py — Inicializar docs-uml para un nuevo proyecto.

Genera la estructura mínima necesaria para empezar a documentar
un nuevo proyecto con el módulo docs-uml.

Uso:
    python scripts/init_project.py --name "Mi Proyecto" --version "0.1.0" --stack "Python,FastAPI,PostgreSQL"
    python scripts/init_project.py --name "Mesa de Ayuda" --type python
    python scripts/init_project.py --name "Microservicio X" --type node

Tipos de proyecto pre-configurados:
    - node    : Node.js / Express / NestJS
    - python  : Python / FastAPI / Django / Flask
    - java    : Java / Spring Boot
    - react   : Frontend React puro
    - generic : Genérico (plantilla mínima)
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

# ── Plantillas de manifiesto por tipo de proyecto ──────────────────

MANIFEST_TEMPLATES = {
    "node": {
        "layers": [
            {"id": "api", "name": "API Layer", "color": "#3B82F6", "description": "Express/NestJS controllers and routes", "order": 0},
            {"id": "service", "name": "Service Layer", "color": "#10B981", "description": "Business logic and orchestration", "order": 1},
            {"id": "repository", "name": "Repository Layer", "color": "#F59E0B", "description": "Data access with ORM/ODM", "order": 2},
            {"id": "external", "name": "External Services", "color": "#EF4444", "description": "Third-party APIs and integrations", "order": 3},
        ],
        "stack_hint": ["Node.js 22", "Express 5", "TypeScript 5"],
    },
    "python": {
        "layers": [
            {"id": "presentation", "name": "Presentation", "color": "#3B82F6", "description": "FastAPI/Django/Flask routes and views", "order": 0},
            {"id": "application", "name": "Application", "color": "#10B981", "description": "Use cases and application services", "order": 1},
            {"id": "domain", "name": "Domain", "color": "#8B5CF6", "description": "Entities, value objects, domain services", "order": 2},
            {"id": "infrastructure", "name": "Infrastructure", "color": "#F59E0B", "description": "Repositories, ORM, external adapters", "order": 3},
        ],
        "stack_hint": ["Python 3.12", "FastAPI", "SQLAlchemy", "PostgreSQL"],
    },
    "java": {
        "layers": [
            {"id": "controller", "name": "Controller", "color": "#3B82F6", "description": "Spring MVC/WebFlux controllers", "order": 0},
            {"id": "service", "name": "Service", "color": "#10B981", "description": "Spring @Service business logic", "order": 1},
            {"id": "repository", "name": "Repository", "color": "#F59E0B", "description": "Spring Data JPA repositories", "order": 2},
            {"id": "external", "name": "External", "color": "#EF4444", "description": "RestTemplate/WebClient integrations", "order": 3},
        ],
        "stack_hint": ["Java 21", "Spring Boot 3", "JPA", "PostgreSQL"],
    },
    "react": {
        "layers": [
            {"id": "pages", "name": "Pages", "color": "#3B82F6", "description": "Route-level page components", "order": 0},
            {"id": "components", "name": "Components", "color": "#10B981", "description": "Shared UI components", "order": 1},
            {"id": "state", "name": "State Management", "color": "#8B5CF6", "description": "Context, Zustand, Redux", "order": 2},
            {"id": "api", "name": "API Client", "color": "#F59E0B", "description": "HTTP client layer (fetch, axios, react-query)", "order": 3},
        ],
        "stack_hint": ["React 19", "TypeScript 5", "Vite", "TanStack Query"],
    },
    "generic": {
        "layers": [
            {"id": "frontend", "name": "Frontend", "color": "#3B82F6", "description": "User interface layer", "order": 0},
            {"id": "backend", "name": "Backend", "color": "#10B981", "description": "Business logic and API", "order": 1},
            {"id": "data", "name": "Data", "color": "#F59E0B", "description": "Data storage and persistence", "order": 2},
            {"id": "external", "name": "External", "color": "#EF4444", "description": "Third-party services and APIs", "order": 3},
        ],
        "stack_hint": [],
    },
}


def find_module_root() -> Path:
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def generate_manifest(name: str, version: str, stack: list[str], template_type: str) -> dict:
    """Generar un manifest.json inicial basado en la plantilla del tipo de proyecto."""
    template = MANIFEST_TEMPLATES.get(template_type, MANIFEST_TEMPLATES["generic"])
    effective_stack = stack if stack else template["stack_hint"]

    return {
        "$schema": "./manifest.schema.json",
        "project": {
            "name": name,
            "version": version,
            "description": f"Documentación de arquitectura de {name}",
            "stack": effective_stack,
        },
        "layers": template["layers"],
        "nodes": [
            {
                "id": "example-node",
                "name": "Ejemplo de Nodo",
                "layer": template["layers"][0]["id"],
                "type": "module",
                "description": "Reemplazar con nodos reales del proyecto.",
                "tags": ["ejemplo"],
                "visibility": "public",
            }
        ],
        "relations": [],
        "diagrams": [
            {
                "id": "01_arquitectura",
                "title": "Visión General de Arquitectura",
                "type": "architecture",
                "source": "diagrams/plantuml/01_arquitectura.puml",
                "format": "plantuml",
                "description": "Diagrama inicial de arquitectura.",
                "visibility": "public",
                "order": 1,
            }
        ],
    }


def generate_starter_puml(name: str, template_type: str) -> str:
    """Generar un diagrama PlantUML de inicio."""
    template = MANIFEST_TEMPLATES.get(template_type, MANIFEST_TEMPLATES["generic"])
    layers = template["layers"]

    lines = [
        "@startuml",
        f"title {name} - Visión General de Arquitectura",
        "top to bottom direction",
        "skinparam componentStyle rectangle",
        "",
    ]

    for i, layer in enumerate(layers):
        lines.append(f'package "{layer["name"]}" {{')
        lines.append(f'  [Componente {i+1}]')
        lines.append("}")
        lines.append("")

    # Agregar conexiones de ejemplo
    for i in range(len(layers) - 1):
        lines.append(f"[Componente {i+1}] --> [Componente {i+2}]")

    lines += ["", "@enduml"]
    return "\n".join(lines)


def generate_config(name: str) -> str:
    """Generar config.yaml para el nuevo proyecto."""
    return f"""# docs-uml — Configuración del módulo de documentación
# Proyecto: {name}

project:
  name: "{name}"
  version: "0.1.0"
  description: "Documentación de arquitectura de {name}"

paths:
  manifest: "manifest/manifest.json"
  manifest_schema: "manifest/manifest.schema.json"
  diagrams_plantuml: "diagrams/plantuml"
  diagrams_mermaid: "diagrams/mermaid"
  templates: "templates"
  sphinx_source: "sphinx"
  output: "output"
  output_interactive: "output/interactive"
  output_diagrams: "output/diagrams"
  output_sphinx: "output/sphinx"

generation:
  plantuml:
    method: "jar"
    jar_path: "tools/plantuml.jar"
    output_format: "svg"
  mermaid:
    method: "browser"
  sphinx:
    theme: "furo"
    language: "es"

security:
  default_visibility: "internal"
  sanitize_patterns:
    - '[A-Z]:\\\\'
    - '/home/'
    - '/Users/'
    - 'API_KEY'
    - 'SECRET'
    - 'PASSWORD'
    - 'TOKEN'

publishing:
  method: "none"
  base_url: "/docs-uml/"
"""


def copy_templates_structure(module_root: Path, target: Path, dry_run: bool) -> None:
    """Copiar la estructura de templates del módulo al target."""
    templates_src = module_root / "templates"
    templates_dst = target / "templates"

    if templates_src.exists() and not templates_dst.exists():
        if not dry_run:
            shutil.copytree(templates_src, templates_dst)
        print(f"   ✅ templates/ copiado desde {templates_src}")
    elif templates_dst.exists():
        print(f"   ⚠️  templates/ ya existe en {target}, omitiendo")
    else:
        print(f"   ⚠️  templates/ no encontrado en {module_root}")


def main():
    parser = argparse.ArgumentParser(
        description="Inicializar un nuevo proyecto de documentación docs-uml.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Tipos de proyecto:
  node     Node.js / Express / NestJS
  python   Python / FastAPI / Django / Flask
  java     Java / Spring Boot
  react    Frontend React puro
  generic  Genérico (por defecto)

Ejemplos:
  python scripts/init_project.py --name "Mesa de Ayuda" --type python
  python scripts/init_project.py --name "SECCAP v2" --type node --version "2.0.0"
  python scripts/init_project.py --name "Microservicio X" --stack "Java 21,Spring Boot"
        """,
    )
    parser.add_argument("--name", required=True, help="Nombre del proyecto.")
    parser.add_argument("--version", default="0.1.0", help="Versión inicial (default: 0.1.0).")
    parser.add_argument(
        "--type",
        default="generic",
        choices=list(MANIFEST_TEMPLATES.keys()),
        help="Tipo de proyecto para plantilla pre-configurada.",
    )
    parser.add_argument(
        "--stack",
        default="",
        help='Stack tecnológico separado por comas. Ej: "Node.js 22,PostgreSQL".',
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Directorio destino. Default: directorio actual.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Solo mostrar qué se crearía.")
    args = parser.parse_args()

    module_root = find_module_root()
    target = Path(args.output) if args.output else Path.cwd()
    stack = [s.strip() for s in args.stack.split(",") if s.strip()] if args.stack else []

    mode = " (DRY RUN)" if args.dry_run else ""
    print(f"🚀 Inicializando docs-uml para: '{args.name}'{mode}")
    print(f"   Tipo: {args.type}")
    print(f"   Versión: {args.version}")
    print(f"   Destino: {target}")
    print()

    # Estructura de carpetas a crear
    dirs = [
        target / "manifest",
        target / "diagrams" / "plantuml",
        target / "diagrams" / "mermaid",
        target / "templates",
        target / "sphinx" / "architecture",
        target / "sphinx" / "diagrams",
        target / "sphinx" / "api",
        target / "sphinx" / "_static",
        target / "scripts",
        target / "tools",
        target / "output",
    ]

    # Crear directorios
    for d in dirs:
        if not d.exists():
            if not args.dry_run:
                d.mkdir(parents=True, exist_ok=True)
            print(f"   📁 {d.relative_to(target) if str(target) in str(d) else d}")
        else:
            print(f"   · (ya existe) {d.relative_to(target) if str(target) in str(d) else d}")

    print()

    # Generar archivos
    files_to_create = [
        (
            target / "manifest" / "manifest.json",
            json.dumps(generate_manifest(args.name, args.version, stack, args.type), ensure_ascii=False, indent=2),
        ),
        (
            target / "config.yaml",
            generate_config(args.name),
        ),
        (
            target / "diagrams" / "plantuml" / "01_arquitectura.puml",
            generate_starter_puml(args.name, args.type),
        ),
        (
            target / ".gitignore",
            ".venv-docs/\noutput/\n__pycache__/\n*.jar\n.DS_Store\nThumbs.db\n.env\n.env.*\n",
        ),
        (
            target / "requirements-docs.txt",
            (module_root / "requirements-docs.txt").read_text(encoding="utf-8") if (module_root / "requirements-docs.txt").exists() else "sphinx>=8.0\nfuro>=2024.1\npyyaml>=6.0\njsonschema>=4.20\njinja2>=3.1\n",
        ),
    ]

    for file_path, content in files_to_create:
        if file_path.exists():
            print(f"   · (ya existe) {file_path.name}")
        else:
            if not args.dry_run:
                file_path.write_text(content, encoding="utf-8")
            print(f"   ✅ {file_path.name}")

    # Copiar template de manifest.schema.json
    schema_src = module_root / "manifest" / "manifest.schema.json"
    schema_dst = target / "manifest" / "manifest.schema.json"
    if schema_src.exists() and not schema_dst.exists():
        if not args.dry_run:
            shutil.copy2(schema_src, schema_dst)
        print(f"   ✅ manifest.schema.json (copiado)")

    # Copiar scripts
    scripts_src = module_root / "scripts"
    scripts_dst = target / "scripts"
    if scripts_src.exists():
        for script in scripts_src.glob("*.py"):
            dst = scripts_dst / script.name
            if not dst.exists():
                if not args.dry_run:
                    shutil.copy2(script, dst)
                print(f"   ✅ scripts/{script.name}")

    # Copiar templates (HTML/CSS/JS)
    copy_templates_structure(module_root, target, args.dry_run)

    print()
    print("=" * 60)
    print(f"✅ Proyecto '{args.name}' inicializado")
    if not args.dry_run:
        print()
        print("Próximos pasos:")
        print(f"  1. Editar {target / 'manifest' / 'manifest.json'}")
        print(f"  2. Agregar diagramas en {target / 'diagrams' / 'plantuml'}/")
        print(f"  3. python scripts/generate.py --validate")
        print(f"  4. python scripts/generate.py --interactive")
    print("=" * 60)


if __name__ == "__main__":
    main()
