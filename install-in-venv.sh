#!/bin/bash
# Install dependencies in virtual environment for cPanel

echo "=========================================="
echo "Installing dependencies in virtual environment"
echo "=========================================="
echo ""

# Activate virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# Install tailwindcss and required packages in virtual environment
echo "[1/2] Installing tailwindcss in virtual environment..."
npm install tailwindcss autoprefixer postcss --save-dev

# Verify installation
echo ""
echo "[2/2] Verifying installation..."
npm list tailwindcss

echo ""
echo "=========================================="
echo "Installation completed!"
echo "=========================================="
echo ""
echo "Next step: npm run build:cpanel"

