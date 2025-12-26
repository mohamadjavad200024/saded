#!/bin/bash
# Complete run script for host server

set -e

echo "=========================================="
echo "Saded - Complete Run Script"
echo "=========================================="

# 1. Activate virtual environment
echo ""
echo "1. Activating virtual environment..."
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 2. Check tailwindcss installation
echo ""
echo "2. Checking tailwindcss installation..."
if [ -d "/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss" ]; then
  echo "✓ tailwindcss found in venv"
elif [ -L "node_modules" ] && [ -d "node_modules/tailwindcss" ]; then
  echo "✓ tailwindcss found via symlink"
else
  echo "✗ tailwindcss not found, installing..."
  cd /home/shop1111/nodevenv/public_html/saded/20
  npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
  cd /home/shop1111/public_html/saded
  
  # Ensure symlink exists
  if [ ! -L "node_modules" ]; then
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules
  fi
fi

# 3. Check if build is needed
echo ""
echo "3. Checking build status..."
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
  echo "Build not found, building..."
  rm -rf .next
  NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
else
  echo "✓ Build exists"
fi

# 4. Check PM2
echo ""
echo "4. Checking PM2..."
if ! command -v pm2 &> /dev/null; then
  echo "PM2 not found, installing..."
  npm install -g pm2
fi

# 5. Stop existing process
echo ""
echo "5. Stopping existing process..."
pm2 stop saded 2>/dev/null || true
pm2 delete saded 2>/dev/null || true

# 6. Start with PM2
echo ""
echo "6. Starting application with PM2..."
pm2 start ecosystem.config.js

# 7. Save PM2 configuration
echo ""
echo "7. Saving PM2 configuration..."
pm2 save

# 8. Show status
echo ""
echo "8. Application status:"
pm2 status

echo ""
echo "=========================================="
echo "✓ Application started successfully!"
echo "=========================================="
echo ""
echo "Useful commands:"
echo "  pm2 logs saded --lines 50    # View logs"
echo "  pm2 restart saded             # Restart app"
echo "  pm2 stop saded                # Stop app"
echo "  pm2 status                    # Check status"
echo ""

