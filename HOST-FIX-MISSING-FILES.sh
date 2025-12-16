#!/bin/bash

# اسکریپت برای رفع مشکل فایل‌های گم‌شده در هاست
# این اسکریپت فایل‌های ضروری را بررسی و pull می‌کند

echo "=========================================="
echo "🔧 بررسی و رفع فایل‌های گم‌شده..."
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

# 1. Stop PM2
echo ""
echo "1️⃣ Stop کردن PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded 2>/dev/null
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded 2>/dev/null
echo "✅ PM2 stopped"

# 2. حذف فایل‌های قدیمی .next که ممکن است conflict ایجاد کنند
echo ""
echo "2️⃣ حذف فایل‌های قدیمی .next..."
rm -rf .next/routes-manifest.json
rm -rf .next/app-path-routes-manifest.json
rm -rf .next/required-server-files.json
rm -rf .next/prerender-manifest.json
rm -rf .next/images-manifest.json
rm -rf .next/build-manifest.json
rm -rf .next/fallback-build-manifest.json
rm -rf .next/export-marker.json
rm -rf .next/BUILD_ID
echo "✅ Old files removed"

# 3. Hard reset برای دریافت فایل‌های جدید
echo ""
echo "3️⃣ Hard reset برای دریافت فایل‌های جدید..."
git fetch origin main
git reset --hard origin/main
echo "✅ Git reset completed"

# 4. بررسی فایل‌های ضروری
echo ""
echo "4️⃣ بررسی فایل‌های ضروری..."
MISSING_FILES=0

if [ ! -f ".next/routes-manifest.json" ]; then
    echo "❌ .next/routes-manifest.json missing!"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo "✅ .next/routes-manifest.json exists"
fi

if [ ! -f ".next/BUILD_ID" ]; then
    echo "❌ .next/BUILD_ID missing!"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    echo "✅ .next/BUILD_ID exists"
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "   BUILD_ID: $BUILD_ID"
fi

if [ ! -d ".next/server" ]; then
    echo "❌ .next/server/ missing!"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    SERVER_COUNT=$(find .next/server -type f | wc -l)
    echo "✅ .next/server/ exists ($SERVER_COUNT files)"
fi

if [ ! -d ".next/static" ]; then
    echo "❌ .next/static/ missing!"
    MISSING_FILES=$((MISSING_FILES + 1))
else
    STATIC_COUNT=$(find .next/static -type f | wc -l)
    echo "✅ .next/static/ exists ($STATIC_COUNT files)"
fi

if [ $MISSING_FILES -gt 0 ]; then
    echo ""
    echo "⚠️  Warning: $MISSING_FILES essential file(s) are missing!"
    echo "   You may need to run 'npm run build' locally and push again."
else
    echo ""
    echo "✅ All essential files are present!"
fi

# 5. Start PM2
echo ""
echo "5️⃣ Start کردن PM2..."
if [ -f "ecosystem.config.js" ]; then
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
else
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
fi
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
echo "✅ PM2 started"

# 6. صبر برای راه‌اندازی
echo ""
echo "6️⃣ صبر برای راه‌اندازی..."
sleep 5

# 7. بررسی وضعیت نهایی
echo ""
echo "7️⃣ بررسی وضعیت نهایی..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "✅ Done!"
echo "=========================================="
echo ""
echo "💡 اگر هنوز خطا دارید:"
echo "   1. بررسی لاگ: /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50"
echo "   2. بررسی فایل‌ها: ls -la .next/routes-manifest.json"
echo "   3. بررسی BUILD_ID: cat .next/BUILD_ID"
echo ""

