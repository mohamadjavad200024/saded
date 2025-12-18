#!/bin/bash

# اسکریپت بررسی وضعیت PM2 با full path

cd ~/public_html/saded || exit 1

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "=========================================="
echo "🔍 Checking PM2 Status"
echo "=========================================="

# استفاده از full path
PM2_FULL_PATH="$HOME/.npm-global/bin/pm2"
NODE_PATH="/opt/alt/alt-nodejs20/root/usr/bin/node"

echo ""
echo "1️⃣ Checking PM2 location..."
if [ -f "$PM2_FULL_PATH" ]; then
    echo "✅ PM2 found at: $PM2_FULL_PATH"
else
    echo "❌ PM2 not found at: $PM2_FULL_PATH"
    echo "   Trying to find PM2..."
    find ~ -name "pm2" -type f 2>/dev/null | head -3
    exit 1
fi

echo ""
echo "2️⃣ PM2 Status:"
echo "=========================================="
$NODE_PATH "$PM2_FULL_PATH" list 2>/dev/null || {
    echo "⚠️  Could not get PM2 status"
    echo "   PM2 might not be running"
}

echo ""
echo "3️⃣ Checking if 'saded' process is running:"
echo "=========================================="
$NODE_PATH "$PM2_FULL_PATH" list 2>/dev/null | grep -i "saded" || {
    echo "⚠️  'saded' process not found in PM2"
    echo ""
    echo "💡 Options:"
    echo "   1. If process is not running, you need to start it:"
    echo "      $NODE_PATH $PM2_FULL_PATH start server.js --name saded --update-env"
    echo ""
    echo "   2. If you see 'Resource temporarily unavailable', wait 2-3 minutes"
    echo ""
    echo "   3. If process is running but changes not applied, just Hard Refresh browser: Ctrl+Shift+R"
}

echo ""
echo "=========================================="
echo "✅ Done!"
echo "=========================================="

