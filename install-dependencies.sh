#!/bin/bash
# Script to install dependencies in local directory for cPanel

echo "=========================================="
echo "Installing dependencies for cPanel"
echo "=========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Set npm to install in local directory
export NPM_CONFIG_PREFIX=""
export npm_config_prefix=""

# Install all dependencies (including devDependencies for build)
echo "[1/2] Installing all dependencies..."
npm install --legacy-peer-deps

# Verify tailwindcss is installed
echo ""
echo "[2/2] Verifying installation..."
if [ -d "node_modules/tailwindcss" ]; then
    echo "✅ tailwindcss installed successfully"
else
    echo "❌ tailwindcss not found, installing..."
    npm install tailwindcss autoprefixer postcss --save-dev --legacy-peer-deps
fi

echo ""
echo "=========================================="
echo "Installation completed!"
echo "=========================================="
echo ""
echo "Next step: npm run build:cpanel"

