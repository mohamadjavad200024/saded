# رفع مشکلات سرور

## مشکل 1: Git Pull خطا می‌دهد

فایل‌های محلی تغییر کرده‌اند. باید آن‌ها را stash یا حذف کنیم:

```bash
# گزینه 1: Stash کردن تغییرات محلی
git stash

# سپس pull کنید
git pull origin main

# گزینه 2: حذف فایل‌های مشکل‌دار (این فایل‌ها باید حذف شده باشند)
git checkout -- HOST-FIX-503-COMPLETE.sh HOST-FIX-503-URGENT.sh
# یا
rm -f HOST-FIX-503-COMPLETE.sh HOST-FIX-503-URGENT.sh

# سپس pull کنید
git pull origin main
```

## مشکل 2: خطای Syntax در فایل‌های Chat

خطا می‌گوید در فایل‌های chat مشکل syntax وجود دارد. بعد از pull، باید این خطاها را برطرف کنیم.

## مشکل 3: PM2 نصب نشده

```bash
# نصب PM2 به صورت global
npm install -g pm2

# یا استفاده از npx
npx pm2 start ecosystem.config.js
```

## دستورات کامل برای اجرا:

```bash
# 1. Stash یا حذف تغییرات محلی
git stash
# یا
rm -f HOST-FIX-503-COMPLETE.sh HOST-FIX-503-URGENT.sh

# 2. Pull تغییرات
git pull origin main

# 3. بررسی خطاهای syntax (بعد از pull)
# اگر هنوز خطا داشت، باید فایل‌ها را بررسی کنیم

# 4. نصب PM2
npm install -g pm2

# 5. بیلد مجدد
npm run build

# 6. راه‌اندازی PM2
pm2 start ecosystem.config.js
pm2 save
```

