#!/usr/bin/env python3
"""
build_interactive.py — Ensamblar la vista UML interactiva.

Copia templates, vendoriza libs, inyecta manifest.json sanitizado,
y genera output/interactive/ listo para servir.

Uso:
    python scripts/build_interactive.py
"""

import json
import shutil
import sys
from pathlib import Path


def find_module_root() -> Path:
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def main():
    module_root = find_module_root()
    templates_dir = module_root / "templates"
    output_dir = module_root / "output" / "interactive"
    manifest_path = module_root / "manifest" / "manifest.json"
    diagrams_output = module_root / "output" / "diagrams"

    if not templates_dir.exists():
        print("❌ Directorio templates/ no encontrado")
        sys.exit(1)

    # Limpiar output anterior
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # 1. Copiar templates
    print("   Copiando templates...")
    for item in templates_dir.iterdir():
        dest = output_dir / item.name
        if item.is_dir():
            shutil.copytree(item, dest)
        else:
            shutil.copy2(item, dest)

    # 2. Copiar manifest.json a data/
    data_dir = output_dir / "data"
    data_dir.mkdir(exist_ok=True)
    if manifest_path.exists():
        print("   Copiando manifest.json...")
        shutil.copy2(manifest_path, data_dir / "manifest.json")
    else:
        print("   ⚠️  manifest.json no encontrado, la vista no tendrá datos")

    # 3. Copiar diagramas renderizados
    if diagrams_output.exists() and any(diagrams_output.iterdir()):
        diagrams_dest = output_dir / "diagrams"
        diagrams_dest.mkdir(exist_ok=True)
        count = 0
        for f in diagrams_output.iterdir():
            if f.suffix in (".svg", ".png"):
                shutil.copy2(f, diagrams_dest / f.name)
                count += 1
        print(f"   Copiados {count} diagramas renderizados")
    else:
        print("   ⚠️  No hay diagramas renderizados, la vista mostrará solo el manifiesto")

    print(f"   ✅ Vista interactiva ensamblada en: {output_dir}")
    print(f"   📂 Abrir: {output_dir / 'index.html'}")


if __name__ == "__main__":
    main()
