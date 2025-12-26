# اجرای دستورات Git

## مشکل:
PowerShell نمی‌تواند مسیر فارسی را handle کند.

## راه حل:
فایل `commit-source-files.bat` را در **CMD** (نه PowerShell) اجرا کنید:

### روش 1: دوبار کلیک
1. فایل `commit-source-files.bat` را پیدا کنید
2. دوبار کلیک کنید

### روش 2: از CMD
```cmd
cd /d "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
commit-source-files.bat
```

### روش 3: از File Explorer
1. File Explorer را باز کنید
2. به مسیر پروژه بروید: `d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)`
3. فایل `commit-source-files.bat` را پیدا کنید
4. Right-click > Run as administrator (اگر نیاز باشد)

## بعد از push در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded
git pull origin master
ls -la app/ | head -10
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
pm2 restart saded
```

