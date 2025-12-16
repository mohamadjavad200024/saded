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

# 3. Restart PM2
echo ""
echo "3️⃣ Restarting PM2..."
echo "=========================================="

# بررسی وضعیت PM2
PM2_STATUS=$(/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 jlist 2>/dev/null | grep -o '"name":"saded"' || echo "")

if [ -n "$PM2_STATUS" ]; then
    echo "🔄 Restarting existing PM2 process..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
else
    echo "🚀 Starting new PM2 process..."
    if [ -f "ecosystem.config.js" ]; then
        /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
    else
        /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
    fi
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
fi

# 4. صبر برای راه‌اندازی
echo ""
echo "4️⃣ Waiting for server to start..."
sleep 5

# 5. بررسی وضعیت نهایی
echo ""
echo "5️⃣ Final PM2 Status:"
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

