#!/bin/bash

# اسکریپت رفع مشکل static files و دسترسی دیتابیس

cd ~/public_html/saded

echo "🔧 رفع مشکل static files و دسترسی دیتابیس..."
echo ""

# 1. Pull تغییرات جدید
echo "1️⃣ Pull تغییرات جدید..."
git pull origin main
echo ""

# 2. بررسی BUILD_ID جدید
echo "2️⃣ بررسی BUILD_ID جدید..."
if [ -f ".next/BUILD_ID" ]; then
    NEW_BUILD_ID=$(cat .next/BUILD_ID)
    echo "   ✅ BUILD_ID جدید: $NEW_BUILD_ID"
    
    # بررسی وجود فولدر static جدید
    if [ -d ".next/static/$NEW_BUILD_ID" ]; then
        echo "   ✅ فولدر static جدید موجود است"
    else
        echo "   ❌ فولدر static جدید موجود نیست!"
        echo "   🔄 دریافت از Git..."
        git checkout HEAD -- .next/static/$NEW_BUILD_ID/ 2>&1 | head -10
    fi
else
    echo "   ❌ BUILD_ID موجود نیست!"
fi
echo ""

# 3. بررسی فایل chunk مشکل‌دار
echo "3️⃣ بررسی فایل chunk مشکل‌دار..."
CHUNK_FILE="74aa774f10f47768.js"
if [ -f ".next/static/chunks/$CHUNK_FILE" ]; then
    echo "   ✅ فایل chunk موجود است"
else
    echo "   ❌ فایل chunk موجود نیست!"
    echo "   🔄 دریافت از Git..."
    git checkout HEAD -- .next/static/chunks/$CHUNK_FILE 2>&1
fi
echo ""

# 4. بررسی دسترسی دیتابیس
echo "4️⃣ بررسی دسترسی دیتابیس..."
echo "   💡 برای رفع مشکل دسترسی، از cPanel استفاده کنید:"
echo "   1. وارد cPanel شوید"
echo "   2. بخش 'MySQL Databases' را باز کنید"
echo "   3. کاربر 'shop1111_saded_user' را پیدا کنید"
echo "   4. دیتابیس 'shop1111_saded' را پیدا کنید"
echo "   5. در بخش 'Add User To Database':"
echo "      - کاربر 'shop1111_saded_user' را انتخاب کنید"
echo "      - دیتابیس 'shop1111_saded' را انتخاب کنید"
echo "      - روی 'Add' کلیک کنید"
echo "   6. در صفحه بعدی:"
echo "      - 'ALL PRIVILEGES' را انتخاب کنید"
echo "      - روی 'Make Changes' کلیک کنید"
echo ""

# 5. Restart PM2
echo "5️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
echo ""

# 6. بررسی وضعیت
echo "6️⃣ بررسی وضعیت..."
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 7. تست API
echo "7️⃣ تست API..."
echo "   📡 تست /api/categories:"
curl -s http://localhost:3001/api/categories | head -c 200 && echo "" || echo "   ❌ خطا"
echo ""

echo "   📡 تست /api/products:"
curl -s "http://localhost:3001/api/products?limit=1" | head -c 200 && echo "" || echo "   ❌ خطا"
echo ""

echo "✅ بررسی کامل شد"

