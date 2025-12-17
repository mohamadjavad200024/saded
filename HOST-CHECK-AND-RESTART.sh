#!/bin/bash

# اسکریپت بررسی و restart PM2
# این اسکریپت تغییرات را بررسی می‌کند و PM2 را restart می‌کند

set -e

echo "=========================================="
echo "🔍 Checking Changes and Restarting PM2"
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
PM2_CMD="/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2"

echo ""
echo "1️⃣ Checking current commit..."
echo "=========================================="
CURRENT_COMMIT=$(git log --oneline -1 | cut -d' ' -f1)
echo "Current commit: $CURRENT_COMMIT"

echo ""
echo "2️⃣ Checking if location/voice button code exists..."
echo "=========================================="
if grep -q "console.log.*Location.*Button clicked" app/chat/page.tsx; then
    echo "✅ Location button code found"
    grep -n "console.log.*Location.*Button clicked" app/chat/page.tsx | head -1
else
    echo "❌ Location button code NOT found"
fi

if grep -q "console.log.*Voice.*Button clicked" app/chat/page.tsx; then
    echo "✅ Voice button code found"
    grep -n "console.log.*Voice.*Button clicked" app/chat/page.tsx | head -1
else
    echo "❌ Voice button code NOT found"
fi

echo ""
echo "3️⃣ Checking PM2 status..."
echo "=========================================="
$PM2_CMD list | grep -i "saded" || {
    echo "⚠️  PM2 process 'saded' not found!"
}

echo ""
echo "4️⃣ Restarting PM2..."
echo "=========================================="
$PM2_CMD restart saded --update-env || {
    echo "⚠️  Restart failed, trying stop and start..."
    $PM2_CMD stop saded 2>/dev/null || true
    sleep 2
    $PM2_CMD start server.js --name saded --env production --update-env
    $PM2_CMD save
}

echo ""
echo "5️⃣ Waiting for server to start..."
sleep 5

echo ""
echo "6️⃣ Final PM2 status:"
echo "=========================================="
$PM2_CMD list | grep -i "saded" || echo "⚠️  PM2 process not found"

echo ""
echo "7️⃣ Recent logs (last 10 lines):"
echo "=========================================="
$PM2_CMD logs saded --lines 10 --nostream 2>/dev/null | tail -15 || {
    echo "⚠️  Could not get logs"
}

echo ""
echo "=========================================="
echo "✅ Done!"
echo "=========================================="
echo ""
echo "💡 Next steps:"
echo "   1. Hard refresh your browser: Ctrl+Shift+R"
echo "   2. Open Console: F12 → Console"
echo "   3. Click Paperclip button (📎)"
echo "   4. Click Location (📍) or Voice (🎤) button"
echo "   5. Check Console for logs:"
echo "      - [Paperclip] Button clicked!"
echo "      - [Location] Button clicked! (for location)"
echo "      - [Voice] Button clicked! (for voice)"
echo ""

