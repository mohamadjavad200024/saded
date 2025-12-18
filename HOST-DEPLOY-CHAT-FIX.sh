#!/bin/bash

# Script to deploy chat access control fixes on host
# This script pulls latest changes and restarts PM2

set -e

echo "=========================================="
echo "🚀 Deploying Chat Access Control Fixes"
echo "=========================================="

# Navigate to project directory
cd ~/public_html/saded || {
  echo "❌ Error: Could not find project directory"
  exit 1
}

echo ""
echo "1️⃣ Checking current directory..."
pwd

echo ""
echo "2️⃣ Checking Git status..."
git status --short | head -10

echo ""
echo "3️⃣ Pulling latest changes from Git..."
git pull origin main || {
  echo "⚠️  Git pull failed, but continuing..."
}

echo ""
echo "4️⃣ Checking for build files..."
if [ ! -f ".next/BUILD_ID" ]; then
  echo "⚠️  Warning: .next/BUILD_ID not found"
  echo "   This might cause issues. Make sure build files are pushed to Git."
else
  echo "✅ Build files found"
fi

echo ""
echo "5️⃣ Setting up Node.js path..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo ""
echo "6️⃣ Checking PM2 status..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status || {
  echo "⚠️  PM2 status check failed"
}

echo ""
echo "7️⃣ Restarting PM2 process..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env || {
  echo "⚠️  PM2 restart failed, trying to start..."
  /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js --name saded --update-env || {
    echo "❌ Failed to start PM2"
    exit 1
  }
}

echo ""
echo "8️⃣ Waiting 3 seconds for PM2 to start..."
sleep 3

echo ""
echo "9️⃣ Checking PM2 status again..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "=========================================="
echo "✅ Deployment completed!"
echo "=========================================="
echo ""
echo "📝 Next steps:"
echo "   1. Hard refresh your browser (Ctrl+Shift+R)"
echo "   2. Check browser console for any errors"
echo "   3. Test chat functionality"
echo ""
echo "🔍 To check PM2 logs:"
echo "   /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50"
echo ""

