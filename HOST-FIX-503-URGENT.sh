#!/bin/bash

# اسکریپت فوری برای رفع خطای 503
# این اسکریپت PM2 را بررسی می‌کند و در صورت نیاز restart می‌کند

set -e

echo "=========================================="
echo "🔧 Fixing 503 Error - Urgent"
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# Find PM2 path
if [ -f "$HOME/.npm-global/bin/pm2" ]; then
    PM2_CMD="$HOME/.npm-global/bin/pm2"
elif [ -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
    PM2_CMD="/opt/alt/alt-nodejs20/root/usr/bin/node $HOME/.npm-global/bin/pm2"
else
    PM2_CMD="pm2"
fi

echo ""
echo "1️⃣ Checking PM2 status..."
echo "=========================================="

# Check if PM2 process exists
PM2_STATUS=$($PM2_CMD list 2>/dev/null | grep -i "saded" || echo "")

if [ -z "$PM2_STATUS" ]; then
    echo "⚠️  PM2 process 'saded' not found!"
    echo "🚀 Starting PM2 process..."
    
    if [ -f "ecosystem.config.js" ]; then
        $PM2_CMD start ecosystem.config.js
    else
        $PM2_CMD start server.js --name saded --env production --update-env
    fi
    $PM2_CMD save
    
    echo "✅ PM2 process started"
else
    echo "📊 Current PM2 status:"
    $PM2_CMD list | grep -i "saded" || true
    
    # Check if process is stopped or errored
    PM2_STATE=$($PM2_CMD jlist 2>/dev/null | grep -o '"pm2_env":{"status":"[^"]*"' | grep -o 'status":"[^"]*' | cut -d'"' -f3 || echo "")
    
    if [ "$PM2_STATE" != "online" ]; then
        echo "⚠️  PM2 process is not online (status: $PM2_STATE)"
        echo "🔄 Restarting PM2 process..."
        
        $PM2_CMD restart saded --update-env || {
            echo "⚠️  Restart failed, trying to stop and start..."
            $PM2_CMD stop saded 2>/dev/null || true
            $PM2_CMD delete saded 2>/dev/null || true
            
            if [ -f "ecosystem.config.js" ]; then
                $PM2_CMD start ecosystem.config.js
            else
                $PM2_CMD start server.js --name saded --env production --update-env
            fi
            $PM2_CMD save
        }
        
        echo "✅ PM2 process restarted"
    else
        echo "✅ PM2 process is online"
        echo "🔄 Restarting anyway to ensure fresh state..."
        $PM2_CMD restart saded --update-env
    fi
fi

# Wait for server to start
echo ""
echo "2️⃣ Waiting for server to start..."
sleep 5

# Check PM2 status again
echo ""
echo "3️⃣ Final PM2 status:"
echo "=========================================="
$PM2_CMD list | grep -i "saded" || true

# Show recent logs
echo ""
echo "4️⃣ Recent PM2 logs (last 30 lines):"
echo "=========================================="
$PM2_CMD logs saded --lines 30 --nostream 2>/dev/null || {
    echo "⚠️  Could not get logs"
}

# Check if .next directory exists
echo ""
echo "5️⃣ Checking build files..."
if [ -d ".next" ]; then
    echo "✅ .next directory exists"
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo "   BUILD_ID: $BUILD_ID"
    fi
else
    echo "⚠️  WARNING: .next directory not found!"
    echo "   You may need to run: npm run build"
fi

echo ""
echo "=========================================="
echo "✅ Done! Check if 503 error is fixed."
echo "=========================================="
echo ""
echo "💡 If 503 persists, check:"
echo "   1. PM2 logs: $PM2_CMD logs saded --lines 100"
echo "   2. PM2 status: $PM2_CMD status"
echo "   3. Database connection"
echo "   4. Server.js file exists"
echo ""

