# راهنمای رفع مشکل "Resource temporarily unavailable"

## مشکل
خطای `Resource temporarily unavailable` یعنی سرور overload شده و نمی‌تواند process جدید بسازد.

## راه حل‌های ساده

### راه حل 1: صبر کردن (پیشنهادی)
```bash
# صبر کن 2-3 دقیقه
# بعد دوباره تلاش کن
cd ~/public_html/saded
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی کن که PM2 در حال اجرا است
pm2 list

# اگر PM2 در حال اجرا است، فقط restart کن
pm2 restart saded --update-env
```

### راه حل 2: استفاده از PM2 که قبلاً نصب شده
```bash
cd ~/public_html/saded
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# اگر PM2 در PATH است
pm2 restart saded --update-env

# یا استفاده از full path
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

### راه حل 3: بررسی وضعیت فعلی
```bash
# بررسی کن که PM2 در حال اجرا است
pm2 list

# بررسی لاگ‌ها
pm2 logs saded --lines 20

# اگر process در حال اجرا است، نیازی به restart نیست
# فقط Hard Refresh مرورگر کن: Ctrl+Shift+R
```

### راه حل 4: استفاده از اسکریپت ساده
```bash
cd ~/public_html/saded
chmod +x HOST-RESTART-SIMPLE.sh
./HOST-RESTART-SIMPLE.sh
```

## نکات مهم

1. **اگر PM2 در حال اجرا است:**
   - نیازی به restart نیست
   - فقط Hard Refresh مرورگر کن: `Ctrl+Shift+R`
   - تغییرات باید اعمال شوند

2. **اگر PM2 متوقف شده:**
   - صبر کن 2-3 دقیقه
   - بعد دوباره تلاش کن
   - یا از اسکریپت ساده استفاده کن

3. **بررسی تغییرات:**
   - فایل‌های تغییر یافته موجود هستند
   - کد درست است
   - فقط باید PM2 restart شود یا مرورگر Hard Refresh شود

## تست بعد از رفع مشکل

1. **Hard Refresh مرورگر:** `Ctrl+Shift+R`
2. **باز کردن Console:** `F12` → Console
3. **کلیک روی Paperclip:** باید لاگ `[Paperclip] Button clicked!` را ببینی
4. **کلیک روی Location/Voice:** باید لاگ‌های مربوطه را ببینی

