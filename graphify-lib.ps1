#Requires -Version 5.1
<#
.SYNOPSIS
  Pixelmon single-codebase helpers for graphify.bat
#>
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('show', 'check', 'build', 'open')]
  [string]$Action,

  [Parameter(Mandatory = $true)]
  [string]$Root,

  [string]$GraphifyExe = ''
)

$ErrorActionPreference = 'Continue'
$Root = (Resolve-Path -LiteralPath $Root).Path

$GraphPath = Join-Path $Root 'graphify-out\graph.json'
$HtmlPath = Join-Path $Root 'graphify-out\graph.html'
$ReportPath = Join-Path $Root 'graphify-out\GRAPH_REPORT.md'

function Get-GraphStats([string]$Gp) {
  if (-not (Test-Path -LiteralPath $Gp)) { return $null }
  try {
    $py = @'
import json,sys
p=sys.argv[1]
d=json.load(open(p,encoding="utf-8"))
nodes=d.get("nodes") or []
links=d.get("links") or d.get("edges") or []
comms=set()
for n in nodes:
    c=n.get("community")
    if c is not None: comms.add(c)
print(len(nodes), len(links), len(comms))
'@
    $tmpPy = Join-Path $env:TEMP 'graphify_stats_single.py'
    Set-Content -LiteralPath $tmpPy -Value $py -Encoding ASCII
    $out = & python $tmpPy $Gp 2>$null
    $parts = ("$out").Trim() -split '\s+'
    $nodes = [int]$parts[0]
    $edges = [int]$parts[1]
    $comms = [int]$parts[2]
    return [pscustomobject]@{
      Nodes        = $nodes
      Edges        = $edges
      Communities  = $comms
      Bytes        = (Get-Item -LiteralPath $Gp).Length
      Valid        = ($nodes -gt 0)
    }
  } catch {
    return [pscustomobject]@{
      Nodes = 0; Edges = 0; Communities = 0; Bytes = 0; Valid = $false
    }
  }
}

function Get-TopNodesFromFile([string]$Gp, [int]$Take = 12) {
  if (-not (Test-Path -LiteralPath $Gp)) { return @() }
  $py = @'
import json,sys
from collections import Counter
p, take = sys.argv[1], int(sys.argv[2])
d=json.load(open(p,encoding="utf-8"))
nodes={n.get("id"): n for n in (d.get("nodes") or []) if n.get("id")}
deg=Counter()
for e in (d.get("links") or d.get("edges") or []):
    s=e.get("source") or e.get("from")
    t=e.get("target") or e.get("to")
    if s: deg[s]+=1
    if t: deg[t]+=1
for nid, c in deg.most_common(take):
    n=nodes.get(nid) or {}
    label=n.get("label") or nid
    src=n.get("source_file") or n.get("source") or n.get("file") or ""
    print(f"{c}\t{label}\t{src}")
'@
  $tmpPy = Join-Path $env:TEMP 'graphify_top_single.py'
  Set-Content -LiteralPath $tmpPy -Value $py -Encoding ASCII
  $rows = & python $tmpPy $Gp $Take 2>$null
  foreach ($line in @($rows)) {
    if (-not $line) { continue }
    $bits = "$line" -split "`t", 3
    [pscustomobject]@{ Degree = [int]$bits[0]; Label = $bits[1]; Source = $(if ($bits.Count -gt 2) { $bits[2] } else { '' }) }
  }
}

