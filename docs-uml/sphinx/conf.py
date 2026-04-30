# Configuration file for the Sphinx documentation builder.
# docs-uml — SECCAP Sphinx Documentation
#
# This file only contains a selection of the most common options.
# Refer to: https://www.sphinx-doc.org/en/master/usage/configuration.html

import os
import sys
from datetime import datetime
from pathlib import Path

# ── Path setup ─────────────────────────────────────────────────────
# The sphinx/ directory is the source; output goes to output/sphinx/
# No project source code is imported.

# ── Project information ────────────────────────────────────────────
project = "SECCAP — Documentación Técnica"
author = "Equipo SECCAP"
copyright = f"{datetime.now().year}, {author}"
release = "0.1.0"
version = "0.1"

# ── General configuration ──────────────────────────────────────────
extensions = [
    "sphinxcontrib.plantuml",   # Embeber diagramas PlantUML
    "sphinxcontrib.mermaid",    # Embeber diagramas Mermaid
]

# Idioma
language = "es"

# Suffixes
source_suffix = ".rst"
master_doc = "index"

# Excluir patrones
exclude_patterns = [
    "_build",
    "Thumbs.db",
    ".DS_Store",
    "**/.venv-docs/**",
    "**/node_modules/**",
]

# Evitar warnings de documentos huérfanos
suppress_warnings = ["toc.secnum"]

# ── PlantUML ───────────────────────────────────────────────────────
# Intentar ubicar plantuml.jar relativo a sphinx/
_module_root = Path(__file__).resolve().parent.parent
_plantuml_jar = _module_root / "tools" / "plantuml.jar"
_java_bin = _module_root / "tools" / "jre" / "bin" / ("java.exe" if os.name == "nt" else "java")

if _plantuml_jar.exists():
    java_cmd = f'"{_java_bin}"' if _java_bin.exists() else "java"
    plantuml = f"{java_cmd} -jar \"{_plantuml_jar}\""
else:
    # Fallback: usar servidor local o variable de entorno
    plantuml = os.environ.get("PLANTUML_JAR_CMD", "plantuml")

plantuml_output_format = "svg"
plantuml_latex_output_format = "png"

# ── HTML output ────────────────────────────────────────────────────
html_theme = "furo"  # pip install furo

html_title = "SECCAP — Documentación Técnica"

html_theme_options = {
    "sidebar_hide_name": False,
    "navigation_with_keys": True,
    "dark_css_variables": {
        "color-brand-primary": "#3b82f6",
        "color-brand-content": "#60a5fa",
        "color-admonition-background": "#1a1f36",
    },
    "light_css_variables": {
        "color-brand-primary": "#1d4ed8",
        "color-brand-content": "#2563eb",
    },
}

# Archivos estáticos de Sphinx
html_static_path = ["_static"]

# Custom CSS para integrar con el diseño del módulo
html_css_files = ["custom.css"]

# ── Favicons / logo ────────────────────────────────────────────────
# html_logo = "_static/logo.png"  # Descommentar si existe

# ── LaTeX output (opcional) ────────────────────────────────────────
latex_elements = {
    "papersize": "a4paper",
    "pointsize": "11pt",
}

# ── Intersphinx mapping ────────────────────────────────────────────
# Desactivado por defecto; activar si se enlaza a otra doc Sphinx
intersphinx_mapping = {}
