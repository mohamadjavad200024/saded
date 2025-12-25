#!/bin/bash
# دستورات کامل دپلوی با مسیرهای کامل

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
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# 6. ذخیره تنظیمات PM2
pm2 save

# 7. بررسی وضعیت
pm2 status

echo "=========================================="
echo "دپلوی با موفقیت انجام شد!"
echo "=========================================="

