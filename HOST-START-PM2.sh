#!/bin/bash

# اسکریپت برای start کردن پروژه با PM2 در هاست
# این اسکریپت ابتدا pull می‌کند، سپس PM2 را start می‌کند

echo "=========================================="
echo "🚀 Starting project with PM2..."
echo "=========================================="

# رفتن به مسیر پروژه
cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

# تنظیم PATH
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

# Pull تغییرات از Git
echo ""
echo "=========================================="
echo "📥 Pulling latest changes from Git..."
echo "=========================================="

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
echo "Current branch: $CURRENT_BRANCH"

git pull origin $CURRENT_BRANCH

if [ $? -ne 0 ]; then
    echo "⚠️  Git pull failed, but continuing..."
fi

# بررسی وجود فایل‌های بیلد
echo ""
echo "=========================================="
echo "🔍 Checking build files..."
echo "=========================================="

if [ -d ".next/server" ] && [ -d ".next/static" ] && [ -f ".next/BUILD_ID" ]; then
    echo "✅ Build files found"
else
    echo "⚠️  Warning: Build files missing!"
    echo "   You may need to build the project first"
fi

# بررسی وضعیت PM2
echo ""
echo "=========================================="
echo "📊 Checking PM2 status..."
echo "=========================================="

/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# بررسی اینکه آیا پروژه در حال اجرا است
PM2_STATUS=$(/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 jlist 2>/dev/null | grep -o '"name":"saded"' || echo "")

if [ -n "$PM2_STATUS" ]; then
    echo ""
    echo "🔄 Project is already running. Restarting..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
else
    echo ""
    echo "🚀 Starting project with PM2..."
    
    # بررسی وجود ecosystem.config.js
    if [ -f "ecosystem.config.js" ]; then
        /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
    else
        # استفاده از server.js به صورت مستقیم
        /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --update-env
    fi
    
    # Save PM2 configuration
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
fi

# صبر کردن برای شروع
sleep 3

# نمایش وضعیت نهایی
echo ""
echo "=========================================="
echo "✅ Final PM2 Status:"
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "📝 Useful commands:"
echo "=========================================="
echo "  View logs:    pm2 logs saded"
echo "  Stop:         pm2 stop saded"
echo "  Restart:      pm2 restart saded"
echo "  Status:       pm2 status"
echo ""


