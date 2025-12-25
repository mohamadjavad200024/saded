# اسکریپت نصب XAMPP برای Windows
# XAMPP شامل MySQL، Apache و PHP است و برای توسعه لوکال مناسب است

Write-Host "🚀 شروع دانلود و نصب XAMPP..." -ForegroundColor Green
Write-Host ""

# URL دانلود XAMPP (آخرین نسخه)
$downloadUrl = "https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/8.2.12/xampp-windows-x64-8.2.12-0-VS16-installer.exe/download"
$downloadPath = "$env:TEMP\xampp-installer.exe"

# بررسی اینکه آیا XAMPP از قبل نصب است
$xamppPath = "C:\xampp"
if (Test-Path $xamppPath) {
    Write-Host "⚠️  XAMPP از قبل در $xamppPath نصب است!" -ForegroundColor Yellow
    $response = Read-Host "آیا می‌خواهید ادامه دهید؟ (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ نصب لغو شد." -ForegroundColor Red
        exit
    }
}

Write-Host "📥 در حال دانلود XAMPP..." -ForegroundColor Cyan
Write-Host "   این ممکن است چند دقیقه طول بکشد..." -ForegroundColor Yellow
Write-Host ""

try {
    # دانلود فایل
    $ProgressPreference = 'SilentlyContinue'
    Write-Host "📥 دانلود از: $downloadUrl" -ForegroundColor Gray
    
    # استفاده از روش جایگزین برای دانلود
    $webClient = New-Object System.Net.WebClient
    $webClient.DownloadFile($downloadUrl, $downloadPath)
    
    if (Test-Path $downloadPath) {
        $fileSize = (Get-Item $downloadPath).Length / 1MB
        Write-Host "✅ دانلود با موفقیت انجام شد!" -ForegroundColor Green
        Write-Host "📦 اندازه فایل: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Gray
        Write-Host "📁 مسیر: $downloadPath" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "🔧 در حال اجرای installer..." -ForegroundColor Yellow
        Write-Host "   لطفاً دستورالعمل‌های installer را دنبال کنید." -ForegroundColor White
        Write-Host ""
        
        # اجرای installer
        Start-Process -FilePath $downloadPath -Wait
        
        Write-Host ""
        Write-Host "✅ نصب XAMPP تکمیل شد!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 مراحل بعدی:" -ForegroundColor Cyan
        Write-Host "   1. XAMPP Control Panel را از Start Menu باز کنید" -ForegroundColor White
        Write-Host "   2. روی دکمه 'Start' کنار MySQL کلیک کنید" -ForegroundColor White
        Write-Host "   3. MySQL در پورت 3306 اجرا می‌شود" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 نکته: MySQL در XAMPP معمولاً رمز عبور ندارد (خالی است)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔗 دسترسی به phpMyAdmin:" -ForegroundColor Cyan
        Write-Host "   http://localhost/phpmyadmin" -ForegroundColor Gray
        
        # حذف فایل installer
        $deleteResponse = Read-Host "`nآیا می‌خواهید فایل installer را حذف کنید؟ (y/n)"
        if ($deleteResponse -eq "y" -or $deleteResponse -eq "Y") {
            Remove-Item $downloadPath -ErrorAction SilentlyContinue
            Write-Host "✅ فایل حذف شد." -ForegroundColor Green
        }
    } else {
        throw "فایل دانلود نشد"
    }
} catch {
    Write-Host "❌ خطا در دانلود یا نصب:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 راه حل جایگزین:" -ForegroundColor Yellow
    Write-Host "   1. مرورگر را باز کنید" -ForegroundColor White
    Write-Host "   2. به https://www.apachefriends.org/download.html بروید" -ForegroundColor Gray
    Write-Host "   3. XAMPP را به صورت دستی دانلود و نصب کنید" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ اسکریپت به پایان رسید." -ForegroundColor Green









