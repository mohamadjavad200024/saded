#!/bin/bash
# Build با Webpack (نه Turbopack)

echo "=== Build با Webpack ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== تنظیم Environment Variables ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

echo "NEXT_PRIVATE_SKIP_TURBO=$NEXT_PRIVATE_SKIP_TURBO"
echo "NODE_OPTIONS=$NODE_OPTIONS"

echo ""
echo "=== بررسی tailwindcss ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
else
    echo "✗ tailwindcss موجود نیست"
    exit 1
fi

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build با Webpack ==="
# استفاده از next build --webpack با environment variable
NEXT_PRIVATE_SKIP_TURBO=1 NODE_OPTIONS='--max-old-space-size=2048' npm exec next build --webpack 2>&1 | tee build.log

echo ""
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    echo ""
    echo "Build ID:"
    cat .next/BUILD_ID
    echo ""
    echo "حالا می‌توانی در cPanel → Node.js App Manager → Restart App را بزنی"
else
    echo "✗ Build ناموفق"
    echo ""
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR\|Turbopack" || tail -30 build.log
    exit 1
fi
