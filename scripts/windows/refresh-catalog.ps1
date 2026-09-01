# Rafraîchit le catalogue SafeR en local (Windows) : crawler → build → tests → commit/push optionnel.
# Usage : pwsh -File scripts/windows/refresh-catalog.ps1 [-Browser] [-Push]
param(
  [switch]$Browser,
  [switch]$Push
)
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $root
$log = Join-Path $root 'crawler\reports\windows-last-run.log'
New-Item -ItemType Directory -Force -Path (Split-Path $log) | Out-Null
Start-Transcript -Path $log -Force | Out-Null
try {
  Write-Host "SafeR — rafraîchissement du catalogue ($(Get-Date -Format u))"
  if (-not (Test-Path 'crawler\node_modules')) { Push-Location crawler; npm ci --omit=optional; Pop-Location }
  if ($Browser) { $env:CRAWL_BROWSER = '1' } else { $env:CRAWL_BROWSER = '0' }
  Push-Location crawler
  node crawl.mjs
  Pop-Location
  node scripts/build-catalog.mjs
  node --test scripts/test-catalog.mjs
  if ($Push -and (Test-Path '.git')) {
    git add data/catalog/products data/store-catalog.json crawler/reports
    $changes = git diff --cached --quiet; $hasChanges = $LASTEXITCODE -ne 0
    if ($hasChanges) { git commit -m "chore(catalog): nightly refresh (windows) $(Get-Date -Format s)"; git push } else { Write-Host 'Catalogue déjà à jour.' }
  }
  Write-Host 'Terminé.'
} finally {
  Stop-Transcript | Out-Null
}
