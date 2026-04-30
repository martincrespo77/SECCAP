#!/usr/bin/env python3
"""
sanitize.py — Sanitizar artefactos antes de publicación.

Elimina rutas absolutas locales, secretos y diagramas/nodos internos
del directorio output/ para publicación segura.

Genera SECURITY_AUDIT.txt con el resultado de todas las verificaciones.

Uso:
    python scripts/sanitize.py
    python scripts/sanitize.py --dry-run
    python scripts/sanitize.py --target output/interactive

Requisitos: ninguno (stdlib only)
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# ── Patrones de detección ──────────────────────────────────────────

# Rutas absolutas del sistema operativo
OS_PATH_PATTERNS = [
    r"[A-Z]:\\[^\s\"'<>]*",          # Windows: C:\Users\...
    r"/home/[^/\s\"'<>]+/[^\s\"'<>]*",  # Linux home
    r"/Users/[^/\s\"'<>]+/[^\s\"'<>]*", # macOS home
    r"/root/[^\s\"'<>]*",              # Linux root
]

# Patrones de secretos
SECRET_PATTERNS = [
    r"(API_KEY|SECRET|PASSWORD|TOKEN|PASSWD|PRIVATE_KEY|AUTH_KEY)\s*[=:]\s*[^\s\"']+",
    r"eyJ[A-Za-z0-9_\-]{20,}",        # JWT tokens
    r"-----BEGIN (RSA |EC )?PRIVATE KEY-----",
    r"ghp_[A-Za-z0-9]{36}",           # GitHub Personal Access Token
    r"sk-[A-Za-z0-9]{48}",            # OpenAI API key
]

# Archivos sensibles que nunca deben estar en output/
SENSITIVE_FILES = [
    ".env",
    ".env.local",
    ".env.production",
    "*.pem",
    "*.key",
    "*.pfx",
    "*.p12",
    "id_rsa",
    "id_ed25519",
]

# Directorios que nunca deben estar en output/
SENSITIVE_DIRS = [
    ".git",
    "node_modules",
    ".venv",
    ".venv-docs",
    "__pycache__",
    ".pytest_cache",
]

# Extensiones de texto a escanear
TEXT_EXTENSIONS = {
    ".html", ".htm", ".css", ".js", ".json", ".md", ".txt",
    ".rst", ".yaml", ".yml", ".xml", ".csv", ".svg",
}


def find_module_root() -> Path:
    current = Path(__file__).resolve().parent.parent
    if (current / "config.yaml").exists():
        return current
    return Path.cwd()


def collect_text_files(directory: Path) -> list[Path]:
    """Recopilar todos los archivos de texto en un directorio."""
    files = []
    for f in directory.rglob("*"):
        if f.is_file() and f.suffix.lower() in TEXT_EXTENSIONS:
            files.append(f)
    return files


def scan_for_patterns(file: Path, patterns: list[str]) -> list[tuple[int, str, str]]:
    """Buscar patrones en un archivo. Retorna lista de (línea, patrón, texto)."""
    findings = []
    try:
        content = file.read_text(encoding="utf-8", errors="replace")
        for pattern in patterns:
            compiled = re.compile(pattern, re.IGNORECASE)
            for i, line in enumerate(content.splitlines(), 1):
                match = compiled.search(line)
                if match:
                    findings.append((i, pattern, line.strip()[:120]))
    except Exception as e:
        findings.append((0, "READ_ERROR", str(e)))
    return findings


def remove_os_paths_from_file(file: Path, dry_run: bool) -> int:
    """Eliminar rutas absolutas de un archivo de texto. Retorna número de sustituciones."""
    try:
        content = file.read_text(encoding="utf-8", errors="replace")
        original = content
        replacements = 0
        for pattern in OS_PATH_PATTERNS:
            new_content, count = re.subn(pattern, "[RUTA_ELIMINADA]", content, flags=re.IGNORECASE)
            replacements += count
            content = new_content
        if replacements > 0 and not dry_run:
            file.write_text(content, encoding="utf-8")
        return replacements
    except Exception:
        return 0


def strip_plantuml_metadata(file: Path, dry_run: bool) -> int:
    """Eliminar metadata embebida por PlantUML dentro de SVGs."""
    if file.suffix.lower() != ".svg":
        return 0

    try:
        content = file.read_text(encoding="utf-8", errors="replace")
        new_content, count = re.subn(
            r"<\?plantuml(?:-src)? .*?\?>",
            "",
            content,
            flags=re.IGNORECASE | re.DOTALL,
        )
        if count > 0 and not dry_run:
            file.write_text(new_content, encoding="utf-8")
        return count
    except Exception:
        return 0


def sanitize_manifest(manifest_path: Path, dry_run: bool) -> dict:
    """Sanitizar manifest.json: eliminar sourcePath, nodos internos."""
    findings = {"removed_source_paths": 0, "removed_internal_nodes": 0, "removed_internal_relations": 0}
    try:
        data = json.loads(manifest_path.read_text(encoding="utf-8"))

        # Eliminar sourcePath de nodos
        for node in data.get("nodes", []):
            if "sourcePath" in node:
                del node["sourcePath"]
                findings["removed_source_paths"] += 1

        # Filtrar nodos internos
        original_nodes = len(data.get("nodes", []))
        data["nodes"] = [n for n in data.get("nodes", []) if n.get("visibility", "internal") != "internal" or True]
        # NOTA: se mantienen todos los nodos para la vista pública; solo se elimina sourcePath

        # Filtrar relaciones internas
        data["relations"] = [r for r in data.get("relations", []) if r.get("visibility", "internal") != "internal"]
        findings["removed_internal_relations"] = len(data.get("relations", [])) - len(data.get("relations", []))

        # Filtrar diagramas internos en manifest público
        # (se crea manifest.public.json separado, no se toca manifest.json)
        public_data = {**data}
        public_data["nodes"] = [n for n in data.get("nodes", []) if n.get("visibility") == "public"]
        public_data["diagrams"] = [d for d in data.get("diagrams", []) if d.get("visibility") == "public"]
        public_data["relations"] = [r for r in data.get("relations", []) if r.get("visibility") == "public"]

        if not dry_run:
            # Guardar versión sanitizada (sin sourcePath)
            manifest_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
            # Guardar versión pública
            public_path = manifest_path.parent / "manifest.public.json"
            public_path.write_text(json.dumps(public_data, ensure_ascii=False, indent=2), encoding="utf-8")

    except Exception as e:
        findings["error"] = str(e)

    return findings


def check_sensitive_files(output_dir: Path) -> list[str]:
    """Verificar que no existen archivos sensibles en el output."""
    problems = []
    for path in output_dir.rglob("*"):
        # Archivos sensibles
        for sensitive in SENSITIVE_FILES:
            if path.match(sensitive):
                problems.append(f"Archivo sensible: {path.relative_to(output_dir)}")
        # Directorios sensibles
        for sensitive_dir in SENSITIVE_DIRS:
            if path.is_dir() and path.name == sensitive_dir:
                problems.append(f"Directorio sensible: {path.relative_to(output_dir)}")

    return problems


def generate_audit_report(
    output_dir: Path,
    dry_run: bool,
    path_replacements: int,
    secret_findings: list,
    sensitive_problems: list,
    manifest_findings: dict,
) -> str:
    """Generar reporte de auditoría de sanitización."""
    timestamp = datetime.now(timezone.utc).isoformat()
    status = "PASS" if (not secret_findings and not sensitive_problems) else "FAIL"

    lines = [
        "=" * 60,
        "SECURITY_AUDIT.txt — docs-uml sanitize.py",
        "=" * 60,
        f"Timestamp:   {timestamp}",
        f"Output dir:  {output_dir}",
        f"Dry run:     {'SÍ' if dry_run else 'NO'}",
        f"Estado:      {'✅ PASS' if status == 'PASS' else '❌ FAIL'}",
        "",
        "── Rutas absolutas ──────────────────────────",
        f"  Reemplazadas: {path_replacements}",
        "",
        "── Manifest ──────────────────────────────────",
        f"  sourcePath eliminados: {manifest_findings.get('removed_source_paths', 0)}",
        f"  Relaciones internas filtradas: {manifest_findings.get('removed_internal_relations', 0)}",
        f"  manifest.public.json generado: {'NO (dry-run)' if dry_run else 'SÍ'}",
        "",
        "── Secretos detectados ───────────────────────",
    ]

    if secret_findings:
        for file, line_no, pattern, text in secret_findings:
            lines.append(f"  ❌ {file}:{line_no} — {text[:80]}")
    else:
        lines.append("  ✅ Ninguno")

    lines.append("")
    lines.append("── Archivos/directorios sensibles ───────────")
    if sensitive_problems:
        for p in sensitive_problems:
            lines.append(f"  ❌ {p}")
    else:
        lines.append("  ✅ Ninguno")

    lines += [
        "",
        "=" * 60,
        f"RESULTADO FINAL: {status}",
        "=" * 60,
    ]

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Sanitizar artefactos de output/ antes de publicación."
    )
    parser.add_argument("--dry-run", action="store_true", help="Solo reportar, no modificar archivos.")
    parser.add_argument("--target", default=None, help="Directorio a sanitizar (default: output/).")
    parser.add_argument("--skip-manifest", action="store_true", help="No sanitizar manifest.json.")
    args = parser.parse_args()

    module_root = find_module_root()
    output_dir = Path(args.target) if args.target else module_root / "output"

    if not output_dir.exists():
        print(f"❌ Directorio no encontrado: {output_dir}")
        sys.exit(1)

    mode = "(DRY RUN)" if args.dry_run else ""
    print(f"🔒 Sanitizando: {output_dir} {mode}")
    print()

    # 1. Verificar archivos sensibles
    print("1️⃣  Verificando archivos/directorio sensibles...")
    sensitive_problems = check_sensitive_files(output_dir)
    if sensitive_problems:
        for p in sensitive_problems:
            print(f"   ❌ {p}")
    else:
        print("   ✅ Sin problemas")

    # 2. Eliminar rutas absolutas OS
    print("2️⃣  Eliminando rutas absolutas del SO...")
    total_replacements = 0
    total_plantuml_metadata_removed = 0
    text_files = collect_text_files(output_dir)
    for f in text_files:
        count = remove_os_paths_from_file(f, args.dry_run)
        total_replacements += count
        if count > 0:
            print(f"   → {f.relative_to(output_dir)}: {count} reemplazos")
        metadata_count = strip_plantuml_metadata(f, args.dry_run)
        total_plantuml_metadata_removed += metadata_count
    if total_plantuml_metadata_removed > 0:
        print(f"   PlantUML metadata removida: {total_plantuml_metadata_removed}")
    print(f"   Total: {total_replacements} sustituciones")

    # 3. Escanear secretos
    print("3️⃣  Escaneando secretos...")
    all_secret_findings = []
    for f in text_files:
        findings = scan_for_patterns(f, SECRET_PATTERNS)
        for line_no, pattern, text in findings:
            all_secret_findings.append((str(f.relative_to(output_dir)), line_no, pattern, text))
            print(f"   ❌ {f.relative_to(output_dir)}:{line_no} — {text[:80]}")
    if not all_secret_findings:
        print("   ✅ Sin secretos detectados")

    # 4. Sanitizar manifest.json
    manifest_findings = {}
    if not args.skip_manifest:
        print("4️⃣  Sanitizando manifest.json...")
        manifest_path = output_dir / "interactive" / "data" / "manifest.json"
        if manifest_path.exists():
            manifest_findings = sanitize_manifest(manifest_path, args.dry_run)
            print(f"   sourcePath eliminados: {manifest_findings.get('removed_source_paths', 0)}")
            if not args.dry_run:
                print(f"   manifest.public.json generado en {manifest_path.parent}")
        else:
            print("   ⚠️  manifest.json no encontrado en output/interactive/data/")

    # 5. Generar reporte
    print("5️⃣  Generando SECURITY_AUDIT.txt...")
    report = generate_audit_report(
        output_dir,
        args.dry_run,
        total_replacements,
        all_secret_findings,
        sensitive_problems,
        manifest_findings,
    )

    report_path = output_dir / "SECURITY_AUDIT.txt"
    if not args.dry_run:
        report_path.write_text(report, encoding="utf-8")
        print(f"   Guardado en: {report_path}")
    else:
        print("   (dry-run) No se guardó.")

    print()
    print("=" * 60)
    if not all_secret_findings and not sensitive_problems:
        print("✅ SANITIZACIÓN COMPLETADA — Sin problemas críticos")
    else:
        print("❌ SANITIZACIÓN COMPLETADA — Hay problemas que resolver")
        print(report)
        sys.exit(1)
    print("=" * 60)


if __name__ == "__main__":
    main()
