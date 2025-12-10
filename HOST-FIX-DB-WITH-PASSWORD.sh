#!/bin/bash

# اسکریپت رفع مشکل دسترسی دیتابیس با پسورد root

cd ~/public_html/saded

echo "🔧 رفع مشکل دسترسی دیتابیس MySQL..."
echo ""

# خواندن پسورد root از کاربر
echo "⚠️  برای اجرای این اسکریپت، نیاز به پسورد root MySQL دارید."
echo ""
read -sp "لطفاً پسورد root MySQL را وارد کنید: " ROOT_PASSWORD
echo ""

if [ -z "$ROOT_PASSWORD" ]; then
    echo "❌ پسورد وارد نشد!"
    exit 1
fi

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
    echo "💡 ممکن است پسورد root اشتباه باشد یا دسترسی لازم را نداشته باشید."
    echo "   لطفاً دستی اجرا کنید:"
    echo "   mysql -u root -p"
    echo "   source fix-db-permissions.sql"
fi

# پاک کردن پسورد از حافظه
unset ROOT_PASSWORD

