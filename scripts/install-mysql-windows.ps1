# اسکریپت نصب MySQL برای Windows
# این اسکریپت MySQL را دانلود و نصب می‌کند

Write-Host "🚀 شروع نصب MySQL برای Windows..." -ForegroundColor Green
Write-Host ""

# بررسی اینکه آیا MySQL از قبل نصب است
$mysqlInstalled = Get-Command mysql -ErrorAction SilentlyContinue

if ($mysqlInstalled) {
    Write-Host "⚠️  MySQL از قبل نصب است!" -ForegroundColor Yellow
    $response = Read-Host "آیا می‌خواهید ادامه دهید؟ (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ نصب لغو شد." -ForegroundColor Red
        exit
    }
}

# روش 1: استفاده از winget (Windows Package Manager) - پیشنهادی
Write-Host "📦 تلاش برای نصب با استفاده از winget..." -ForegroundColor Cyan
$wingetInstalled = Get-Command winget -ErrorAction SilentlyContinue

if ($wingetInstalled) {
    Write-Host "✅ winget پیدا شد. در حال نصب MySQL..." -ForegroundColor Green
    try {
        winget install Oracle.MySQL -e --accept-package-agreements --accept-source-agreements
        Write-Host "✅ MySQL با موفقیت نصب شد!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 نکته: ممکن است نیاز به restart کردن PowerShell یا کامپیوتر داشته باشید." -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "⚠️  نصب با winget ناموفق بود. تلاش با روش دیگر..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  winget پیدا نشد. تلاش با روش دیگر..." -ForegroundColor Yellow
}

# روش 2: استفاده از Chocolatey
Write-Host ""
Write-Host "📦 تلاش برای نصب با استفاده از Chocolatey..." -ForegroundColor Cyan
$chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue

if ($chocoInstalled) {
    Write-Host "✅ Chocolatey پیدا شد. در حال نصب MySQL..." -ForegroundColor Green
    try {
        choco install mysql -y
        Write-Host "✅ MySQL با موفقیت نصب شد!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 نکته: ممکن است نیاز به restart کردن PowerShell داشته باشید." -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "⚠️  نصب با Chocolatey ناموفق بود. تلاش با روش دیگر..." -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Chocolatey پیدا نشد." -ForegroundColor Yellow
    Write-Host "💡 برای نصب Chocolatey، دستور زیر را اجرا کنید:" -ForegroundColor Cyan
    Write-Host "   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
}

# روش 3: دانلود مستقیم MySQL Installer
Write-Host ""
Write-Host "📥 دانلود مستقیم MySQL Installer..." -ForegroundColor Cyan

$downloadUrl = "https://dev.mysql.com/get/Downloads/MySQLInstaller/mysql-installer-community-8.0.40.0.msi"
$downloadPath = "$env:TEMP\mysql-installer.msi"

Write-Host "📥 در حال دانلود MySQL Installer..." -ForegroundColor Yellow
Write-Host "   URL: $downloadUrl" -ForegroundColor Gray

try {
    # دانلود فایل
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
    
    if (Test-Path $downloadPath) {
        Write-Host "✅ دانلود با موفقیت انجام شد!" -ForegroundColor Green
        Write-Host "📦 فایل در: $downloadPath" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🔧 در حال اجرای installer..." -ForegroundColor Yellow
        
        # اجرای installer
        Start-Process msiexec.exe -ArgumentList "/i `"$downloadPath`" /quiet /norestart" -Wait
        
        Write-Host ""
        Write-Host "✅ نصب MySQL شروع شد!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 مراحل بعدی:" -ForegroundColor Cyan
        Write-Host "   1. MySQL را از Start Menu باز کنید" -ForegroundColor White
        Write-Host "   2. MySQL Server را Configure کنید" -ForegroundColor White
        Write-Host "   3. رمز عبور root را تنظیم کنید (یا خالی بگذارید)" -ForegroundColor White
        Write-Host "   4. MySQL را به عنوان Windows Service نصب کنید" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 یا می‌توانید از XAMPP استفاده کنید که ساده‌تر است:" -ForegroundColor Yellow
        Write-Host "   https://www.apachefriends.org/download.html" -ForegroundColor Gray
        
        # حذف فایل دانلود شده
        Remove-Item $downloadPath -ErrorAction SilentlyContinue
    } else {
        throw "فایل دانلود نشد"
    }
} catch {
    Write-Host "❌ خطا در دانلود یا نصب:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 راه حل جایگزین: استفاده از XAMPP" -ForegroundColor Yellow
    Write-Host "   XAMPP شامل MySQL است و نصب ساده‌تری دارد:" -ForegroundColor White
    Write-Host "   1. از https://www.apachefriends.org/download.html دانلود کنید" -ForegroundColor Gray
    Write-Host "   2. نصب کنید" -ForegroundColor Gray
    Write-Host "   3. XAMPP Control Panel را باز کنید" -ForegroundColor Gray
    Write-Host "   4. MySQL را Start کنید" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ اسکریپت به پایان رسید." -ForegroundColor Green









