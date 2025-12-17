#!/bin/bash

# اسکریپت ساده برای restart PM2 بدون fork جدید
# این اسکریپت از PM2 که قبلاً نصب شده استفاده می‌کند

cd ~/public_html/saded || exit 1

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "=========================================="
echo "🔄 Simple PM2 Restart"
echo "=========================================="

# استفاده از PM2 که قبلاً در PATH است
# یا استفاده از full path بدون fork
PM2_FULL_PATH="$HOME/.npm-global/bin/pm2"

echo ""
echo "1️⃣ Checking PM2 status..."
if [ -f "$PM2_FULL_PATH" ]; then
    echo "✅ PM2 found at: $PM2_FULL_PATH"
    /opt/alt/alt-nodejs20/root/usr/bin/node "$PM2_FULL_PATH" list 2>/dev/null | grep -i "saded" || echo "⚠️  Process not found"
else
    echo "❌ PM2 not found at: $PM2_FULL_PATH"
    echo "   Trying alternative method..."
fi

echo ""
echo "2️⃣ Restarting PM2 (using existing process)..."
echo "=========================================="

# روش 1: استفاده از PM2 که قبلاً در حال اجرا است
if command -v pm2 >/dev/null 2>&1; then
    echo "   Using 'pm2' command..."
    pm2 restart saded --update-env 2>/dev/null || {
        echo "   Restart failed, trying stop/start..."
        pm2 stop saded 2>/dev/null || true
        sleep 2
        pm2 start server.js --name saded --update-env 2>/dev/null || true
    }
elif [ -f "$PM2_FULL_PATH" ]; then
    echo "   Using full path to PM2..."
    /opt/alt/alt-nodejs20/root/usr/bin/node "$PM2_FULL_PATH" restart saded --update-env 2>/dev/null || {
        echo "   Restart failed, trying stop/start..."
        /opt/alt/alt-nodejs20/root/usr/bin/node "$PM2_FULL_PATH" stop saded 2>/dev/null || true
        sleep 2
        /opt/alt/alt-nodejs20/root/usr/bin/node "$PM2_FULL_PATH" start server.js --name saded --update-env 2>/dev/null || true
    }
else
    echo "❌ Cannot find PM2"
    echo "   Please wait a few minutes and try again"
    exit 1
fi

echo ""
echo "3️⃣ Waiting 5 seconds..."
sleep 5

echo ""
echo "4️⃣ Final status:"
if command -v pm2 >/dev/null 2>&1; then
    pm2 list 2>/dev/null | grep -i "saded" || echo "⚠️  Process not found"
elif [ -f "$PM2_FULL_PATH" ]; then
    /opt/alt/alt-nodejs20/root/usr/bin/node "$PM2_FULL_PATH" list 2>/dev/null | grep -i "saded" || echo "⚠️  Process not found"
fi

echo ""
echo "=========================================="
echo "✅ Done!"
echo "=========================================="
echo ""
echo "💡 If you see 'Resource temporarily unavailable':"
echo "   1. Wait 2-3 minutes"
echo "   2. Try again"
echo "   3. Or check if PM2 is already running:"
echo "      pm2 list"
echo ""

