#!/bin/bash

# اسکریپت بررسی وضعیت دیتابیس و کاربر

cd ~/public_html/saded

echo "🔍 بررسی وضعیت دیتابیس و کاربر MySQL..."
echo ""

# خواندن اطلاعات از ecosystem.config.js
DB_USER=$(grep -A 10 "DB_USER" ecosystem.config.js | grep "DB_USER" | head -1 | sed "s/.*DB_USER: '\(.*\)'.*/\1/")
DB_PASSWORD=$(grep -A 10 "DB_PASSWORD" ecosystem.config.js | grep "DB_PASSWORD" | head -1 | sed "s/.*DB_PASSWORD: '\(.*\)'.*/\1/")
DB_NAME=$(grep -A 10 "DB_NAME" ecosystem.config.js | grep "DB_NAME" | head -1 | sed "s/.*DB_NAME: '\(.*\)'.*/\1/")
DB_HOST=$(grep -A 10 "DB_HOST" ecosystem.config.js | grep "DB_HOST" | head -1 | sed "s/.*DB_HOST: '\(.*\)'.*/\1/")

echo "📋 اطلاعات از ecosystem.config.js:"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST"
echo ""

# تلاش برای اتصال و بررسی
echo "1️⃣ تلاش برای اتصال..."
mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SELECT 1" 2>&1 | head -5

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo "   ✅ اتصال موفق است!"
    echo ""
    
    echo "2️⃣ بررسی دسترسی‌ها..."
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SHOW GRANTS FOR '$DB_USER'@'localhost';" 2>&1 | head -10
    
    echo ""
    echo "3️⃣ بررسی دیتابیس..."
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SHOW DATABASES LIKE '$DB_NAME';" 2>&1
    
    echo ""
    echo "4️⃣ تست دسترسی به دیتابیس..."
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" -e "SELECT DATABASE(), USER();" 2>&1
    
else
    echo "   ❌ اتصال ناموفق"
    echo ""
    echo "💡 مشکل احتمالی:"
    echo "   1. رمز عبور اشتباه است"
    echo "   2. کاربر دسترسی ندارد"
    echo "   3. کاربر یا دیتابیس وجود ندارد"
    echo ""
    echo "🔧 راه حل:"
    echo "   در cPanel، بخش 'MySQL Databases' را باز کنید و:"
    echo "   1. کاربر '$DB_USER' را بررسی کنید"
    echo "   2. دیتابیس '$DB_NAME' را بررسی کنید"
    echo "   3. مطمئن شوید کاربر به دیتابیس متصل است"
    echo "   4. دسترسی 'ALL PRIVILEGES' را بررسی کنید"
fi

echo ""
echo "✅ بررسی کامل شد"

