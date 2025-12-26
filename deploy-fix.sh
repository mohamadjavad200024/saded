#!/bin/bash
# Deployment fix script for saded project
# This script fixes all deployment issues

set -e  # Exit on error

echo "=========================================="
echo "Starting deployment fix..."
echo "=========================================="

# Activate virtual environment
echo "Activating virtual environment..."
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# Navigate to project directory
cd /home/shop1111/public_html/saded

# Fix git pull - allow unrelated histories
echo "=========================================="
echo "Fixing git pull..."
echo "=========================================="
git pull origin main --allow-unrelated-histories || {
    echo "Git pull with --allow-unrelated-histories failed, trying to reset..."
    git fetch origin main
    git reset --hard origin/main
}

# Clean node_modules and package-lock.json
echo "=========================================="
echo "Cleaning old dependencies..."
echo "=========================================="
rm -rf node_modules
rm -f package-lock.json

# Install dependencies
echo "=========================================="
echo "Installing dependencies..."
echo "=========================================="
npm install

# Verify Next.js is installed
if [ ! -d "node_modules/next" ]; then
    echo "ERROR: Next.js not installed, trying to install explicitly..."
    npm install next@16.0.3 --save
fi

# Build the project
echo "=========================================="
echo "Building the project..."
echo "=========================================="
npm run build

# Verify build succeeded
if [ ! -d ".next" ]; then
    echo "ERROR: Build failed - .next directory not found"
    exit 1
fi

echo "=========================================="
echo "Deployment fix completed successfully!"
echo "=========================================="
echo ""
echo "You can now start the server with:"
echo "  npm start"
echo "  OR"
echo "  pm2 start ecosystem.config.js"
echo ""

