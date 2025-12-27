#!/bin/bash
# رفع مشکل Turbopack در cPanel

echo "=== رفع مشکل Turbopack ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== پاک کردن .next و cache ==="

# پاک کردن .next
rm -rf .next

# پاک کردن cache
rm -rf .next/cache 2>/dev/null || true

echo "✓ پاک شد"

echo ""
echo "=== بررسی package.json ==="
grep -A 2 '"build"' package.json

echo ""
echo "=== Build با Webpack (مستقیم) ==="

# Build مستقیم با webpack flag
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

# استفاده از دستور مستقیم next build --webpack
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

