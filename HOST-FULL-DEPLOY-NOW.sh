#!/bin/bash

# Full deployment script for host
# This script pulls latest changes, checks build files, and restarts PM2

set -e  # Exit on error

echo "=========================================="
echo "Starting Full Deployment"
echo "=========================================="

# Navigate to project directory
cd ~/public_html/saded || {
    echo "ERROR: Cannot find project directory ~/public_html/saded"
    exit 1
}

echo ""
echo "1. Current directory: $(pwd)"
echo "2. Current branch: $(git branch --show-current)"

# Add Node.js and PM2 to PATH
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
export NODE_PATH=/opt/alt/alt-nodejs20/root/usr/lib/node_modules

# Check if PM2 is available
PM2_PATH=$(which pm2 || echo "/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2")
echo "3. PM2 path: $PM2_PATH"

# Pull latest changes
echo ""
echo "4. Pulling latest changes from Git..."
git pull origin main || {
    echo "WARNING: Git pull failed, trying to continue..."
}

# Check if .next directory exists
echo ""
echo "5. Checking build files..."
if [ -d ".next" ]; then
    echo "   ✓ .next directory exists"
    if [ -f ".next/BUILD_ID" ]; then
        BUILD_ID=$(cat .next/BUILD_ID)
        echo "   ✓ BUILD_ID: $BUILD_ID"
    else
        echo "   ⚠ WARNING: BUILD_ID not found"
    fi
    if [ -d ".next/server" ]; then
        SERVER_FILES=$(find .next/server -type f | wc -l)
        echo "   ✓ Server files: $SERVER_FILES"
    else
        echo "   ⚠ WARNING: .next/server directory not found"
    fi
    if [ -d ".next/static" ]; then
        STATIC_FILES=$(find .next/static -type f | wc -l)
        echo "   ✓ Static files: $STATIC_FILES"
    else
        echo "   ⚠ WARNING: .next/static directory not found"
    fi
else
    echo "   ⚠ WARNING: .next directory not found - build may be missing"
fi

# Check PM2 status
echo ""
echo "6. Checking PM2 status..."
$PM2_PATH list || {
    echo "   ⚠ PM2 list failed, but continuing..."
}

# Restart PM2
echo ""
echo "7. Restarting PM2 process..."
$PM2_PATH restart saded --update-env || {
    echo "   ⚠ PM2 restart failed, trying to start..."
    $PM2_PATH start server.js --name saded --update-env || {
        echo "   ⚠ PM2 start also failed"
    }
}

# Wait a moment
sleep 2

# Check PM2 status again
echo ""
echo "8. Final PM2 status:"
$PM2_PATH list || true

# Show recent logs
echo ""
echo "9. Recent PM2 logs (last 20 lines):"
$PM2_PATH logs saded --lines 20 --nostream || true

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "If you see any errors above, please check:"
echo "1. Git pull was successful"
echo "2. .next build files exist"
echo "3. PM2 process is running"
echo "4. Check PM2 logs: $PM2_PATH logs saded"
echo ""

