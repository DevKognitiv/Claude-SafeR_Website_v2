# Crée (ou met à jour) la tâche planifiée Windows « SafeR Catalog Refresh » à 00:00 UTC chaque jour.
# À exécuter une fois dans PowerShell (en tant qu'utilisateur courant) : pwsh -File scripts/windows/register-nightly-task.ps1
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$script = Join-Path $root 'scripts\windows\refresh-catalog.ps1'
$pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue)?.Source
if (-not $pwsh) { $pwsh = (Get-Command powershell).Source }

# 00:00 UTC exprimé en heure locale de la machine
$utcMidnight = [DateTime]::SpecifyKind((Get-Date).Date.AddDays(1), 'Utc')
$localTime = $utcMidnight.ToLocalTime()

$action = New-ScheduledTaskAction -Execute $pwsh -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$script`" -Browser -Push" -WorkingDirectory $root
$trigger = New-ScheduledTaskTrigger -Daily -At $localTime
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -RunOnlyIfNetworkAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 1) -MultipleInstances IgnoreNew
Register-ScheduledTask -TaskName 'SafeR Catalog Refresh' -Action $action -Trigger $trigger -Settings $settings -Description 'Rafraîchit le catalogue SafeR (crawler + build) chaque jour à 00:00 UTC.' -Force | Out-Null
Write-Host "Tâche « SafeR Catalog Refresh » enregistrée : tous les jours à $($localTime.ToString('HH:mm')) (heure locale = 00:00 UTC)."
Write-Host "Test immédiat : Start-ScheduledTask -TaskName 'SafeR Catalog Refresh'"
