# دستورات آپلود فایل‌های بیلد شده

## ✅ بیلد محلی موفق بود!

حالا باید فایل‌های بیلد شده را به هاست آپلود کنید.

## فایل‌های مورد نیاز برای آپلود:

### 1. فایل BUILD_ID
**مسیر محلی:** `.next\BUILD_ID`  
**مسیر در هاست:** `~/public_html/saded/.next/BUILD_ID`

### 2. پوشه static (کل پوشه)
**مسیر محلی:** `.next\static\` (کل پوشه)  
**مسیر در هاست:** `~/public_html/saded/.next/static/`

### 3. پوشه server (کل پوشه)
**مسیر محلی:** `.next\server\` (کل پوشه)  
**مسیر در هاست:** `~/public_html/saded/.next/server/`

## روش آپلود:

### روش 1: استفاده از File Manager در cPanel
1. وارد cPanel شوید
2. File Manager را باز کنید
3. به مسیر `public_html/saded/.next/` بروید
4. فایل‌های بالا را آپلود کنید

### روش 2: استفاده از FTP/SFTP
1. از FileZilla یا هر FTP Client استفاده کنید
2. به هاست متصل شوید
3. فایل‌ها را از `.next` محلی به `.next` هاست آپلود کنید

### روش 3: استفاده از SCP (در ترمینال)
```bash
# از محیط محلی (Git Bash یا WSL)
scp -r .next/BUILD_ID shop1111@linux25.centraldnserver.com:~/public_html/saded/.next/
scp -r .next/static shop1111@linux25.centraldnserver.com:~/public_html/saded/.next/
scp -r .next/server shop1111@linux25.centraldnserver.com:~/public_html/saded/.next/
```

## بعد از آپلود:

```bash
# در ترمینال هاست
cd ~/public_html/saded

# دریافت آخرین تغییرات کد
git pull origin main

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

## نکات مهم:

1. ✅ حتماً پوشه‌های `static` و `server` را کامل آپلود کنید
2. ✅ فایل `BUILD_ID` را هم آپلود کنید
3. ✅ بعد از آپلود، PM2 را restart کنید
4. ✅ اگر خطا داشتید، لاگ‌ها را بررسی کنید

## بررسی موفقیت:

بعد از restart، سایت باید بدون خطای 503 کار کند و تب Footer در `/admin/settings` باید نمایش داده شود.

