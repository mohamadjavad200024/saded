#!/bin/bash

# اسکریپت رفع خطای 503

echo "🔧 رفع خطای 503..."
echo ""

cd ~/public_html/saded

# 1. بررسی وجود BUILD_ID
echo "1️⃣ بررسی BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
    echo "   ✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "   ❌ BUILD_ID موجود نیست!"
    echo "   ⚠️  باید rebuild کنید یا از Git pull کنید"
fi
echo ""

# 2. بررسی فایل‌های manifest
echo "2️⃣ بررسی Manifest Files:"
for file in "routes-manifest.json" "build-manifest.json" "prerender-manifest.json" "required-server-files.json"; do
    if [ -f ".next/$file" ]; then
        echo "   ✅ $file موجود است"
    else
        echo "   ❌ $file موجود نیست!"
    fi
done
echo ""

# 3. بررسی جدول users در دیتابیس
echo "3️⃣ بررسی جدول users در دیتابیس:"
echo "   (این بررسی نیاز به دسترسی دیتابیس دارد)"
echo ""

# 4. بررسی لاگ‌های PM2
echo "4️⃣ آخرین خطاهای PM2:"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 5 --err --nostream | tail -10
echo ""

echo "✅ بررسی کامل شد!"
echo ""
echo "💡 راه حل:"
echo "   1. روی کامپیوتر محلی: npm run build"
echo "   2. Commit فایل‌های .next"
echo "   3. Push به GitHub"
echo "   4. روی هاست: git pull && pm2 restart saded"


