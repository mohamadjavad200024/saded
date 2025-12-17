#!/bin/bash

# اسکریپت کامل برای رفع خطای 503
# این اسکریپت فایل‌های build را بررسی می‌کند و PM2 را restart می‌کند

set -e

echo "=========================================="
echo "🔧 Fixing 503 Error - Complete Solution"
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
PM2_CMD="/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2"

echo ""
echo "1️⃣ Checking .next build files..."
echo "=========================================="

BUILD_EXISTS=false
if [ -f ".next/BUILD_ID" ] && [ -d ".next/server" ] && [ -d ".next/static" ]; then
    BUILD_ID=$(cat .next/BUILD_ID 2>/dev/null || echo "unknown")
    SERVER_FILES=$(find .next/server -type f 2>/dev/null | wc -l)
    STATIC_FILES=$(find .next/static -type f 2>/dev/null | wc -l)
    
    if [ "$SERVER_FILES" -gt 0 ] && [ "$STATIC_FILES" -gt 0 ]; then
        echo "✅ Build files exist:"
        echo "   BUILD_ID: $BUILD_ID"
        echo "   Server files: $SERVER_FILES"
        echo "   Static files: $STATIC_FILES"
        BUILD_EXISTS=true
    else
        echo "⚠️  Build files incomplete"
    fi
else
    echo "❌ Build files missing!"
    echo "   Checking if .next directory exists..."
    if [ -d ".next" ]; then
        echo "   .next directory exists but files are missing"
        ls -la .next/ | head -10
    else
        echo "   .next directory does not exist"
    fi
fi

# If build files don't exist, try to pull from Git
if [ "$BUILD_EXISTS" = false ]; then
    echo ""
    echo "2️⃣ Pulling latest changes from Git (including build files)..."
    echo "=========================================="
    git pull origin main || {
        echo "⚠️  Git pull failed, but continuing..."
    }
    
    # Check again
    if [ -f ".next/BUILD_ID" ] && [ -d ".next/server" ] && [ -d ".next/static" ]; then
        BUILD_ID=$(cat .next/BUILD_ID 2>/dev/null || echo "unknown")
        SERVER_FILES=$(find .next/server -type f 2>/dev/null | wc -l)
        STATIC_FILES=$(find .next/static -type f 2>/dev/null | wc -l)
        
        if [ "$SERVER_FILES" -gt 0 ] && [ "$STATIC_FILES" -gt 0 ]; then
            echo "✅ Build files found after pull!"
            BUILD_EXISTS=true
        fi
    fi
fi

# If still no build files, warn user
if [ "$BUILD_EXISTS" = false ]; then
    echo ""
    echo "⚠️  WARNING: Build files are still missing!"
    echo "   You need to build the app, but host may have memory limitations."
    echo "   Try: npm run build"
    echo "   Or build locally and push .next files to Git"
    echo ""
    echo "   Continuing with restart anyway..."
fi

echo ""
echo "3️⃣ Stopping PM2 process..."
echo "=========================================="
$PM2_CMD stop saded 2>/dev/null || echo "   Process not running or already stopped"
sleep 2

echo ""
echo "4️⃣ Restarting PM2 process..."
echo "=========================================="

# Check if ecosystem.config.js exists
if [ -f "ecosystem.config.js" ]; then
    echo "   Using ecosystem.config.js"
    $PM2_CMD start ecosystem.config.js
else
    echo "   Using server.js directly"
    $PM2_CMD start server.js --name saded --env production --update-env
fi

$PM2_CMD save

echo ""
echo "5️⃣ Waiting for server to start..."
sleep 5

echo ""
echo "6️⃣ Final PM2 status:"
echo "=========================================="
$PM2_CMD list | grep -i "saded" || {
    echo "⚠️  PM2 process not found!"
    echo "   Trying to start again..."
    $PM2_CMD start server.js --name saded --env production --update-env
    $PM2_CMD save
    sleep 3
    $PM2_CMD list | grep -i "saded" || echo "❌ Failed to start PM2 process"
}

echo ""
echo "7️⃣ Recent logs (last 20 lines):"
echo "=========================================="
$PM2_CMD logs saded --lines 20 --nostream 2>/dev/null | tail -30 || {
    echo "⚠️  Could not get logs"
}

echo ""
echo "=========================================="
if [ "$BUILD_EXISTS" = true ]; then
    echo "✅ Done! Server should be running now."
else
    echo "⚠️  Done, but build files may be missing!"
    echo "   Check logs above for errors."
fi
echo "=========================================="
echo ""
echo "💡 If 503 persists:"
echo "   1. Check build files: ls -la .next/BUILD_ID"
echo "   2. Check PM2 logs: $PM2_CMD logs saded --lines 100"
echo "   3. Check PM2 status: $PM2_CMD status"
echo ""