switch ($Action) {
  'show' {
    Write-Host ''
    Write-Host "=== Pixelmon Codebase Graph Status ==="
    Write-Host "Directory:  $Root"
    
    $stats = Get-GraphStats $GraphPath
    if (-not $stats -or -not $stats.Valid) {
      Write-Host 'Graph:      MISSING or INVALID - run: graphify build'
      exit 1
    }
    
    $kb = [math]::Round($stats.Bytes / 1KB, 1)
    Write-Host ("Graph JSON: {0}" -f $GraphPath)
    Write-Host ("Nodes:      {0}   Edges: {1}   Communities: {2}   Size: {3} KB" -f `
      $stats.Nodes, $stats.Edges, $stats.Communities, $kb)
    Write-Host ("HTML Viz:   {0}" -f $(if (Test-Path -LiteralPath $HtmlPath) { $HtmlPath } else { '(none - run: graphify build)' }))
    Write-Host ("Report:     {0}" -f $(if (Test-Path -LiteralPath $ReportPath) { $ReportPath } else { '(none)' }))
    
    Write-Host ''
    Write-Host 'Top connected codebase symbols:'
    $top = Get-TopNodesFromFile $GraphPath 12
    foreach ($t in $top) {
      Write-Host ("  {0,5}  {1,-48} {2}" -f $t.Degree, $t.Label, $t.Source)
    }
    Write-Host ''
    Write-Host 'Query:'
    Write-Host '  graphify query "<question>"'
    Write-Host '  graphify explain "<symbol>"'
    exit 0
  }

  'check' {
    Write-Host ''
    $stats = Get-GraphStats $GraphPath
    if (-not $stats -or -not $stats.Valid) {
      Write-Host '  [FAIL] Graph file graphify-out\graph.json is missing or empty.'
      exit 1
    }
    Write-Host ("  [OK] Graph exists: {0} nodes, {1} edges, {2} community" -f $stats.Nodes, $stats.Edges, $stats.Communities)
    exit 0
  }

  'build' {
    if (-not $GraphifyExe -or -not (Test-Path -LiteralPath $GraphifyExe)) {
      Write-Host "graphify.exe not found: $GraphifyExe"
      exit 1
    }
    
    Write-Host ''
    Write-Host "======== Extracting Codebase AST (Recursively) ========"
    $sw = [Diagnostics.Stopwatch]::StartNew()
    $outDir = Join-Path $Root 'graphify-out'
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    
    $stdout = Join-Path $outDir '_extract_stdout.txt'
    $stderr = Join-Path $outDir '_extract_stderr.txt'
    
    # 1. Run recursive AST extraction on the root codebase
    Push-Location -LiteralPath $Root
    try {
      & $GraphifyExe extract . --code-only --force 1>$stdout 2>$stderr
    } finally {
      Pop-Location
    }

    # 2. Generate the HTML visualization and perform Leiden clustering first
    Write-Host '======== Generating HTML Visualization & Communities ========'
    $prevLimit = $env:GRAPHIFY_VIZ_NODE_LIMIT
    try {
      $nodeHint = 5000
      $st = Get-GraphStats $GraphPath
      if ($st -and $st.Nodes -gt 0) { $nodeHint = [int]$st.Nodes }
      $env:GRAPHIFY_VIZ_NODE_LIMIT = [string]([Math]::Max(5000, $nodeHint + 1000))
      
      Push-Location -LiteralPath $Root
      try {
        & $GraphifyExe cluster-only . --no-label 1>$stdout 2>$stderr
      } finally { Pop-Location }
    } finally {
      if ($null -eq $prevLimit) { Remove-Item Env:GRAPHIFY_VIZ_NODE_LIMIT -ErrorAction SilentlyContinue }
      else { $env:GRAPHIFY_VIZ_NODE_LIMIT = $prevLimit }
    }

    # 3. Execute custom post-processing to bridge isolated modules and group under a single 'pixelmon_game' community.
    # We do this LAST so that our bridging and community assignments are preserved in graph.json.
    Write-Host '======== Executing Component Bridging & Unification ========'
    $bridgeScript = Join-Path $Root 'scripts\bridge_components.py'
    if (Test-Path -LiteralPath $bridgeScript) {
      & python $bridgeScript 2>&1 | ForEach-Object { Write-Host "  $_" }
    } else {
      Write-Host '  Warning: bridge_components.py not found. Skipping post-processing.'
    }
    
    $sw.Stop()
    $sec = [math]::Round($sw.Elapsed.TotalSeconds, 1)

    $finalStats = Get-GraphStats $GraphPath
    if ($finalStats -and $finalStats.Valid) {
      Write-Host ("  => BUILD SUCCESS: {0} nodes, {1} edges, {2} community (pixelmon_game)" -f $finalStats.Nodes, $finalStats.Edges, $finalStats.Communities)
      Write-Host ("  => Output: {0}" -f $GraphPath)
      Write-Host ("  => Viz:    {0}" -f $HtmlPath)
      Write-Host ("  => Elapsed: {0} seconds" -f $sec)
      Remove-Item -LiteralPath $stdout, $stderr -Force -ErrorAction SilentlyContinue
      exit 0
    } else {
      Write-Host '  => BUILD FAILED: Graph was not generated successfully.'
      if (Test-Path -LiteralPath $stderr) {
        Write-Host '  [stderr tail]'
        Get-Content -LiteralPath $stderr -Tail 8 -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "  $_" }
      }
      exit 1
    }
  }

  'open' {
    if (-not (Test-Path -LiteralPath $HtmlPath)) {
      if (-not (Test-Path -LiteralPath $GraphPath)) {
        Write-Host "No graph exists yet. Please run:  graphify build"
        exit 1
      }
      if (-not $GraphifyExe) { Write-Host 'graphify.exe required to generate HTML'; exit 1 }
      Push-Location -LiteralPath $Root
      try {
        & $GraphifyExe cluster-only . --no-label 2>$null | Out-Null
      } finally { Pop-Location }
    }
    
    if (Test-Path -LiteralPath $HtmlPath) {
      Write-Host "Opening visualization: $HtmlPath"
      Start-Process $HtmlPath
      exit 0
    }
    Write-Host 'Failed to open HTML visualization.'
    exit 1
  }
}
