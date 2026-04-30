#!/usr/bin/env python3
"""
render_plantuml.py — Renderizar archivos .puml a SVG o PNG.

Uso:
    python scripts/render_plantuml.py
    python scripts/render_plantuml.py --format png
    python scripts/render_plantuml.py --input diagrams/plantuml/03_secuencia_login.puml

Requisitos:
    - Java JRE/JDK instalado (para plantuml.jar)
    - plantuml.jar en tools/plantuml.jar (o especificar ruta)
"""

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None


def find_module_root() -> Path:
    """Buscar la raíz del módulo docs-uml."""
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def load_config(module_root: Path) -> dict:
    """Cargar config.yaml si pyyaml está disponible."""
    config_path = module_root / "config.yaml"
    if yaml and config_path.exists():
        with open(config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {}


def find_java(module_root: Path) -> str | None:
    """Buscar ejecutable de Java."""
    local_java = module_root / "tools" / "jre" / "bin" / "java.exe"
    if local_java.exists():
        return str(local_java)
    local_java = module_root / "tools" / "jre" / "bin" / "java"
    if local_java.exists():
        return str(local_java)

    java = shutil.which("java")
    if java:
        return java
    # Buscar en JAVA_HOME
    java_home = os.environ.get("JAVA_HOME")
    if java_home:
        java_bin = Path(java_home) / "bin" / "java"
        if java_bin.exists():
            return str(java_bin)
        java_bin_exe = Path(java_home) / "bin" / "java.exe"
        if java_bin_exe.exists():
            return str(java_bin_exe)
    return None


def find_plantuml_jar(module_root: Path, config: dict) -> Path | None:
    """Buscar plantuml.jar en las ubicaciones esperadas."""
    # 1. Desde config.yaml
    config_jar = (
        config.get("generation", {}).get("plantuml", {}).get("jar_path", "")
    )
    if config_jar:
        jar_path = module_root / config_jar
        if jar_path.exists():
            return jar_path

    # 2. En tools/
    tools_jar = module_root / "tools" / "plantuml.jar"
    if tools_jar.exists():
        return tools_jar

    # 3. En PLANTUML_JAR env
    env_jar = os.environ.get("PLANTUML_JAR")
    if env_jar and Path(env_jar).exists():
        return Path(env_jar)

    return None


def render_file(
    java: str, jar: Path, puml_file: Path, output_dir: Path, fmt: str
) -> bool:
    """Renderizar un archivo .puml individual."""
    output_dir.mkdir(parents=True, exist_ok=True)

    cmd = [
        java,
        "-jar",
        str(jar),
        f"-t{fmt}",
        "-charset",
        "UTF-8",
        "-o",
        str(output_dir.resolve()),
        str(puml_file.resolve()),
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode == 0:
            output_name = puml_file.stem + f".{fmt}"
            print(f"   ✅ {puml_file.name} → {output_name}")
            return True
        else:
            print(f"   ❌ {puml_file.name}: {result.stderr.strip()}")
            return False
    except subprocess.TimeoutExpired:
        print(f"   ❌ {puml_file.name}: timeout (>60s)")
        return False
    except FileNotFoundError:
        print(f"   ❌ Error ejecutando Java o PlantUML")
        return False


def render_all(
    java: str,
    jar: Path,
    input_dir: Path,
    output_dir: Path,
    fmt: str,
) -> tuple[int, int]:
    """Renderizar todos los .puml de un directorio."""
    puml_files = sorted(input_dir.glob("*.puml"))
    if not puml_files:
        print(f"   ⚠️  No se encontraron archivos .puml en {input_dir}")
        return 0, 0

    ok = 0
    fail = 0
    for puml in puml_files:
        if render_file(java, jar, puml, output_dir, fmt):
            ok += 1
        else:
            fail += 1

    return ok, fail


def main():
    parser = argparse.ArgumentParser(
        description="Renderizar archivos PlantUML (.puml) a SVG o PNG."
    )
    parser.add_argument(
        "--input",
        default=None,
        help="Archivo .puml individual a renderizar. Si no se especifica, renderiza todos.",
    )
    parser.add_argument(
        "--format",
        default=None,
        choices=["svg", "png"],
        help="Formato de salida (por defecto: según config.yaml o 'svg').",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Directorio de salida (por defecto: output/diagrams/).",
    )
    parser.add_argument(
        "--jar",
        default=None,
        help="Ruta al plantuml.jar.",
    )
    args = parser.parse_args()

    module_root = find_module_root()
    config = load_config(module_root)

    # Determinar formato
    fmt = args.format or config.get("generation", {}).get("plantuml", {}).get(
        "output_format", "svg"
    )

    # Buscar Java
    java = find_java(module_root)
    if not java:
        print("❌ Java no encontrado. PlantUML requiere Java para renderizar.")
        print("   Instalar Java JRE/JDK o configurar JAVA_HOME.")
        print()
        print("   Alternativas:")
        print("   - Instalar Java: https://adoptium.net/")
        print("   - Usar Docker: docker run --rm -v $(pwd):/data plantuml/plantuml ...")
        print("   - Usar servidor PlantUML online (no recomendado para diagramas sensibles)")
        sys.exit(1)

    # Buscar PlantUML JAR
    jar_override = Path(args.jar) if args.jar else None
    jar = jar_override or find_plantuml_jar(module_root, config)
    if not jar:
        print("❌ plantuml.jar no encontrado.")
        print(f"   Ubicaciones buscadas:")
        print(f"   - {module_root / 'tools' / 'plantuml.jar'}")
        print(f"   - Variable PLANTUML_JAR")
        print(f"   - Configuración en config.yaml")
        print()
        print("   Descargar desde: https://plantuml.com/download")
        print(f"   Guardar en: {module_root / 'tools' / 'plantuml.jar'}")
        sys.exit(1)

    print(f"☕ Java:     {java}")
    print(f"📦 PlantUML: {jar}")
    print(f"🎨 Formato:  {fmt}")
    print()

    if args.input:
        # Renderizar un archivo individual
        puml_file = Path(args.input)
        if not puml_file.exists():
            print(f"❌ Archivo no encontrado: {puml_file}")
            sys.exit(1)
        output_dir = Path(args.output) if args.output else module_root / "output" / "diagrams"
        print(f"📂 Renderizando archivo individual:")
        success = render_file(java, jar, puml_file, output_dir, fmt)
        sys.exit(0 if success else 1)
    else:
        # Renderizar todos los .puml
        input_dir = module_root / config.get("paths", {}).get(
            "diagrams_plantuml", "diagrams/plantuml"
        )
        output_dir = Path(args.output) if args.output else module_root / "output" / "diagrams"

        print(f"📂 Entrada:  {input_dir}")
        print(f"📂 Salida:   {output_dir}")
        print()

        ok, fail = render_all(java, jar, input_dir, output_dir, fmt)

        print()
        print("=" * 50)
        print(f"Resultado: {ok} exitosos, {fail} fallidos")
        print("=" * 50)

        sys.exit(0 if fail == 0 else 1)


if __name__ == "__main__":
    main()
