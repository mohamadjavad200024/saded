# بررسی لاگ‌های PM2 برای مشکل لود نشدن صفحه

## دستورات بررسی:

```bash
# 1. بررسی لاگ‌های خطا
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50 --err

# 2. بررسی لاگ‌های خروجی
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50 --out

# 3. بررسی کامل لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 100

# 4. بررسی وجود فایل BUILD_ID
ls -la .next/BUILD_ID

# 5. بررسی وجود پوشه‌های بیلد
ls -la .next/static/ | head -20
ls -la .next/server/ | head -20
```

## مشکلات احتمالی:

1. **فایل‌های بیلد آپلود نشده** - باید فایل‌های `.next/BUILD_ID`, `.next/static/` و `.next/server/` را آپلود کنید
2. **خطای بیلد** - ممکن است بیلد در هاست نیاز باشد
3. **خطای دیتابیس** - ممکن است مشکل اتصال به دیتابیس باشد
4. **خطای پورت** - ممکن است پورت در دسترس نباشد

## راه حل:

ابتدا لاگ‌ها را بررسی کنید و خطا را پیدا کنید.

