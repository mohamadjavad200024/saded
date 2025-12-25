#!/bin/bash
# اسکریپت دپلوی برای سرور

echo "=========================================="
echo "شروع فرآیند دپلوی"
echo "=========================================="

# فعال‌سازی محیط مجازی Node.js
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

echo "1. Pull کردن تغییرات از Git..."
git pull origin main || git pull origin master

echo "2. نصب Dependencies..."
npm install --production

echo "3. بیلد پروژه..."
npm run build

echo "4. راه‌اندازی مجدد PM2..."
pm2 restart ecosystem.config.js || pm2 restart server.js --name "saded" || pm2 start ecosystem.config.js

echo "5. بررسی وضعیت..."
pm2 status

echo "=========================================="
echo "دپلوی با موفقیت انجام شد!"
echo "=========================================="

