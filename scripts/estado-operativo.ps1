$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$coordPath = Join-Path $repoRoot 'COORDINACION_IA.md'
if (-not (Test-Path $coordPath)) {
    throw "No se encontro COORDINACION_IA.md en $repoRoot"
}

$coordLines = Get-Content -LiteralPath $coordPath -Encoding UTF8

function Get-SectionLines {
    param(
        [string[]]$Lines,
        [string]$Header
    )

    $start = [Array]::IndexOf($Lines, $Header)
    if ($start -lt 0) {
        return @()
    }

    $result = New-Object System.Collections.Generic.List[string]
    for ($i = $start + 1; $i -lt $Lines.Length; $i++) {
        if ($Lines[$i] -match '^## ') {
            break
        }
        $result.Add($Lines[$i])
    }
    return $result
}

function Get-LatestEntries {
    param([string[]]$Lines)

    $entryIndexes = for ($i = 0; $i -lt $Lines.Length; $i++) {
        if ($Lines[$i] -match '^### Entrada ') { $i }
    }

    if (-not $entryIndexes) {
        return @()
    }

    $latest = $entryIndexes | Select-Object -Last 2
    $entries = @()

    foreach ($start in $latest) {
        $end = $Lines.Length - 1
        for ($i = $start + 1; $i -lt $Lines.Length; $i++) {
            if ($Lines[$i] -match '^### Entrada ') {
                $end = $i - 1
                break
            }
        }

        $block = $Lines[$start..$end]
        $header = $block[0]
        $objetivo = ($block | Where-Object { $_ -like '- Objetivo:*' } | Select-Object -First 1)

        $proximo = ''
        $subfase = ''
        for ($j = 0; $j -lt $block.Count; $j++) {
            if ($block[$j] -like '- Proximo agente que debe trabajar*') {
                $proximo = $block[$j]
                if ($proximo.Trim().EndsWith(':') -and ($j + 1) -lt $block.Count) {
                    $proximo = $proximo + ' ' + $block[$j + 1].Trim()
                }
            }
            if ($block[$j] -like '- Proxima subfase*') {
                $subfase = $block[$j]
                if ($subfase.Trim().EndsWith(':') -and ($j + 1) -lt $block.Count) {
                    $subfase = $subfase + ' ' + $block[$j + 1].Trim()
                }
            }
        }

        $entries += [PSCustomObject]@{
            Header = $header
            Objetivo = $objetivo
            Proximo = $proximo
            Subfase = $subfase
        }
    }

    return $entries
}

function Get-CurrentPhaseNumber {
    param([string[]]$Lines)

    $candidateLine = $null
    $candidateIndex = -1

    for ($i = 0; $i -lt $Lines.Length; $i++) {
        if ($Lines[$i] -like '- Proxima subfase autorizada:*') {
            $candidateLine = $Lines[$i]
            $candidateIndex = $i
        }
    }

    if (-not $candidateLine) {
        for ($i = 0; $i -lt $Lines.Length; $i++) {
            if ($Lines[$i] -like '- Proxima subfase a ejecutar:*') {
                $candidateLine = $Lines[$i]
                $candidateIndex = $i
            }
        }
    }

    if ($candidateLine -and $candidateLine -match 'Fase\s+([0-9]+)') {
        return [int]$Matches[1]
    }

    if ($candidateIndex -ge 0 -and ($candidateIndex + 1) -lt $Lines.Length) {
        $nextLine = $Lines[$candidateIndex + 1].Trim()
        if ($nextLine -match 'Fase\s+([0-9]+)') {
            return [int]$Matches[1]
        }
    }

    return $null
}

function Get-TrazabilidadPath {
    param([int]$PhaseNumber)

    $map = @{
        1 = 'TRAZABILIDAD/fase-1-planificacion.md'
        2 = 'TRAZABILIDAD/fase-2-infraestructura.md'
        3 = 'TRAZABILIDAD/fase-3-backend.md'
        4 = 'TRAZABILIDAD/fase-4-frontend.md'
        5 = 'TRAZABILIDAD/fase-5-qa.md'
        6 = 'TRAZABILIDAD/fase-6-implantacion.md'
    }

    if ($map.ContainsKey($PhaseNumber)) {
        return Join-Path $repoRoot $map[$PhaseNumber]
    }

    return $null
}

function Get-TrazabilidadSummary {
    param([string]$Path)

    if (-not $Path -or -not (Test-Path $Path)) {
        return [PSCustomObject]@{
            Path = $Path
            Placeholder = $null
            LastRows = @()
        }
    }

    $lines = Get-Content -LiteralPath $Path -Encoding UTF8
    $placeholder = $lines -match '<!-- Se completa durante la ejecucion de la fase -->|<!-- Se completa durante la ejecución de la fase -->'
    $rows = $lines | Where-Object { $_ -match '^\| \d{2}/\d{2}/\d{4} ' }

    return [PSCustomObject]@{
        Path = $Path
        Placeholder = [bool]$placeholder
        LastRows = @($rows | Select-Object -Last 3)
    }
}

$status = git status --short
$branch = git branch --show-current
$pointSection = Get-SectionLines -Lines $coordLines -Header '## Punto de inicio actual'
$latestEntries = Get-LatestEntries -Lines $coordLines
$phaseNumber = Get-CurrentPhaseNumber -Lines $coordLines
$trazPath = Get-TrazabilidadPath -PhaseNumber $phaseNumber
$trazSummary = Get-TrazabilidadSummary -Path $trazPath

Write-Output '=== ESTADO OPERATIVO ==='
Write-Output ('Repo: ' + $repoRoot)
Write-Output ('Rama actual: ' + $branch)
Write-Output ''

Write-Output '--- Punto de Inicio Actual ---'
if ($pointSection.Count -eq 0) {
    Write-Output 'No se encontro la seccion "Punto de inicio actual" en COORDINACION_IA.md.'
} else {
    $pointSection | Where-Object { $_.Trim() -ne '' } | ForEach-Object { Write-Output $_ }
}
Write-Output ''

Write-Output '--- Ultimas Entradas ---'
if ($latestEntries.Count -eq 0) {
    Write-Output 'No se encontraron entradas.'
} else {
    foreach ($entry in $latestEntries) {
        Write-Output $entry.Header
        if ($entry.Objetivo) { Write-Output ('  ' + $entry.Objetivo.Trim()) }
        if ($entry.Subfase) { Write-Output ('  ' + $entry.Subfase.Trim()) }
        if ($entry.Proximo) { Write-Output ('  ' + $entry.Proximo.Trim()) }
        Write-Output ''
    }
}

Write-Output '--- Trazabilidad de la Fase Actual ---'
if (-not $trazSummary.Path) {
    Write-Output 'No se pudo determinar la fase actual para mapear trazabilidad.'
} else {
    Write-Output ('Archivo: ' + $trazSummary.Path)
    Write-Output ('Placeholder pendiente: ' + $trazSummary.Placeholder)
    if ($trazSummary.LastRows.Count -gt 0) {
        Write-Output 'Ultimas filas registradas:'
        $trazSummary.LastRows | ForEach-Object { Write-Output ('  ' + $_) }
    } else {
        Write-Output 'No hay filas registradas todavia.'
    }
}
Write-Output ''

Write-Output '--- Git Status ---'
if ($status) {
    $status | ForEach-Object { Write-Output $_ }
} else {
    Write-Output 'Working tree limpio.'
}
