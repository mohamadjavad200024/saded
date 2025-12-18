#!/bin/bash

# Force pull and restart script - handles Resource temporarily unavailable errors
set -e

echo "=========================================="
echo "🚀 Force Pull and Restart"
echo "=========================================="

cd ~/public_html/saded || {
  echo "❌ Error: Could not find project directory"
  exit 1
}

echo ""
echo "1️⃣ Current directory:"
pwd

echo ""
echo "2️⃣ Checking Git status..."
git status --short | head -5 || echo "⚠️  Git status check failed"

echo ""
echo "3️⃣ Attempting git pull (with retries)..."
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "   Attempt $((RETRY_COUNT + 1))/$MAX_RETRIES..."
  
  if git pull origin main 2>&1 | tee /tmp/git-pull-output.log; then
    echo "✅ Git pull successful!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Git pull failed, waiting 30 seconds before retry..."
      sleep 30
    else
      echo "❌ Git pull failed after $MAX_RETRIES attempts"
      echo ""
      echo "📋 Trying alternative: git fetch + reset"
      git fetch origin main || echo "⚠️  Git fetch also failed"
      git reset --hard origin/main || echo "⚠️  Git reset failed"
    fi
  fi
done

echo ""
echo "4️⃣ Checking if key files were updated..."
KEY_FILES=(
  "app/api/chat/route.ts"
  "app/api/orders/create/route.ts"
  "store/order-store.ts"
)

for file in "${KEY_FILES[@]}"; do
  if [ -f "$file" ]; then
    # Check if file contains our fixes
    if grep -q "canAutoClaim\|auto-claim\|credentials.*include" "$file" 2>/dev/null; then
      echo "✅ $file contains fixes"
    else
      echo "⚠️  $file may not have latest changes"
    fi
  else
    echo "❌ $file not found"
  fi
done

echo ""
echo "5️⃣ Setting up Node.js path..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo ""
echo "6️⃣ Stopping PM2 process..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded 2>/dev/null || echo "⚠️  PM2 stop failed (may not be running)"

echo ""
echo "7️⃣ Waiting 2 seconds..."
sleep 2

echo ""
echo "8️⃣ Starting PM2 process..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --update-env || {
  echo "⚠️  PM2 start failed, trying restart..."
  /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
}

echo ""
echo "9️⃣ Waiting 3 seconds for PM2 to start..."
sleep 3

echo ""
echo "🔟 Checking PM2 status..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "✅ Process completed!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "   1. Hard refresh your browser (Ctrl+Shift+R)"
echo "   2. Check browser console for any errors"
echo "   3. Test chat and orders functionality"
echo ""
echo "🔍 To check PM2 logs:"
echo "   /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50"
echo ""

