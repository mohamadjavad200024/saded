#!/bin/bash

# اسکریپت رفع مشکل دسترسی (فقط GRANT - بدون ایجاد کاربر/دیتابیس)

cd ~/public_html/saded

echo "🔧 رفع مشکل دسترسی دیتابیس (فقط GRANT)..."
echo ""

# خواندن اطلاعات از ecosystem.config.js
DB_USER=$(grep -A 10 "DB_USER" ecosystem.config.js | grep "DB_USER" | head -1 | sed "s/.*DB_USER: '\(.*\)'.*/\1/")
DB_PASSWORD=$(grep -A 10 "DB_PASSWORD" ecosystem.config.js | grep "DB_PASSWORD" | head -1 | sed "s/.*DB_PASSWORD: '\(.*\)'.*/\1/")
DB_NAME=$(grep -A 10 "DB_NAME" ecosystem.config.js | grep "DB_NAME" | head -1 | sed "s/.*DB_NAME: '\(.*\)'.*/\1/")
DB_HOST=$(grep -A 10 "DB_HOST" ecosystem.config.js | grep "DB_HOST" | head -1 | sed "s/.*DB_HOST: '\(.*\)'.*/\1/")

echo "📋 اطلاعات:"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo "   Host: $DB_HOST"
echo ""

# ایجاد فایل SQL موقت فقط برای GRANT
TEMP_SQL=$(mktemp)
cat > "$TEMP_SQL" << EOF
-- فقط دادن دسترسی (بدون ایجاد کاربر/دیتابیس)
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;

-- بررسی دسترسی‌ها
SHOW GRANTS FOR '$DB_USER'@'localhost';
EOF

echo "1️⃣ تلاش برای دادن دسترسی..."
echo "   (نیاز به دسترسی root یا کاربر با دسترسی GRANT)"
echo ""

# روش 1: با کاربر cPanel
CPANEL_USER=$(whoami)
echo "   تلاش با کاربر cPanel: $CPANEL_USER"
mysql -u "$CPANEL_USER" -p"$DB_PASSWORD" < "$TEMP_SQL" 2>&1

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo ""
    echo "   ⚠️  با کاربر cPanel موفق نشد"
    echo ""
    echo "2️⃣ راه حل: استفاده از cPanel"
    echo ""
    echo "   لطفاً در cPanel:"
    echo "   1. بخش 'MySQL Databases' را باز کنید"
    echo "   2. کاربر '$DB_USER' را پیدا کنید"
    echo "   3. دیتابیس '$DB_NAME' را پیدا کنید"
    echo "   4. در بخش 'Add User To Database':"
    echo "      - کاربر '$DB_USER' را انتخاب کنید"
    echo "      - دیتابیس '$DB_NAME' را انتخاب کنید"
    echo "      - روی 'Add' کلیک کنید"
    echo "   5. در صفحه بعدی:"
    echo "      - 'ALL PRIVILEGES' را انتخاب کنید"
    echo "      - روی 'Make Changes' کلیک کنید"
    echo ""
else
    echo ""
    echo "   ✅ دسترسی‌ها با موفقیت اعمال شدند!"
    echo ""
    
    # تست
    echo "3️⃣ تست اتصال..."
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
    
    if [ -f "scripts/test-mysql-connection.js" ]; then
        /opt/alt/alt-nodejs20/root/usr/bin/node scripts/test-mysql-connection.js
    fi
    
    echo ""
    echo "4️⃣ تست API..."
    curl -s http://localhost:3001/api/categories | head -c 200 && echo "" || echo "   ❌ خطا"
    
    echo ""
    echo "5️⃣ Restart PM2..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
fi

# پاک کردن فایل موقت
rm -f "$TEMP_SQL"

echo ""
echo "✅ بررسی کامل شد"

