# Start MySQL with elevated privileges
# This script will request admin rights if needed

$scriptPath = Join-Path $PSScriptRoot "start-mysql-service.ps1"

# Check if already running as admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Requesting Administrator privileges..." -ForegroundColor Yellow
    Write-Host "Please approve the UAC prompt." -ForegroundColor Yellow
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$scriptPath`"" -Wait
} else {
    & $scriptPath
}









