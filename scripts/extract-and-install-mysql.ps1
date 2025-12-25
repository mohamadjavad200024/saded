# Extract and Install MySQL from RAR file

$mysqlRar = "C:\Users\MohamadJavad\Downloads\MySQL.8.0.31.Community_YasDL.com.rar"
$extractPath = "$env:TEMP\MySQL_Extract"

Write-Host "MySQL Installation Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if RAR file exists
if (-not (Test-Path $mysqlRar)) {
    Write-Host "Error: MySQL RAR file not found at: $mysqlRar" -ForegroundColor Red
    exit 1
}

Write-Host "Found MySQL RAR file: $mysqlRar" -ForegroundColor Green
Write-Host ""

# Create extract directory
if (-not (Test-Path $extractPath)) {
    New-Item -ItemType Directory -Path $extractPath -Force | Out-Null
}

Write-Host "Extracting MySQL RAR file..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Extract using WinRAR
$winrar = "C:\Program Files\WinRAR\WinRAR.exe"
if (Test-Path $winrar) {
    & $winrar x -y "$mysqlRar" "$extractPath\" | Out-Null
    Write-Host "Extraction completed!" -ForegroundColor Green
} else {
    Write-Host "WinRAR not found. Please extract manually:" -ForegroundColor Yellow
    Write-Host "  File: $mysqlRar" -ForegroundColor White
    Write-Host "  Extract to: $extractPath" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Looking for installer..." -ForegroundColor Cyan

# Find installer
$installer = Get-ChildItem -Path $extractPath -Recurse -File | Where-Object {
    $_.Extension -in @('.msi', '.exe') -and 
    ($_.Name -like "*install*" -or $_.Name -like "*setup*" -or $_.Name -like "*mysql*")
} | Select-Object -First 1

if (-not $installer) {
    Write-Host "Installer not found. Listing all files:" -ForegroundColor Yellow
    Get-ChildItem -Path $extractPath -Recurse -File | Select-Object Name, Length | Format-Table -AutoSize
    Write-Host ""
    Write-Host "Please check the extracted files and run installer manually." -ForegroundColor Yellow
    Write-Host "Extract path: $extractPath" -ForegroundColor White
    exit 1
}

Write-Host "Found installer: $($installer.FullName)" -ForegroundColor Green
Write-Host ""

# Install MySQL
Write-Host "Installing MySQL..." -ForegroundColor Cyan
Write-Host "Please follow the installer instructions." -ForegroundColor Yellow
Write-Host ""

if ($installer.Extension -eq ".msi") {
    # MSI installer
    Start-Process msiexec.exe -ArgumentList "/i `"$($installer.FullName)`" /quiet /norestart" -Wait
} else {
    # EXE installer
    Start-Process -FilePath $installer.FullName -Wait
}

Write-Host ""
Write-Host "MySQL installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure MySQL (if needed)" -ForegroundColor White
Write-Host "  2. Start MySQL service" -ForegroundColor White
Write-Host "  3. Run: npm run setup-mysql" -ForegroundColor White









