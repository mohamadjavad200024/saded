#!/bin/bash

# اسکریپت رفع دستی مشکل دسترسی دیتابیس MySQL

cd ~/public_html/saded

echo "🔧 رفع دستی مشکل دسترسی دیتابیس MySQL..."
echo ""

# 1. بررسی وجود فایل SQL
if [ ! -f "fix-db-permissions.sql" ]; then
    echo "❌ فایل fix-db-permissions.sql موجود نیست!"
    echo "   Pull کردن از Git..."
    git pull origin main
fi

echo "1️⃣ فایل SQL آماده است: fix-db-permissions.sql"
echo ""

# 2. راهنمای اجرا
echo "2️⃣ برای اجرای دستورات، یکی از روش‌های زیر را انتخاب کنید:"
echo ""
echo "   روش 1: اجرای مستقیم (پیشنهادی)"
echo "   ================================="
echo "   mysql -u root -p < fix-db-permissions.sql"
echo "   (رمز root را وارد کنید)"
echo ""
echo "   روش 2: اجرای دستی در MySQL"
echo "   ==========================="
echo "   mysql -u root -p"
echo "   (رمز root را وارد کنید)"
echo "   سپس دستورات زیر را اجرا کنید:"
echo ""
cat fix-db-permissions.sql | grep -v "^--" | grep -v "^$" | head -20
echo "   ..."
echo ""
echo "   یا از دستور source استفاده کنید:"
echo "   source fix-db-permissions.sql"
echo ""

# 3. تست بعد از اجرا
echo "3️⃣ بعد از اجرای دستورات، این دستورات را اجرا کنید:"
echo ""
echo "   # تست اتصال"
echo "   export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH"
echo "   /opt/alt/alt-nodejs20/root/usr/bin/node scripts/test-mysql-connection.js"
echo ""
echo "   # تست API"
echo "   curl -s http://localhost:3001/api/categories | head -c 200"
echo ""
echo "   # Restart PM2"
echo "   /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded"
echo ""

echo "✅ راهنما آماده است!"

