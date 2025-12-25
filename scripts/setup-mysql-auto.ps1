# Auto Setup MySQL Script
# This script checks for MySQL and sets up the database automatically

Write-Host "Checking for MySQL installation..." -ForegroundColor Cyan

# Check for XAMPP MySQL
$xamppMysql = "C:\xampp\mysql\bin\mysql.exe"
if (Test-Path $xamppMysql) {
    Write-Host "Found XAMPP MySQL!" -ForegroundColor Green
    $env:Path += ";C:\xampp\mysql\bin"
    
    # Check if MySQL service is running
    $mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
    if (-not $mysqlProcess) {
        Write-Host "Starting XAMPP MySQL..." -ForegroundColor Yellow
        Start-Process "C:\xampp\xampp-control.exe" -ErrorAction SilentlyContinue
        Write-Host "Please start MySQL from XAMPP Control Panel" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
    
    # Try to connect
    $mysqlCmd = $xamppMysql
} else {
    # Check for standard MySQL
    $mysqlPaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe"
    )
    
    $mysqlCmd = $null
    foreach ($path in $mysqlPaths) {
        if (Test-Path $path) {
            $mysqlCmd = $path
            Write-Host "Found MySQL at: $path" -ForegroundColor Green
            break
        }
    }
}

if (-not $mysqlCmd) {
    Write-Host ""
    Write-Host "MySQL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install MySQL or XAMPP first:" -ForegroundColor Yellow
    Write-Host "  1. Download XAMPP from: https://www.apachefriends.org" -ForegroundColor White
    Write-Host "  2. Or install MySQL from: https://dev.mysql.com/downloads/mysql/" -ForegroundColor White
    Write-Host "  3. Then run this script again" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Creating database 'saded'..." -ForegroundColor Cyan

# Create database
$createDbScript = @"
CREATE DATABASE IF NOT EXISTS \`saded\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
"@

try {
    & $mysqlCmd -u root -e $createDbScript
    Write-Host "Database created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error creating database. Trying without password..." -ForegroundColor Yellow
    try {
        & $mysqlCmd -u root -e $createDbScript
        Write-Host "Database created successfully!" -ForegroundColor Green
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "Please create database manually:" -ForegroundColor Yellow
        Write-Host "  mysql -u root -p" -ForegroundColor White
        Write-Host "  CREATE DATABASE saded CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "Running database setup script..." -ForegroundColor Cyan
Write-Host ""

# Run setup-mysql.js
npm run setup-mysql

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now start developing!" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Setup completed with some warnings." -ForegroundColor Yellow
    Write-Host "Please check the output above." -ForegroundColor Yellow
}









