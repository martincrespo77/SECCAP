#!/usr/bin/env python3
"""
build_sphinx.py — Ejecutar la build de documentación Sphinx.

Genera HTML en output/sphinx/ desde las fuentes en sphinx/.

Uso:
    python scripts/build_sphinx.py
    python scripts/build_sphinx.py --clean

Requisitos:
    pip install sphinx furo sphinxcontrib-plantuml sphinxcontrib-mermaid
"""

import shutil
import subprocess
import sys
from pathlib import Path


def find_module_root() -> Path:
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Build Sphinx documentation.")
    parser.add_argument("--clean", action="store_true", help="Limpiar output antes de build.")
    args = parser.parse_args()

    module_root = find_module_root()
    sphinx_src = module_root / "sphinx"
    output_dir = module_root / "output" / "sphinx"

    # Verificar que sphinx-build está disponible
    sphinx_build = shutil.which("sphinx-build")
    if not sphinx_build:
        # Intentar via python -m sphinx
        try:
            result = subprocess.run(
                [sys.executable, "-m", "sphinx", "--version"],
                capture_output=True, text=True
            )
            if result.returncode == 0:
                sphinx_cmd = [sys.executable, "-m", "sphinx"]
            else:
                raise FileNotFoundError
        except FileNotFoundError:
            print("❌ sphinx-build no encontrado.")
            print("   Instalar con: pip install sphinx furo sphinxcontrib-plantuml sphinxcontrib-mermaid")
            sys.exit(1)
    else:
        sphinx_cmd = [sphinx_build]

    # Limpiar si se solicitó
    if args.clean and output_dir.exists():
        print(f"   Limpiando {output_dir}...")
        shutil.rmtree(output_dir)

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"   Fuente: {sphinx_src}")
    print(f"   Salida: {output_dir}")
    print()

    # Ejecutar sphinx-build
    cmd = sphinx_cmd + [
        "-b", "html",           # Builder: HTML
        "-a",                   # Regenerar todos los archivos
        "-E",                   # No usar caché de entorno
        "-W", "--keep-going",   # Warnings como errores, pero continuar
        "-q",                   # Modo silencioso
        str(sphinx_src),
        str(output_dir),
    ]

    result = subprocess.run(cmd, cwd=str(module_root))

    if result.returncode == 0:
        print(f"   ✅ Sphinx build completado: {output_dir / 'index.html'}")
    else:
        print(f"   ❌ Sphinx build falló (código {result.returncode})")
        print("   Revisar los errores arriba. Posibles causas:")
        print("   - Extensiones no instaladas (sphinxcontrib-plantuml, sphinxcontrib-mermaid)")
        print("   - Java o plantuml.jar no disponible para renderizar diagramas")
        print("   Tip: correr con --no-W para ignorar warnings: eliminar -W del comando")
        sys.exit(1)


if __name__ == "__main__":
    main()
