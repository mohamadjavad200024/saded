# Start MySQL Service and Setup Database
# This script runs with Administrator privileges

Write-Host "Starting MySQL Service..." -ForegroundColor Cyan
Write-Host ""

# Start MySQL service
$mysqlService = Get-Service -Name "*mysql*" | Where-Object { $_.Status -eq "Stopped" } | Select-Object -First 1

if ($mysqlService) {
    Write-Host "Found MySQL service: $($mysqlService.Name)" -ForegroundColor Green
    Write-Host "Starting service..." -ForegroundColor Yellow
    
    try {
        Start-Service -Name $mysqlService.Name -ErrorAction Stop
        Start-Sleep -Seconds 5
        
        $status = Get-Service -Name $mysqlService.Name
        if ($status.Status -eq "Running") {
            Write-Host "MySQL service started successfully!" -ForegroundColor Green
        } else {
            Write-Host "Service status: $($status.Status)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host "Trying alternative method..." -ForegroundColor Yellow
        
        # Try using net command
        $result = net start MySQL80 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "MySQL started using net command!" -ForegroundColor Green
        } else {
            Write-Host "Failed to start MySQL: $result" -ForegroundColor Red
            exit 1
        }
    }
} else {
    $runningService = Get-Service -Name "*mysql*" | Where-Object { $_.Status -eq "Running" } | Select-Object -First 1
    if ($runningService) {
        Write-Host "MySQL service is already running!" -ForegroundColor Green
    } else {
        Write-Host "No MySQL service found!" -ForegroundColor Red
        exit 1
    }
}

# Wait for MySQL to be ready
Write-Host ""
Write-Host "Waiting for MySQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Find MySQL executable
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe"
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

# Test connection
Write-Host "Testing MySQL connection..." -ForegroundColor Cyan
$testResult = & $mysqlCmd -u root -e "SELECT 1;" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "MySQL connection successful!" -ForegroundColor Green
    
    # Create database
    Write-Host ""
    Write-Host "Creating database 'saded'..." -ForegroundColor Cyan
    $createDb = & $mysqlCmd -u root -e "CREATE DATABASE IF NOT EXISTS \`saded\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database 'saded' created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Warning: $createDb" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "MySQL is ready!" -ForegroundColor Green
    Write-Host "You can now run: npm run setup-mysql" -ForegroundColor Cyan
    
} else {
    if ($testResult -like "*password*" -or $testResult -like "*Access denied*") {
        Write-Host "MySQL requires a password." -ForegroundColor Yellow
        Write-Host "Please update .env.local with your MySQL root password." -ForegroundColor Yellow
    } else {
        Write-Host "Connection failed: $testResult" -ForegroundColor Red
    }
}









