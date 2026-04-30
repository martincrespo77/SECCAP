#!/usr/bin/env python3
"""
generate.py — CLI principal para generación de documentación.

Uso:
    python scripts/generate.py --all
    python scripts/generate.py --diagrams
    python scripts/generate.py --interactive
    python scripts/generate.py --sphinx
    python scripts/generate.py --validate

Requiere: entorno .venv-docs activo con requirements-docs.txt instalado.
"""

import argparse
import importlib.util
import os
import subprocess
import sys
from pathlib import Path


def configure_console_output() -> None:
    """Evitar fallos por Unicode en consolas Windows no UTF-8."""
    for stream_name in ("stdout", "stderr"):
        stream = getattr(sys, stream_name, None)
        if stream and hasattr(stream, "reconfigure"):
            try:
                stream.reconfigure(encoding="utf-8", errors="replace")
            except Exception:
                pass


def find_module_root() -> Path:
    """Buscar la raíz del módulo docs-uml."""
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def run_script(script_name: str, module_root: Path, extra_args: list[str] | None = None) -> bool:
    """Ejecutar otro script Python del módulo."""
    script_path = module_root / "scripts" / script_name
    if not script_path.exists():
        print(f"   ⚠️  Script no encontrado: {script_path}")
        return False

    cmd = [sys.executable, str(script_path)] + (extra_args or [])
    env = os.environ.copy()
    env.setdefault("PYTHONIOENCODING", "utf-8")
    result = subprocess.run(cmd, cwd=str(module_root), env=env)
    return result.returncode == 0


def step_validate(module_root: Path) -> bool:
    """Paso 1: Validar manifiesto."""
    print("=" * 60)
    print("  PASO 1: Validar manifiesto")
    print("=" * 60)
    return run_script("validate_manifest.py", module_root)


def step_diagrams(module_root: Path) -> bool:
    """Paso 2: Renderizar diagramas PlantUML."""
    print()
    print("=" * 60)
    print("  PASO 2: Renderizar diagramas PlantUML")
    print("=" * 60)
    return run_script("render_plantuml.py", module_root)


def step_interactive(module_root: Path) -> bool:
    """Paso 3: Ensamblar vista interactiva."""
    print()
    print("=" * 60)
    print("  PASO 3: Ensamblar vista interactiva")
    print("=" * 60)
    script_path = module_root / "scripts" / "build_interactive.py"
    if not script_path.exists():
        print("   ⚠️  build_interactive.py no implementado aún (Fase 2)")
        return True  # No bloquear
    return run_script("build_interactive.py", module_root)


def step_sphinx(module_root: Path) -> bool:
    """Paso 4: Build de Sphinx."""
    print()
    print("=" * 60)
    print("  PASO 4: Build de documentación Sphinx")
    print("=" * 60)
    script_path = module_root / "scripts" / "build_sphinx.py"
    if not script_path.exists():
        print("   ⚠️  build_sphinx.py no implementado aún (Fase 3)")
        return True  # No bloquear
    return run_script("build_sphinx.py", module_root)


def step_sanitize(module_root: Path) -> bool:
    """Paso 5: Sanitizar output."""
    print()
    print("=" * 60)
    print("  PASO 5: Sanitizar artefactos")
    print("=" * 60)
    script_path = module_root / "scripts" / "sanitize.py"
    if not script_path.exists():
        print("   ⚠️  sanitize.py no implementado aún (Fase 4)")
        return True  # No bloquear
    return run_script("sanitize.py", module_root)


def main():
    configure_console_output()
    parser = argparse.ArgumentParser(
        description="CLI principal de generación de documentación docs-uml.",
        epilog="Ejecutar dentro del entorno .venv-docs.",
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="Ejecutar todos los pasos")
    group.add_argument("--validate", action="store_true", help="Solo validar manifiesto")
    group.add_argument("--diagrams", action="store_true", help="Solo renderizar diagramas")
    group.add_argument("--interactive", action="store_true", help="Solo ensamblar vista interactiva")
    group.add_argument("--sphinx", action="store_true", help="Solo build Sphinx")
    group.add_argument("--sanitize", action="store_true", help="Solo sanitizar output")

    args = parser.parse_args()
    module_root = find_module_root()

    print()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║          docs-uml — Generación de documentación         ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print(f"   Raíz del módulo: {module_root}")
    print()

    results: dict[str, bool] = {}

    if args.all or args.validate:
        results["Validación"] = step_validate(module_root)
        if not results["Validación"] and args.all:
            print("\n❌ Validación fallida. Deteniendo generación.")
            sys.exit(1)

    if args.all or args.diagrams:
        results["Diagramas"] = step_diagrams(module_root)

    if args.all or args.interactive:
        results["Vista interactiva"] = step_interactive(module_root)

    if args.all or args.sphinx:
        results["Sphinx"] = step_sphinx(module_root)

    if args.all or args.sanitize:
        results["Sanitización"] = step_sanitize(module_root)

    # Resumen
    print()
    print("╔══════════════════════════════════════════════════════════╗")
    print("║                      RESUMEN                            ║")
    print("╠══════════════════════════════════════════════════════════╣")
    all_ok = True
    for step, ok in results.items():
        status = "✅" if ok else "❌"
        print(f"║  {status} {step:<50}  ║")
        if not ok:
            all_ok = False
    print("╚══════════════════════════════════════════════════════════╝")

    if all_ok:
        print("\n✅ Generación completada exitosamente.")
        output_dir = module_root / "output"
        if (output_dir / "interactive" / "index.html").exists():
            print(f"   Vista interactiva: {output_dir / 'interactive' / 'index.html'}")
        if (output_dir / "sphinx" / "index.html").exists():
            print(f"   Documentación:     {output_dir / 'sphinx' / 'index.html'}")
        diagrams_count = len(list((output_dir / "diagrams").glob("*.svg"))) + len(
            list((output_dir / "diagrams").glob("*.png"))
        )
        if diagrams_count > 0:
            print(f"   Diagramas:         {diagrams_count} archivos en {output_dir / 'diagrams'}")
    else:
        print("\n❌ Algunos pasos fallaron. Revisar errores arriba.")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
