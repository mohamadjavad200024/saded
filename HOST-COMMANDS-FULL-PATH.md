# دستورات کامل دپلوی با مسیرهای کامل هاست

## دستورات تک‌تک برای کپی و پیست:

```bash
# فعال‌سازی محیط مجازی Node.js
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# 1. حل مشکل Git - Stash کردن تغییرات محلی
git stash

# 2. Pull کردن تغییرات جدید
git pull origin main

# 3. نصب PM2 (اگر نصب نشده)
npm install -g pm2

# 4. بیلد پروژه
npm run build

# 5. راه‌اندازی PM2
pm2 restart ecosystem.config.js
# یا اگر PM2 راه‌اندازی نشده:
# pm2 start ecosystem.config.js

# 6. ذخیره تنظیمات PM2
pm2 save

# 7. بررسی وضعیت
pm2 status
```

## دستورات به صورت یک خط (برای کپی سریع):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate && cd /home/shop1111/public_html/saded && git stash && git pull origin main && npm install -g pm2 && npm run build && pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js && pm2 save && pm2 status
```

## اگر Git Pull خطا داد (فایل‌های مشکل‌دار):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# حذف فایل‌های مشکل‌دار
rm -f HOST-FIX-503-COMPLETE.sh HOST-FIX-503-URGENT.sh

# Pull مجدد
git pull origin main

# ادامه مراحل
npm install -g pm2
npm run build
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

## دستورات مدیریت PM2:

```bash
# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# بررسی وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs saded --lines 50

# راه‌اندازی مجدد
pm2 restart saded

# توقف
pm2 stop saded

# شروع
pm2 start ecosystem.config.js

# حذف
pm2 delete saded

# بررسی استفاده از منابع
pm2 monit
```

## دستورات عیب‌یابی:

```bash
cd /home/shop1111/public_html/saded

# بررسی خطاهای Build
npm run build 2>&1 | tee build-errors.log

# بررسی لاگ‌های PM2
pm2 logs saded --err --lines 100

# بررسی پورت
netstat -tulpn | grep :3000

# تست دستی سرور
node server.js
```

## نکات مهم:

1. **مسیر پروژه**: `/home/shop1111/public_html/saded`
2. **محیط مجازی**: `/home/shop1111/nodevenv/public_html/saded/20/bin/activate`
3. **پورت پیش‌فرض**: 3000 (مطمئن شوید در فایل `.env` یا `ecosystem.config.js` تنظیم شده)
4. **PM2 Config**: `ecosystem.config.js` در مسیر پروژه

## اگر Build خطا داد:

```bash
cd /home/shop1111/public_html/saded

# پاک کردن cache
rm -rf .next

# بیلد مجدد
npm run build
```

