#!/bin/bash
# رفع کامل مشکلات build

set -e

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

echo "=========================================="
echo "مرحله 1: بررسی و نصب tailwindcss"
echo "=========================================="

cd /home/shop1111/nodevenv/public_html/saded/20

# بررسی نصب tailwindcss
if [ ! -d "lib/node_modules/tailwindcss" ]; then
    echo "tailwindcss نصب نشده، در حال نصب..."
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force
else
    echo "✓ tailwindcss قبلاً نصب شده"
fi

# بررسی autoprefixer
if [ ! -d "lib/node_modules/autoprefixer" ]; then
    echo "autoprefixer نصب نشده، در حال نصب..."
    npm install autoprefixer@10.4.23 --save-dev --force
else
    echo "✓ autoprefixer قبلاً نصب شده"
fi

echo "=========================================="
echo "مرحله 2: بررسی symlink"
echo "=========================================="

cd /home/shop1111/public_html/saded

# بررسی symlink
if [ ! -L "node_modules" ]; then
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules
fi

# بررسی tailwindcss از طریق symlink
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
else
    echo "✗ خطا: tailwindcss از طریق symlink قابل دسترسی نیست"
    exit 1
fi

echo "=========================================="
echo "مرحله 3: Build با webpack"
echo "=========================================="

# Disable Turbopack
export NEXT_PRIVATE_SKIP_TURBO=1

# پاک کردن cache
rm -rf .next

# Build
echo "شروع build (این ممکن است چند دقیقه طول بکشد)..."
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

echo "=========================================="
echo "✓ Build موفق بود!"
echo "=========================================="

