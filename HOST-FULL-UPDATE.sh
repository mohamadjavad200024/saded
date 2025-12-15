#!/bin/bash

# Full Update Script for Host
# This script pulls changes, rebuilds, and restarts PM2

cd ~/public_html/saded || exit 1

echo "=== Starting Full Update ==="

# 1. Stash any local changes
echo "1. Stashing local changes..."
git stash

# 2. Fetch latest changes
echo "2. Fetching latest changes..."
git fetch origin main

# 3. Hard reset to match remote
echo "3. Resetting to remote main..."
git reset --hard origin/main

# 4. Install dependencies (in case new packages were added)
echo "4. Installing dependencies..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm install

# 5. Build the project (with memory limit)
echo "5. Building project..."
# Try to build with Node memory limit
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build || {
    echo "Build failed due to memory issues. Using existing build..."
    echo "If changes don't appear, you may need to build locally and push .next folder"
}

# 6. Restart PM2
echo "6. Restarting PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# 7. Wait a bit
sleep 5

# 8. Show PM2 status
echo "7. PM2 Status:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo "=== Update Complete ==="
echo "Please hard refresh your browser (Ctrl+Shift+R)"

