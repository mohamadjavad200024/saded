#!/bin/bash
# نصب مستقیم tailwindcss

echo "=== نصب مستقیم tailwindcss ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== نصب tailwindcss در node_modules پروژه ==="
# حذف node_modules اگر symlink است
if [ -L "node_modules" ]; then
    rm -f node_modules
fi

# نصب مستقیم
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps --no-save=false

echo ""
echo "=== بررسی نصب ==="
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه نصب شد"
    ls -la node_modules/tailwindcss | head -5
    
    # بررسی dependencies
    if [ -d "node_modules/@alloc" ]; then
        echo "✓ dependencies موجود هستند"
    else
        echo "⚠ dependencies ممکن است نصب نشده باشند"
    fi
else
    echo "✗ tailwindcss نصب نشد"
    echo ""
    echo "بررسی npm install output..."
    npm list tailwindcss 2>&1 | head -10
    exit 1
fi

echo ""
echo "=== آپدیت next.config.js ==="
# غیرفعال کردن symlinks چون node_modules مستقیماً در پروژه است
sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build ==="
NODE_OPTIONS='--max-old-space-size=2048' npm run build 2>&1 | tee build.log

echo ""
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
fi

