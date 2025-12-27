#!/bin/bash
# رفع خطاهای Build

echo "=== رفع خطاهای Build ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی و نصب Dependencies ==="

# بررسی tailwindcss
if [ ! -d "node_modules/tailwindcss" ]; then
    echo "نصب tailwindcss..."
    npm install tailwindcss@^3.4.19 autoprefixer@^10.4.23 --save-dev
fi

# بررسی autoprefixer
if [ ! -d "node_modules/autoprefixer" ]; then
    echo "نصب autoprefixer..."
    npm install autoprefixer@^10.4.23 --save-dev
fi

echo ""
echo "=== بررسی postcss.config.js ==="
cat postcss.config.js

echo ""
echo "=== بررسی فایل‌های components ==="
ls -la components/layout/header.tsx 2>/dev/null && echo "✓ header.tsx موجود است" || echo "✗ header.tsx موجود نیست"
ls -la components/layout/footer.tsx 2>/dev/null && echo "✓ footer.tsx موجود است" || echo "✗ footer.tsx موجود نیست"

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build با Webpack ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'
export VIRTUAL_ENV=/home/shop1111/nodevenv/repositories/saded/20

npx next build --webpack

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    exit 1
fi

