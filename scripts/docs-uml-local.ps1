# docs-uml-local.ps1
# Genera toda la documentación docs-uml usando el entorno aislado del módulo
# y crea un índice Markdown para ver los SVG desde el editor sin navegador.
#
# Uso:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/docs-uml-local.ps1
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/docs-uml-local.ps1 -Serve
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/docs-uml-local.ps1 -Serve -OpenBrowser

[CmdletBinding()]
param(
    [switch]$Serve,
    [switch]$OpenBrowser
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$docsRoot = Join-Path $repoRoot 'docs-uml'
$venvPython = Join-Path $docsRoot '.venv-docs\Scripts\python.exe'
$generateScript = Join-Path $docsRoot 'scripts\generate.py'
$outputRoot = Join-Path $docsRoot 'output'
$previewPath = Join-Path $outputRoot 'PREVIEW.md'
$manifestPath = Join-Path $docsRoot 'manifest\manifest.json'

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
    Write-Host (" {0}" -f $Title) -ForegroundColor Cyan
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
}

function Assert-Path {
    param(
        [string]$PathValue,
        [string]$Label
    )

    if (-not (Test-Path $PathValue)) {
        throw ("No existe {0}: {1}" -f $Label, $PathValue)
    }
}

function New-PreviewMarkdown {
    param(
        [string]$ManifestFile,
        [string]$OutputDir,
        [string]$TargetFile
    )

    $manifest = Get-Content -Path $ManifestFile -Encoding UTF8 | ConvertFrom-Json
    $diagramsDir = Join-Path $OutputDir 'diagrams'
    Assert-Path -PathValue $diagramsDir -Label 'el directorio output/diagrams'

    $lines = New-Object System.Collections.Generic.List[string]
    $generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    $lines.Add('# docs-uml - Vista local') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add("Generado: $generatedAt") | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('Este archivo sirve para ver los diagramas desde el editor con preview Markdown, sin abrir la vista web.') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('## Artefactos generados') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('- Vista interactiva HTML: `interactive/index.html`') | Out-Null
    $lines.Add('- Documentación Sphinx HTML: `sphinx/index.html`') | Out-Null
    $lines.Add('- Diagramas SVG: `diagrams/*.svg`') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('## Qué se puede ver sin navegador') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('- Este `PREVIEW.md` en el editor.') | Out-Null
    $lines.Add('- Cada `*.svg` individual desde el explorador de archivos.') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('## Qué no se ve bien sin HTML/WebView') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('- `interactive/index.html`: requiere JavaScript y `fetch()` local.') | Out-Null
    $lines.Add('- `sphinx/index.html`: sigue siendo documentación HTML estática.') | Out-Null
    $lines.Add('') | Out-Null
    $lines.Add('## Diagramas') | Out-Null
    $lines.Add('') | Out-Null

    $diagrams = @($manifest.diagrams | Sort-Object @{ Expression = { if ($null -ne $_.order) { [int]$_.order } else { 999 } } }, id)
    foreach ($diagram in $diagrams) {
        $sourceName = [System.IO.Path]::GetFileNameWithoutExtension([string]$diagram.source)
        $svgName = "$sourceName.svg"
        $svgPath = Join-Path $diagramsDir $svgName
        if (-not (Test-Path $svgPath)) {
            continue
        }

        $title = [string]$diagram.title
        $type = [string]$diagram.type
        $desc = [string]$diagram.description

        $lines.Add("### $title") | Out-Null
        $lines.Add('') | Out-Null
        if ($type) {
            $lines.Add(('- Tipo: `{0}`' -f $type)) | Out-Null
        }
        if ($desc) {
            $lines.Add(('- Descripción: {0}' -f $desc)) | Out-Null
        }
        $lines.Add(('- Archivo: `diagrams/{0}`' -f $svgName)) | Out-Null
        $lines.Add('') | Out-Null
        $lines.Add("![${title}](./diagrams/$svgName)") | Out-Null
        $lines.Add('') | Out-Null
    }

    [System.IO.File]::WriteAllLines($TargetFile, $lines, [System.Text.UTF8Encoding]::new($false))
}

Assert-Path -PathValue $docsRoot -Label 'la carpeta docs-uml'
Assert-Path -PathValue $venvPython -Label 'el Python del entorno docs-uml/.venv-docs'
Assert-Path -PathValue $generateScript -Label 'el script docs-uml/scripts/generate.py'
Assert-Path -PathValue $manifestPath -Label 'el manifest.json de docs-uml'

Write-Section 'docs-uml - generate.py --all'
Write-Host ("Python: {0}" -f $venvPython) -ForegroundColor DarkGray
Write-Host ("Script: {0}" -f $generateScript) -ForegroundColor DarkGray

Push-Location $repoRoot
try {
    & $venvPython $generateScript --all
    $exit = $LASTEXITCODE
} finally {
    Pop-Location
}

if ($exit -ne 0) {
    throw "docs-uml generate.py --all falló con exit code $exit"
}

Write-Section 'docs-uml - PREVIEW.md'
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
New-PreviewMarkdown -ManifestFile $manifestPath -OutputDir $outputRoot -TargetFile $previewPath
Write-Host ("Preview generado: {0}" -f $previewPath) -ForegroundColor Green

if ($Serve) {
    Write-Section 'docs-uml - servidor local'

    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $port = ($listener.LocalEndpoint).Port
    $listener.Stop()

    $stdoutLog = Join-Path $env:TEMP ("docs-uml-http-{0}.out.log" -f $port)
    $stderrLog = Join-Path $env:TEMP ("docs-uml-http-{0}.err.log" -f $port)

    $proc = Start-Process `
        -FilePath $venvPython `
        -ArgumentList "-m http.server $port --bind 127.0.0.1" `
        -WorkingDirectory $outputRoot `
        -RedirectStandardOutput $stdoutLog `
        -RedirectStandardError $stderrLog `
        -PassThru

    Start-Sleep -Seconds 1

    $interactiveUrl = "http://127.0.0.1:$port/interactive/"
    $sphinxUrl = "http://127.0.0.1:$port/sphinx/index.html"

    Write-Host ("PID servidor: {0}" -f $proc.Id) -ForegroundColor Green
    Write-Host ("Interactive:  {0}" -f $interactiveUrl) -ForegroundColor Green
    Write-Host ("Sphinx:       {0}" -f $sphinxUrl) -ForegroundColor Green
    Write-Host ("Stop:         Stop-Process -Id {0}" -f $proc.Id) -ForegroundColor DarkYellow

    if ($OpenBrowser) {
        Start-Process $interactiveUrl
    }
}

Write-Section 'Resumen'
Write-Host 'Listo.' -ForegroundColor Green
Write-Host ("- Abrí docs-uml/output/PREVIEW.md en Antigravity para ver los SVG sin navegador.") -ForegroundColor Green
Write-Host ("- Si querés la vista interactiva real, corré este mismo script con -Serve.") -ForegroundColor Green
