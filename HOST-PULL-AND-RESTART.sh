#!/bin/bash

# اسکریپت کامل برای pull و restart PM2 در هاست

echo "=========================================="
echo "🔄 Pull and Restart Script"
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# 1. Pull تغییرات
echo ""
echo "1️⃣ Pulling latest changes from Git..."
echo "=========================================="

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "Current branch: $CURRENT_BRANCH"

git pull origin $CURRENT_BRANCH

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed, but continuing..."
fi

# 2. بررسی فایل‌های بیلد
echo ""
echo "2️⃣ Checking build files..."
echo "=========================================="

if [ -d ".next/server" ] && [ -d ".next/static" ] && [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "✅ Build files exist (BUILD_ID: $BUILD_ID)"
else
    echo "⚠️  Warning: Some build files are missing!"
fi

# 3. بررسی فایل‌های API جدید
echo ""
echo "3️⃣ Checking new API files..."
echo "=========================================="

if [ -f ".next/server/app/api/auth/debug-db/route.js" ]; then
    echo "✅ debug-db API exists"
else
    echo "❌ debug-db API missing!"
fi

if [ -f ".next/server/app/api/auth/cleanup-db/route.js" ]; then
    echo "✅ cleanup-db API exists"
else
    echo "❌ cleanup-db API missing!"
fi

if [ -f ".next/server/app/api/auth/test-phone/route.js" ]; then
    echo "✅ test-phone API exists"
else
    echo "❌ test-phone API missing!"
fi

# 4. Restart PM2
echo ""
echo "4️⃣ Restarting PM2..."
echo "=========================================="

# Stop و Delete برای اطمینان از restart کامل
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded 2>/dev/null
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded 2>/dev/null

# بررسی وضعیت PM2
PM2_STATUS=$(/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 jlist 2>/dev/null | grep -o '"name":"saded"' || echo "")

if [ -n "$PM2_STATUS" ]; then
    echo "⚠️  Process still exists, forcing delete..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded 2>/dev/null
fi

echo "🚀 Starting PM2 process..."
if [ -f "ecosystem.config.js" ]; then
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
else
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
fi
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save

# 5. صبر برای راه‌اندازی
echo ""
echo "5️⃣ Waiting for server to start..."
sleep 8

# 6. بررسی وضعیت نهایی
echo ""
echo "6️⃣ Final PM2 Status:"
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "✅ Done! Changes should be applied now."
echo "=========================================="
echo ""
echo "💡 Useful commands:"
echo "   View logs:    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50"
echo "   Status:       /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status"
echo ""

