#!/bin/bash
# نصب tailwindcss و build پروژه

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر venv
cd /home/shop1111/nodevenv/public_html/saded/20

# نصب tailwindcss و autoprefixer
echo "در حال نصب tailwindcss و autoprefixer..."
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

# بررسی نصب
if [ ! -d "lib/node_modules/tailwindcss" ]; then
    echo "خطا: tailwindcss نصب نشد!"
    exit 1
fi

echo "✓ tailwindcss نصب شد"

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# بررسی symlink
if [ ! -L "node_modules" ]; then
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules
fi

# Disable Turbopack
export NEXT_PRIVATE_SKIP_TURBO=1

# Build
echo "شروع build..."
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

echo "Build کامل شد!"

