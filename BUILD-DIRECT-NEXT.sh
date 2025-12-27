#!/bin/bash
# Build با دستور مستقیم next

echo "=== Build با دستور مستقیم next ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی next ==="
which next || echo "next پیدا نشد - استفاده از node_modules/.bin/next"

NEXT_BIN=""
if [ -f "node_modules/.bin/next" ]; then
    NEXT_BIN="node_modules/.bin/next"
elif [ -f "/home/shop1111/nodevenv/repositories/saded/20/bin/next" ]; then
    NEXT_BIN="/home/shop1111/nodevenv/repositories/saded/20/bin/next"
else
    echo "✗ next پیدا نشد"
    exit 1
fi

echo "استفاده از: $NEXT_BIN"

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build با Webpack ==="
# استفاده از دستور مستقیم next با environment variables
NEXT_PRIVATE_SKIP_TURBO=1 NODE_OPTIONS='--max-old-space-size=2048' $NEXT_BIN build --webpack 2>&1 | tee build.log

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
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR\|Turbopack\|webpack" || tail -30 build.log
    
    # بررسی اینکه آیا webpack استفاده شده یا نه
    if grep -q "webpack" build.log; then
        echo ""
        echo "✓ Webpack استفاده شده"
    else
        echo ""
        echo "✗ Webpack استفاده نشده - هنوز Turbopack است"
    fi
    exit 1
fi

