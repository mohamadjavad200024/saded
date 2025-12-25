# XAMPP Installation Script for Windows
# Simple version without Persian characters to avoid encoding issues

Write-Host "Starting XAMPP download and installation..." -ForegroundColor Green
Write-Host ""

$downloadUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$downloadPath = "$env:TEMP\xampp-installer.exe"

# Check if XAMPP already installed
$xamppPath = "C:\xampp"
if (Test-Path $xamppPath) {
    Write-Host "XAMPP is already installed at $xamppPath!" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Installation cancelled." -ForegroundColor Red
        exit
    }
}

Write-Host "Downloading XAMPP..." -ForegroundColor Cyan
Write-Host "This may take several minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    $ProgressPreference = 'SilentlyContinue'
    Write-Host "Downloading from: $downloadUrl" -ForegroundColor Gray
    
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($downloadUrl, $downloadPath)
    
    if (Test-Path $downloadPath) {
        $fileSize = (Get-Item $downloadPath).Length / 1MB
        Write-Host "Download completed successfully!" -ForegroundColor Green
        Write-Host "File size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Gray
        Write-Host "Path: $downloadPath" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "Running installer..." -ForegroundColor Yellow
        Write-Host "Please follow the installer instructions." -ForegroundColor White
        Write-Host ""
        
        Start-Process -FilePath $downloadPath -Wait
        
        Write-Host ""
        Write-Host "XAMPP installation completed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Open XAMPP Control Panel from Start Menu" -ForegroundColor White
        Write-Host "   2. Click 'Start' button next to MySQL" -ForegroundColor White
        Write-Host "   3. MySQL will run on port 3306" -ForegroundColor White
        Write-Host ""
        Write-Host "Note: MySQL in XAMPP usually has no password (empty)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Access phpMyAdmin:" -ForegroundColor Cyan
        Write-Host "   http://localhost/phpmyadmin" -ForegroundColor Gray
        
        $deleteResponse = Read-Host "`nDelete installer file? (y/n)"
        if ($deleteResponse -eq "y" -or $deleteResponse -eq "Y") {
            Remove-Item $downloadPath -ErrorAction SilentlyContinue
            Write-Host "File deleted." -ForegroundColor Green
        }
    } else {
        throw "File was not downloaded"
    }
} catch {
    Write-Host "Error downloading or installing:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative solution:" -ForegroundColor Yellow
    Write-Host "   1. Open your browser" -ForegroundColor White
    Write-Host "   2. Go to https://www.apachefriends.org/download.html" -ForegroundColor Gray
    Write-Host "   3. Download and install XAMPP manually" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Script completed." -ForegroundColor Green









