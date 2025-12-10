#!/bin/bash

# اسکریپت رفع مشکل دسترسی دیتابیس با کاربر cPanel

cd ~/public_html/saded

echo "🔧 رفع مشکل دسترسی دیتابیس MySQL با کاربر cPanel..."
echo ""

# نام کاربری cPanel (معمولاً همان نام کاربری SSH)
CPANEL_USER=$(whoami)
echo "📋 نام کاربری cPanel: $CPANEL_USER"
echo ""

# بررسی وجود فایل SQL
if [ ! -f "fix-db-permissions.sql" ]; then
    echo "❌ فایل fix-db-permissions.sql موجود نیست!"
    echo "   Pull کردن از Git..."
    git pull origin main
fi

echo "💡 این اسکریپت از کاربر cPanel شما ($CPANEL_USER) برای اتصال استفاده می‌کند."
echo "   اگر این کاربر دسترسی root ندارد، باید از cPanel استفاده کنید."
echo ""

# روش 1: تلاش با کاربر cPanel
echo "1️⃣ تلاش برای اتصال با کاربر cPanel..."
echo "   (اگر از شما پسورد خواست، رمز cPanel را وارد کنید)"
echo ""

read -sp "رمز cPanel را وارد کنید (یا Enter برای skip): " CPANEL_PASSWORD
echo ""

if [ -z "$CPANEL_PASSWORD" ]; then
    echo "⚠️  پسورد وارد نشد. استفاده از روش cPanel..."
    echo ""
    echo "📋 لطفاً از cPanel استفاده کنید:"
    echo "   1. وارد cPanel شوید"
    echo "   2. بخش 'MySQL Databases' را باز کنید"
    echo "   3. کاربر 'shop1111_saded_user' را ایجاد کنید (اگر وجود ندارد)"
    echo "   4. دیتابیس 'shop1111_saded' را ایجاد کنید (اگر وجود ندارد)"
    echo "   5. کاربر را به دیتابیس متصل کنید و 'ALL PRIVILEGES' بدهید"
    echo ""
    exit 0
fi

# اجرای دستورات SQL
mysql -u "$CPANEL_USER" -p"$CPANEL_PASSWORD" < fix-db-permissions.sql 2>&1

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
    echo "💡 این خطا ممکن است به این دلایل باشد:"
    echo "   1. کاربر cPanel دسترسی root ندارد"
    echo "   2. پسورد اشتباه است"
    echo ""
    echo "📋 راه حل: از cPanel استفاده کنید"
    echo "   1. وارد cPanel شوید"
    echo "   2. بخش 'MySQL Databases' را باز کنید"
    echo "   3. کاربر 'shop1111_saded_user' را ایجاد/بررسی کنید"
    echo "   4. دیتابیس 'shop1111_saded' را ایجاد/بررسی کنید"
    echo "   5. کاربر را به دیتابیس متصل کنید و 'ALL PRIVILEGES' بدهید"
    echo ""
    echo "   یا از phpMyAdmin استفاده کنید و دستورات SQL را اجرا کنید"
fi

# پاک کردن پسورد از حافظه
unset CPANEL_PASSWORD

