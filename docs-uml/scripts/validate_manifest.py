#!/usr/bin/env python3
"""
validate_manifest.py — Valida manifest.json contra manifest.schema.json.

Uso:
    python scripts/validate_manifest.py
    python scripts/validate_manifest.py --manifest manifest/manifest.json --schema manifest/manifest.schema.json

Requisitos:
    pip install jsonschema
"""

import argparse
import json
import sys
from pathlib import Path

try:
    from jsonschema import validate, ValidationError, SchemaError
except ImportError:
    print("ERROR: jsonschema no está instalado.")
    print("Ejecutar: pip install jsonschema")
    sys.exit(1)


def find_module_root() -> Path:
    """Buscar la raíz del módulo docs-uml (donde está config.yaml)."""
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    # Fallback: directorio actual
    return Path.cwd()


def load_json(path: Path) -> dict:
    """Cargar un archivo JSON con manejo de errores claro."""
    if not path.exists():
        print(f"ERROR: No se encontró el archivo: {path}")
        sys.exit(1)
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: JSON inválido en {path}: {e}")
        sys.exit(1)


def validate_referential_integrity(manifest: dict) -> list[str]:
    """Validar integridad referencial más allá del JSON Schema."""
    errors = []

    # Recopilar IDs válidos
    layer_ids = {layer["id"] for layer in manifest.get("layers", [])}
    node_ids = {node["id"] for node in manifest.get("nodes", [])}
    diagram_ids = {diagram["id"] for diagram in manifest.get("diagrams", [])}

    # Validar que cada nodo referencia una capa existente
    for node in manifest.get("nodes", []):
        if node["layer"] not in layer_ids:
            errors.append(
                f"Nodo '{node['id']}' referencia capa inexistente: '{node['layer']}'"
            )
        # Validar diagramas referenciados
        for diag_id in node.get("diagrams", []):
            if diag_id not in diagram_ids:
                errors.append(
                    f"Nodo '{node['id']}' referencia diagrama inexistente: '{diag_id}'"
                )

    # Validar que cada relación referencia nodos existentes
    for i, rel in enumerate(manifest.get("relations", [])):
        if rel["from"] not in node_ids:
            errors.append(
                f"Relación #{i+1} ({rel['from']} → {rel['to']}): nodo origen '{rel['from']}' no existe"
            )
        if rel["to"] not in node_ids:
            errors.append(
                f"Relación #{i+1} ({rel['from']} → {rel['to']}): nodo destino '{rel['to']}' no existe"
            )

    # Validar que cada diagrama referencia nodos existentes
    for diagram in manifest.get("diagrams", []):
        for node_id in diagram.get("relatedNodes", []):
            if node_id not in node_ids:
                errors.append(
                    f"Diagrama '{diagram['id']}' referencia nodo inexistente: '{node_id}'"
                )

    # Validar que no haya IDs duplicados
    all_layer_ids = [layer["id"] for layer in manifest.get("layers", [])]
    all_node_ids = [node["id"] for node in manifest.get("nodes", [])]
    all_diagram_ids = [diagram["id"] for diagram in manifest.get("diagrams", [])]

    for id_list, category in [
        (all_layer_ids, "capa"),
        (all_node_ids, "nodo"),
        (all_diagram_ids, "diagrama"),
    ]:
        seen = set()
        for item_id in id_list:
            if item_id in seen:
                errors.append(f"ID duplicado en {category}: '{item_id}'")
            seen.add(item_id)

    return errors


def validate_diagram_sources(manifest: dict, module_root: Path) -> list[str]:
    """Validar que los archivos fuente de diagramas existen."""
    warnings = []
    for diagram in manifest.get("diagrams", []):
        source_path = module_root / diagram["source"]
        if not source_path.exists():
            warnings.append(
                f"Diagrama '{diagram['id']}': archivo fuente no encontrado: {diagram['source']}"
            )
    return warnings


def main():
    parser = argparse.ArgumentParser(
        description="Validar manifest.json contra su JSON Schema y verificar integridad referencial."
    )
    parser.add_argument(
        "--manifest",
        default=None,
        help="Ruta al archivo manifest.json (por defecto: manifest/manifest.json)",
    )
    parser.add_argument(
        "--schema",
        default=None,
        help="Ruta al archivo manifest.schema.json (por defecto: manifest/manifest.schema.json)",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Tratar warnings como errores.",
    )
    args = parser.parse_args()

    module_root = find_module_root()

    manifest_path = Path(args.manifest) if args.manifest else module_root / "manifest" / "manifest.json"
    schema_path = Path(args.schema) if args.schema else module_root / "manifest" / "manifest.schema.json"

    print(f"📄 Manifiesto: {manifest_path}")
    print(f"📐 Schema:     {schema_path}")
    print()

    schema = load_json(schema_path)
    manifest = load_json(manifest_path)

    # 1. Validar contra JSON Schema
    print("1️⃣  Validando contra JSON Schema...")
    try:
        validate(instance=manifest, schema=schema)
        print("   ✅ JSON Schema: válido")
    except SchemaError as e:
        print(f"   ❌ Error en el schema: {e.message}")
        sys.exit(1)
    except ValidationError as e:
        print(f"   ❌ Error de validación: {e.message}")
        print(f"      Ruta: {' → '.join(str(p) for p in e.absolute_path)}")
        sys.exit(1)

    # 2. Validar integridad referencial
    print("2️⃣  Validando integridad referencial...")
    ref_errors = validate_referential_integrity(manifest)
    if ref_errors:
        for err in ref_errors:
            print(f"   ❌ {err}")
        sys.exit(1)
    else:
        print("   ✅ Integridad referencial: válida")

    # 3. Validar existencia de archivos fuente
    print("3️⃣  Validando archivos fuente de diagramas...")
    source_warnings = validate_diagram_sources(manifest, module_root)
    if source_warnings:
        for warn in source_warnings:
            print(f"   ⚠️  {warn}")
        if args.strict:
            print("   ❌ Modo estricto: warnings tratados como errores")
            sys.exit(1)
    else:
        print("   ✅ Todos los archivos fuente existen")

    # Resumen
    project = manifest.get("project", {})
    print()
    print("=" * 60)
    print(f"✅ Manifiesto válido para: {project.get('name', 'N/A')} v{project.get('version', 'N/A')}")
    print(f"   Capas:      {len(manifest.get('layers', []))}")
    print(f"   Nodos:      {len(manifest.get('nodes', []))}")
    print(f"   Relaciones: {len(manifest.get('relations', []))}")
    print(f"   Diagramas:  {len(manifest.get('diagrams', []))}")
    print("=" * 60)


if __name__ == "__main__":
    main()
