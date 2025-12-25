# دستورات Git و Build

## توجه: به دلیل مشکل مسیر در PowerShell، لطفاً این دستورات را به صورت دستی در ترمینال پروژه اجرا کنید.

## مراحل:

### 1. باز کردن ترمینال در مسیر پروژه
```bash
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
```

### 2. Initialize Git (اگر هنوز انجام نشده)
```bash
git init
```

### 3. بیلد پروژه
```bash
npm run build
```

### 4. اضافه کردن تمام تغییرات به Git
```bash
git add .
```

### 5. کامیت تغییرات
```bash
git commit -m "Clean up: Remove temporary files and prepare for production deployment"
```

### 6. اتصال به Remote Repository (اگر وجود دارد)
```bash
git remote add origin <YOUR_REPO_URL>
git branch -M main
git push -u origin main
```

### 7. یا Push به branch موجود
```bash
git push origin main
# یا
git push origin master
```

## فایل‌های حذف شده:
- تمام اسکریپت‌های موقت (.sh و .bat)
- فایل‌های مستندات موقت (.md) - به جز README.md و docs/
- فایل‌های تکراری (app.js, index.js)
- فایل‌های موقت (txt, mp4, pdf)

## فایل‌های نگه داشته شده:
- README.md
- docs/API.md
- docs/DEVELOPER_GUIDE.md
- server.js
- ecosystem.config.js
- تمام فایل‌های کد منبع

