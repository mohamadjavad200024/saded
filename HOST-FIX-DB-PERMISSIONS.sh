#!/bin/bash

# اسکریپت رفع مشکل دسترسی دیتابیس MySQL روی هاست

cd ~/public_html/saded

echo "🔧 رفع مشکل دسترسی دیتابیس MySQL..."
echo ""

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# 1. بررسی اطلاعات دیتابیس از ecosystem.config.js
echo "1️⃣ بررسی اطلاعات دیتابیس..."
DB_USER=$(grep -A 10 "DB_USER" ecosystem.config.js | grep "DB_USER" | head -1 | sed "s/.*DB_USER: '\(.*\)'.*/\1/")
DB_PASSWORD=$(grep -A 10 "DB_PASSWORD" ecosystem.config.js | grep "DB_PASSWORD" | head -1 | sed "s/.*DB_PASSWORD: '\(.*\)'.*/\1/")
DB_NAME=$(grep -A 10 "DB_NAME" ecosystem.config.js | grep "DB_NAME" | head -1 | sed "s/.*DB_NAME: '\(.*\)'.*/\1/")
DB_HOST=$(grep -A 10 "DB_HOST" ecosystem.config.js | grep "DB_HOST" | head -1 | sed "s/.*DB_HOST: '\(.*\)'.*/\1/")

echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST"
echo ""

# 2. تست اتصال با mysql command
echo "2️⃣ تست اتصال با MySQL..."
if command -v mysql &> /dev/null; then
    # Try to connect and test
    mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" "$DB_NAME" -e "SELECT 1" 2>&1 | head -5
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "   ✅ اتصال موفق است!"
    else
        echo "   ❌ اتصال ناموفق"
        echo ""
        echo "3️⃣ تلاش برای رفع مشکل..."
        echo ""
        echo "   💡 برای رفع مشکل، باید دستورات زیر را در MySQL اجرا کنید:"
        echo ""
        echo "   mysql -u root -p"
        echo "   (رمز root را وارد کنید)"
        echo ""
        echo "   سپس دستورات زیر را اجرا کنید:"
        echo ""
        echo "   CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        echo "   CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
        echo "   CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';"
        echo "   GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';"
        echo "   GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'%';"
        echo "   FLUSH PRIVILEGES;"
        echo "   EXIT;"
        echo ""
        echo "   یا از اسکریپت Node.js استفاده کنید:"
        echo "   node scripts/fix-mysql-permissions.js"
    fi
else
    echo "   ⚠️  mysql command not found"
    echo "   💡 Using Node.js script instead..."
    echo ""
    
    # 3. اجرای اسکریپت Node.js
    if [ -f "scripts/fix-mysql-permissions.js" ]; then
        echo "3️⃣ اجرای اسکریپت Node.js..."
        /opt/alt/alt-nodejs20/root/usr/bin/node scripts/fix-mysql-permissions.js
    else
        echo "   ❌ اسکریپت fix-mysql-permissions.js موجود نیست"
        echo "   💡 Pull کردن از Git..."
        git pull origin main
        if [ -f "scripts/fix-mysql-permissions.js" ]; then
            /opt/alt/alt-nodejs20/root/usr/bin/node scripts/fix-mysql-permissions.js
        fi
    fi
fi

echo ""
echo "4️⃣ تست API..."
sleep 2
curl -s http://localhost:3001/api/categories | head -c 200 && echo "" || echo "   ❌ خطا"

echo ""
echo "✅ بررسی کامل شد"

