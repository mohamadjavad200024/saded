# Complete MySQL Setup Script
# Run this script as Administrator to install MySQL and setup database

param(
    [switch]$SkipInstall
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete MySQL Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin -and -not $SkipInstall) {
    Write-Host "WARNING: Not running as Administrator!" -ForegroundColor Yellow
    Write-Host "Some operations may fail without admin rights." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To run as Administrator:" -ForegroundColor Cyan
    Write-Host "  1. Right-click PowerShell" -ForegroundColor White
    Write-Host "  2. Select 'Run as Administrator'" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Step 1: Check/Install MySQL
if (-not $SkipInstall) {
    Write-Host "Step 1: Checking for MySQL..." -ForegroundColor Cyan
    
    $xamppMysql = "C:\xampp\mysql\bin\mysql.exe"
    
    if (Test-Path $xamppMysql) {
        Write-Host "Found XAMPP MySQL!" -ForegroundColor Green
        $env:Path += ";C:\xampp\mysql\bin"
    } else {
        # Try to install MySQL using winget
        Write-Host "MySQL not found. Attempting to install..." -ForegroundColor Yellow
        
        $winget = Get-Command winget -ErrorAction SilentlyContinue
        if ($winget) {
            Write-Host "Installing MySQL using winget..." -ForegroundColor Cyan
            try {
                winget install Oracle.MySQL -e --accept-package-agreements --accept-source-agreements --silent
                Write-Host "MySQL installation started!" -ForegroundColor Green
                Write-Host "Please wait for installation to complete..." -ForegroundColor Yellow
                Start-Sleep -Seconds 30
            } catch {
                Write-Host "Installation may require manual steps." -ForegroundColor Yellow
            }
        } else {
            Write-Host ""
            Write-Host "Please install MySQL manually:" -ForegroundColor Yellow
            Write-Host "  1. Download XAMPP: https://www.apachefriends.org/download.html" -ForegroundColor White
            Write-Host "  2. Or MySQL: https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
            Write-Host ""
            Write-Host "After installation, run this script again with -SkipInstall" -ForegroundColor Cyan
            exit 1
        }
    }
}

# Step 2: Start MySQL service
Write-Host ""
Write-Host "Step 2: Starting MySQL service..." -ForegroundColor Cyan

$xamppMysql = "C:\xampp\mysql\bin\mysql.exe"
if (Test-Path $xamppMysql) {
    $mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
    if (-not $mysqlProcess) {
        Write-Host "Starting XAMPP MySQL..." -ForegroundColor Yellow
        Start-Process "C:\xampp\xampp-control.exe" -ErrorAction SilentlyContinue
        Write-Host "Please start MySQL from XAMPP Control Panel" -ForegroundColor Yellow
        Write-Host "Waiting 10 seconds for MySQL to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
    $env:Path += ";C:\xampp\mysql\bin"
    $mysqlCmd = $xamppMysql
} else {
    # Try to find MySQL in standard locations
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
    
    if ($mysqlCmd) {
        # Try to start MySQL service
        $mysqlService = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($mysqlService) {
            if ($mysqlService.Status -ne "Running") {
                Write-Host "Starting MySQL service..." -ForegroundColor Yellow
                Start-Service -Name $mysqlService.Name -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 5
            }
        }
    }
}

if (-not $mysqlCmd) {
    Write-Host "MySQL command not found. Please ensure MySQL is installed and in PATH." -ForegroundColor Red
    exit 1
}

# Step 3: Create database
Write-Host ""
Write-Host "Step 3: Creating database 'saded'..." -ForegroundColor Cyan

$createDbScript = "CREATE DATABASE IF NOT EXISTS \`saded\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

try {
    & $mysqlCmd -u root -e $createDbScript 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created successfully!" -ForegroundColor Green
    } else {
        # Try without password
        & $mysqlCmd -u root -e $createDbScript 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database created successfully!" -ForegroundColor Green
        } else {
            throw "Failed to create database"
        }
    }
} catch {
    Write-Host "Error creating database. You may need to enter password manually." -ForegroundColor Yellow
    Write-Host "Please run: mysql -u root -p" -ForegroundColor White
    Write-Host "Then: CREATE DATABASE saded CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
}

# Step 4: Run setup script
Write-Host ""
Write-Host "Step 4: Running database setup..." -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot\..
npm run setup-mysql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Setup completed successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now start developing!" -ForegroundColor Cyan
    Write-Host "Run: npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Setup completed with warnings." -ForegroundColor Yellow
    Write-Host "Please check the output above." -ForegroundColor Yellow
}

