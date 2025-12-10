#!/bin/bash

# اسکریپت ساده برای رفع مشکل دسترسی دیتابیس
# این اسکریپت پسورد را مستقیماً در دستور می‌گذارد (برای استفاده راحت‌تر)

cd ~/public_html/saded

echo "🔧 رفع مشکل دسترسی دیتابیس MySQL..."
echo ""

# پسورد root - اگر می‌خواهید تغییر دهید، اینجا تغییر دهید
ROOT_PASSWORD="goul77191336"

# بررسی وجود فایل SQL
if [ ! -f "fix-db-permissions.sql" ]; then
    echo "❌ فایل fix-db-permissions.sql موجود نیست!"
    echo "   Pull کردن از Git..."
    git pull origin main
fi

echo "1️⃣ اجرای دستورات SQL..."
echo ""

# اجرای دستورات SQL با پسورد
mysql -u root -p"$ROOT_PASSWORD" < fix-db-permissions.sql 2>&1

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo ""
    echo "✅ دستورات SQL با موفقیت اجرا شدند!"
    echo ""
    
    # تست اتصال
    echo "2️⃣ تست اتصال..."
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
    
    if [ -f "scripts/test-mysql-connection.js" ]; then
        /opt/alt/alt-nodejs20/root/usr/bin/node scripts/test-mysql-connection.js
    fi
    
    echo ""
    echo "3️⃣ تست API..."
    curl -s http://localhost:3001/api/categories | head -c 200 && echo "" || echo "   ❌ خطا"
    
    echo ""
    echo "4️⃣ Restart PM2..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
    
    echo ""
    echo "✅ تمام مراحل با موفقیت انجام شد!"
else
    echo ""
    echo "❌ خطا در اجرای دستورات SQL!"
    echo ""
    echo "💡 ممکن است پسورد root اشتباه باشد."
    echo "   لطفاً فایل HOST-FIX-DB-SIMPLE.sh را باز کنید و پسورد را تغییر دهید."
    echo "   یا دستی اجرا کنید:"
    echo "   mysql -u root -p"
    echo "   source fix-db-permissions.sql"
fi

