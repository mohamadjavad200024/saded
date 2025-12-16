#!/bin/bash

# اسکریپت سریع برای start کردن PM2

echo "=========================================="
echo "🚀 Starting PM2..."
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی وجود Node.js
if [ ! -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
    echo "❌ Node.js not found!"
    exit 1
fi

# بررسی وجود PM2
if [ ! -f "$HOME/.npm-global/bin/pm2" ]; then
    echo "❌ PM2 not found!"
    exit 1
fi

# بررسی فایل‌های بیلد
echo ""
echo "1️⃣ Checking build files..."
if [ -d ".next/server" ] && [ -d ".next/static" ] && [ -f ".next/BUILD_ID" ]; then
    echo "✅ Build files exist"
else
    echo "⚠️  Warning: Some build files are missing!"
fi

# Start PM2
echo ""
echo "2️⃣ Starting PM2..."
if [ -f "ecosystem.config.js" ]; then
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
else
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --env production --update-env
fi

# Save PM2 configuration
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save

# صبر برای شروع
sleep 3

# نمایش وضعیت
echo ""
echo "3️⃣ PM2 Status:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "✅ Done!"
echo "=========================================="

