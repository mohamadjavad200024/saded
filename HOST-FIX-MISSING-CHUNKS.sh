#!/bin/bash

# اسکریپت رفع مشکل فایل‌های chunk missing

cd ~/public_html/saded

echo "🔧 رفع مشکل فایل‌های chunk missing..."
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

# 3. بررسی و دریافت فایل‌های chunk مشکل‌دار
echo "3️⃣ بررسی و دریافت فایل‌های chunk مشکل‌دار..."
MISSING_CHUNKS=(
    "000dc55179d81dcd.js"
    "8a41d744cf72c422.js"
    "94b1d486b59cb87f.js"
    "5fb36e8752ecf65f.js"
)

for chunk in "${MISSING_CHUNKS[@]}"; do
    if [ ! -f ".next/static/chunks/$chunk" ]; then
        echo "   ❌ فایل $chunk موجود نیست!"
        echo "   🔄 دریافت از Git..."
        git checkout HEAD -- .next/static/chunks/$chunk 2>&1 | head -5
    else
        echo "   ✅ فایل $chunk موجود است"
    fi
done
echo ""

# 4. دریافت تمام فایل‌های chunks از Git (برای اطمینان)
echo "4️⃣ دریافت تمام فایل‌های chunks از Git..."
git checkout HEAD -- .next/static/chunks/*.js 2>&1 | head -10
echo ""

# 5. بررسی فایل‌های manifest
echo "5️⃣ بررسی فایل‌های manifest..."
if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    MANIFEST_FILES=(
        ".next/static/$BUILD_ID/_buildManifest.js"
        ".next/static/$BUILD_ID/_clientMiddlewareManifest.json"
        ".next/static/$BUILD_ID/_ssgManifest.js"
    )
    
    for manifest in "${MANIFEST_FILES[@]}"; do
        if [ ! -f "$manifest" ]; then
            echo "   ❌ فایل $manifest موجود نیست!"
            echo "   🔄 دریافت از Git..."
            git checkout HEAD -- "$manifest" 2>&1
        else
            echo "   ✅ فایل $manifest موجود است"
        fi
    done
fi
echo ""

# 6. Restart PM2
echo "6️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
echo ""

# 7. بررسی وضعیت
echo "7️⃣ بررسی وضعیت..."
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 8. تست فایل‌های chunk
echo "8️⃣ تست فایل‌های chunk..."
for chunk in "${MISSING_CHUNKS[@]}"; do
    if [ -f ".next/static/chunks/$chunk" ]; then
        echo "   ✅ $chunk موجود است ($(stat -c%s .next/static/chunks/$chunk 2>/dev/null || echo 'unknown') bytes)"
    else
        echo "   ❌ $chunk هنوز موجود نیست!"
    fi
done
echo ""

echo "✅ بررسی کامل شد"

