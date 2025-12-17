# راهنمای رفع مشکل دکمه‌های لوکیشن و ویس

## مشکل
دکمه‌های لوکیشن و ویس کار نمی‌کنند.

## مراحل رفع مشکل

### مرحله 1: Pull تغییرات روی هاست
```bash
cd ~/public_html/saded
git pull origin main
```

**بررسی:** باید commit `5fad7744` یا جدیدتر را ببینی:
```bash
git log --oneline -1
```

### مرحله 2: بررسی فایل‌های تغییر یافته
```bash
# بررسی فایل‌های چت
grep -n "console.log.*Location.*Button clicked" app/chat/page.tsx
grep -n "console.log.*Voice.*Button clicked" app/chat/page.tsx

# باید خطوط زیر را ببینی:
# app/chat/page.tsx:1425:                        console.log("[Location] Button clicked!");
# app/chat/page.tsx:1440:                        console.log("[Voice] Button clicked!");
```

### مرحله 3: Restart PM2
```bash
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

**بررسی:** باید پیام `[PM2] Process restarted` را ببینی:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

### مرحله 4: Hard Refresh مرورگر
- **Windows/Linux:** `Ctrl + Shift + R` یا `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

**⚠️ مهم:** فقط F5 کافی نیست! باید Hard Refresh کنی.

### مرحله 5: باز کردن Console
1. `F12` را بزن
2. به تب **Console** برو
3. Console را خالی کن (Clear)

### مرحله 6: تست دکمه Paperclip
1. روی دکمه **Paperclip** (📎) کلیک کن
2. در Console باید این را ببینی:
   ```
   [Paperclip] Button clicked! showAttachmentOptions: true
   ```
3. اگر این لاگ را ندیدی → مشکل از event handler است

### مرحله 7: تست دکمه لوکیشن
1. بعد از کلیک روی Paperclip، منوی attachment options باید باز شود
2. روی دکمه **لوکیشن** (📍) کلیک کن
3. در Console باید این لاگ‌ها را ببینی:
   ```
   [Location] Button clicked!
   [Location] handleLocationShare called
   [Location] Protocol: https: Hostname: ... IsSecure: true
   [Location] Requesting geolocation permission...
   ```
4. باید یک toast ببینی: "در حال دریافت موقعیت..."
5. مرورگر یک popup برای permission نمایش می‌دهد

### مرحله 8: تست دکمه ویس
1. روی دکمه **ویس** (🎤) کلیک کن
2. در Console باید این لاگ‌ها را ببینی:
   ```
   [Voice] Button clicked!
   ```
3. باید یک toast ببینی: "در حال درخواست دسترسی..."
4. مرورگر یک popup برای microphone permission نمایش می‌دهد

## عیب‌یابی

### اگر هیچ لاگی در Console نمی‌بینی:
1. **Hard Refresh را دوباره بزن** (`Ctrl+Shift+R`)
2. **Console را Clear کن** و دوباره تست کن
3. **بررسی کن که PM2 restart شده:**
   ```bash
   /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50
   ```

### اگر لاگ Paperclip را می‌بینی اما Location/Voice را نمی‌بینی:
- یعنی منوی attachment options باز می‌شود
- اما دکمه‌های داخل منو کار نمی‌کنند
- **مشکل:** احتمالاً دکمه‌ها render نشده‌اند یا با element دیگری پوشیده شده‌اند

### اگر همه لاگ‌ها را می‌بینی اما تابع کار نمی‌کند:
- **برای لوکیشن:** بررسی کن که HTTPS فعال است و permission داده شده
- **برای ویس:** بررسی کن که microphone permission داده شده

### اگر تغییرات pull نشده:
```bash
cd ~/public_html/saded
git fetch origin
git pull origin main
git log --oneline -5
```

### اگر PM2 restart نشده:
```bash
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# Stop و Delete
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded

# Start مجدد
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save

# بررسی وضعیت
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

## دستورات مفید

```bash
# بررسی آخرین commit
cd ~/public_html/saded
git log --oneline -1

# بررسی تغییرات فایل
git diff HEAD~1 app/chat/page.tsx | grep -A 5 -B 5 "Location.*Button"

# بررسی PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 list
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 100

# بررسی فایل‌های build
ls -la .next/server/app/chat/page.js
ls -la .next/server/components/chat/quick-buy-chat.js
```

## نتیجه‌های مورد انتظار

### ✅ موفق:
- لاگ‌های Console نمایش داده می‌شوند
- Toast ها نمایش داده می‌شوند
- Permission popup نمایش داده می‌شود
- توابع فراخوانی می‌شوند

### ❌ ناموفق:
- هیچ لاگی در Console نیست → تغییرات pull/restart نشده
- لاگ Paperclip هست اما Location/Voice نیست → مشکل از render دکمه‌ها
- همه لاگ‌ها هست اما تابع کار نمی‌کند → مشکل از geolocation/microphone

## گزارش مشکل

اگر مشکل حل نشد، این اطلاعات را بفرست:
1. **آخرین commit:** `git log --oneline -1`
2. **PM2 status:** `pm2 status`
3. **Console logs:** تمام لاگ‌های Console را کپی کن
4. **مرورگر:** نام و نسخه مرورگر
5. **HTTPS:** آیا سایت روی HTTPS است؟
6. **سوال:** آیا لاگ `[Paperclip] Button clicked!` را می‌بینی؟

