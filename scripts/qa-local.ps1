# qa-local.ps1
# Ejecuta el QA completo del proyecto SECCAP (backend + frontend) localmente.
# Falla con exit code != 0 si cualquiera de los pasos rompe.
#
# Prerrequisitos minimos para el QA completo:
#   - Node 20+ y npm disponibles en PATH.
#   - Backend: PostgreSQL (contenedor seccap-pg) y mock-api corriendo,
#     porque los tests de integracion (auth / consulta / detalle / auditoria)
#     realmente consultan BD y mock upstream. Los smoke y contracts son
#     in-process y no requieren servicios.
#   - Frontend: solo Node (los tests corren en proceso con jsdom).
#
# Uso:
#   powershell -File scripts/qa-local.ps1
#   powershell -File scripts/qa-local.ps1 -SkipBackend
#   powershell -File scripts/qa-local.ps1 -SkipFrontend

[CmdletBinding()]
param(
    [switch]$SkipBackend,
    [switch]$SkipFrontend
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$backendPath  = Join-Path $repoRoot 'SECCAP/backend'
$frontendPath = Join-Path $repoRoot 'SECCAP/frontend'

$failures = New-Object System.Collections.Generic.List[string]

function Write-Section {
    param([string]$Title)
    Write-Host ''
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
    Write-Host (" {0}" -f $Title) -ForegroundColor Cyan
    Write-Host ('=' * 72) -ForegroundColor DarkCyan
}

function Invoke-Step {
    param(
        [string]$Label,
        [string]$WorkingDir,
        [string]$Command
    )

    Write-Host ''
    Write-Host (">>> {0}" -f $Label) -ForegroundColor Yellow
    Write-Host ("    cwd: {0}" -f $WorkingDir) -ForegroundColor DarkGray
    Write-Host ("    cmd: {0}" -f $Command) -ForegroundColor DarkGray

    Push-Location $WorkingDir
    try {
        & cmd.exe /c $Command
        $exit = $LASTEXITCODE
    } finally {
        Pop-Location
    }

    if ($exit -ne 0) {
        $failures.Add(("[FAIL] {0} (exit={1})" -f $Label, $exit)) | Out-Null
        Write-Host ("[FAIL] {0} (exit={1})" -f $Label, $exit) -ForegroundColor Red
    } else {
        Write-Host ("[OK]   {0}" -f $Label) -ForegroundColor Green
    }
}

if (-not $SkipBackend) {
    Write-Section 'Backend - QA'
    if (-not (Test-Path $backendPath)) {
        throw "No existe la carpeta backend: $backendPath"
    }

    Invoke-Step -Label 'backend :: lint'          -WorkingDir $backendPath -Command 'npm.cmd run lint'
    Invoke-Step -Label 'backend :: type-check'    -WorkingDir $backendPath -Command 'npm.cmd run type-check'
    Invoke-Step -Label 'backend :: prisma validate' -WorkingDir $backendPath -Command 'npx.cmd prisma validate'
    Invoke-Step -Label 'backend :: test'          -WorkingDir $backendPath -Command 'npm.cmd test'
} else {
    Write-Host 'Backend QA saltado (-SkipBackend).' -ForegroundColor DarkYellow
}

if (-not $SkipFrontend) {
    Write-Section 'Frontend - QA'
    if (-not (Test-Path $frontendPath)) {
        throw "No existe la carpeta frontend: $frontendPath"
    }

    Invoke-Step -Label 'frontend :: lint'       -WorkingDir $frontendPath -Command 'npm.cmd run lint'
    Invoke-Step -Label 'frontend :: type-check' -WorkingDir $frontendPath -Command 'npm.cmd run type-check'
    Invoke-Step -Label 'frontend :: test'       -WorkingDir $frontendPath -Command 'npm.cmd test'
    Invoke-Step -Label 'frontend :: build'      -WorkingDir $frontendPath -Command 'npm.cmd run build'
} else {
    Write-Host 'Frontend QA saltado (-SkipFrontend).' -ForegroundColor DarkYellow
}

Write-Section 'Resumen'
if ($failures.Count -eq 0) {
    Write-Host 'QA completo OK.' -ForegroundColor Green
    exit 0
} else {
    Write-Host 'QA completo con fallos:' -ForegroundColor Red
    foreach ($f in $failures) {
        Write-Host ("  - {0}" -f $f) -ForegroundColor Red
    }
    exit 1
}
