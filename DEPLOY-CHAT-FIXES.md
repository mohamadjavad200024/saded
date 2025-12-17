# راهنمای دیپلوی تغییرات چت (لوکیشن و ویس)

## مشکل
تغییرات اعمال نمی‌شوند - دکمه‌های لوکیشن و ویس کار نمی‌کنند.

## راه حل: دیپلوی کامل

### مرحله 1: Pull تغییرات
```bash
cd ~/public_html/saded
git pull origin main
```

### مرحله 2: بررسی تغییرات
```bash
# بررسی آخرین commit
git log --oneline -5

# باید commit های زیر را ببینی:
# - dafb33d3 Debug: add alert and preventDefault to test if button clicks are working
# - 2226f3bc Debug: add extensive logging for location and voice message handlers
```

### مرحله 3: بررسی فایل‌های تغییر یافته
```bash
# بررسی فایل‌های چت
ls -la app/chat/page.tsx
ls -la components/chat/quick-buy-chat.tsx

# بررسی تاریخ تغییرات
stat app/chat/page.tsx
stat components/chat/quick-buy-chat.tsx
```

### مرحله 4: بررسی Build Files
```bash
# بررسی وجود .next
ls -la .next/

# بررسی BUILD_ID
cat .next/BUILD_ID

# بررسی فایل‌های build شده
ls -la .next/server/app/chat/
ls -la .next/server/components/chat/
```

### مرحله 5: اگر Build Files قدیمی هستند
```bash
# Build جدید
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm run build
```

### مرحله 6: Restart PM2
```bash
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# Stop و Delete
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded

# Start مجدد
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
```

### مرحله 7: بررسی Logs
```bash
# بررسی لاگ‌های PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50

# بررسی وضعیت
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

## استفاده از اسکریپت خودکار

```bash
cd ~/public_html/saded
chmod +x HOST-FULL-DEPLOY-NOW.sh
./HOST-FULL-DEPLOY-NOW.sh
```

## تست بعد از دیپلوی

1. **Hard Refresh صفحه**: `Ctrl+F5` یا `Cmd+Shift+R`
2. **باز کردن Console**: `F12` → Console
3. **کلیک روی دکمه Paperclip** (📎)
4. **کلیک روی دکمه لوکیشن** (📍) یا **ویس** (🎤)

### انتظارات:
- باید یک **alert** نمایش داده شود: "دکمه لوکیشن کلیک شد!" یا "دکمه ویس کلیک شد!"
- در Console باید لاگ‌های زیر را ببینی:
  - `[Location] Button clicked!` یا `[Voice] Button clicked!`
  - `[Location] handleLocationShare called` یا `[Voice] saveRecording called`

## عیب‌یابی

### اگر alert نمایش داده نشد:
- دکمه render نشده است
- مشکل از CSS یا z-index است
- دکمه با element دیگری پوشیده شده

### اگر alert نمایش داده شد اما تابع کار نکرد:
- مشکل از geolocation یا microphone permission است
- لاگ‌های Console را بررسی کن

### اگر هیچ تغییری اعمال نشد:
```bash
# بررسی cache مرورگر
# Hard Refresh: Ctrl+F5

# بررسی PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی فایل‌های build
ls -la .next/server/app/chat/page.js
ls -la .next/server/components/chat/quick-buy-chat.js

# اگر فایل‌ها قدیمی هستند:
npm run build
```

## دستورات مفید

```bash
# بررسی آخرین commit
git log --oneline -1

# بررسی تغییرات فایل
git diff HEAD~1 app/chat/page.tsx

# بررسی وضعیت Git
git status

# بررسی PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 list
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 100
```

