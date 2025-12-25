# Start MySQL Service and Setup Database
# Run this script as Administrator

Write-Host "MySQL Setup Script" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator!" -ForegroundColor Yellow
    Write-Host "MySQL service requires Administrator rights to start." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Cyan
    Write-Host "  1. Right-click PowerShell" -ForegroundColor White
    Write-Host "  2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "Or start MySQL service manually:" -ForegroundColor Cyan
    Write-Host "  net start MySQL80" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Find MySQL service
$mysqlService = Get-Service -Name "*mysql*" | Where-Object { $_.Status -eq "Stopped" } | Select-Object -First 1

if ($mysqlService) {
    Write-Host "Starting MySQL service: $($mysqlService.Name)..." -ForegroundColor Cyan
    try {
        Start-Service -Name $mysqlService.Name
        Start-Sleep -Seconds 5
        $status = Get-Service -Name $mysqlService.Name
        if ($status.Status -eq "Running") {
            Write-Host "MySQL service started successfully!" -ForegroundColor Green
        } else {
            Write-Host "MySQL service status: $($status.Status)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error starting MySQL service: $_" -ForegroundColor Red
        Write-Host "Try starting manually: net start MySQL80" -ForegroundColor Yellow
        exit 1
    }
} else {
    $runningService = Get-Service -Name "*mysql*" | Where-Object { $_.Status -eq "Running" } | Select-Object -First 1
    if ($runningService) {
        Write-Host "MySQL service is already running: $($runningService.Name)" -ForegroundColor Green
    } else {
        Write-Host "No MySQL service found!" -ForegroundColor Red
        exit 1
    }
}

# Find MySQL executable
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
)

$mysqlCmd = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlCmd = $path
        break
    }
}

if (-not $mysqlCmd) {
    Write-Host "MySQL executable not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "MySQL found at: $mysqlCmd" -ForegroundColor Green
Write-Host ""

# Wait a bit more for MySQL to be ready
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test connection
Write-Host "Testing MySQL connection..." -ForegroundColor Cyan
$testResult = & $mysqlCmd -u root -e "SELECT 1;" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "MySQL connection successful!" -ForegroundColor Green
} else {
    Write-Host "MySQL connection failed. Trying with password prompt..." -ForegroundColor Yellow
    Write-Host "If you set a password during installation, you'll need to enter it." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run manually:" -ForegroundColor Cyan
    Write-Host "  $mysqlCmd -u root -p" -ForegroundColor White
    Write-Host "  CREATE DATABASE saded CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
    Write-Host ""
}

# Create database
Write-Host ""
Write-Host "Creating database 'saded'..." -ForegroundColor Cyan
$createDb = & $mysqlCmd -u root -e "CREATE DATABASE IF NOT EXISTS \`saded\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database 'saded' created successfully!" -ForegroundColor Green
} else {
    if ($createDb -like "*password*" -or $createDb -like "*Access denied*") {
        Write-Host "Password required. Please create database manually:" -ForegroundColor Yellow
        Write-Host "  $mysqlCmd -u root -p" -ForegroundColor White
        Write-Host "  CREATE DATABASE saded CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
        Write-Host ""
        Write-Host "Then update .env.local with your password and run: npm run setup-mysql" -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "Error creating database: $createDb" -ForegroundColor Red
    }
}

# Run setup script
Write-Host ""
Write-Host "Running database setup..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot\..

# Update PATH temporarily
$env:Path += ";C:\Program Files\MySQL\MySQL Server 8.0\bin"

npm run setup-mysql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Setup completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "MySQL is ready to use!" -ForegroundColor Cyan
    Write-Host "You can now run: npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Setup completed with some warnings." -ForegroundColor Yellow
    Write-Host "Please check the output above." -ForegroundColor Yellow
}









