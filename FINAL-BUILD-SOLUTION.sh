#!/bin/bash
# راه حل نهایی - Build با Webpack

echo "=== راه حل نهایی - Build با Webpack ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== آپدیت package.json ==="
# آپدیت build script برای استفاده از NEXT_PRIVATE_SKIP_TURBO
sed -i 's|"build": "next build --webpack",|"build": "NEXT_PRIVATE_SKIP_TURBO=1 next build --webpack",|' package.json

echo "✓ package.json آپدیت شد"
grep '"build"' package.json

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
echo "=== Build با npm run build ==="
NODE_OPTIONS='--max-old-space-size=2048' npm run build 2>&1 | tee build.log

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
    echo "بررسی لاگ..."
    if grep -q "webpack" build.log; then
        echo "✓ Webpack استفاده شده"
    else
        echo "✗ هنوز Turbopack است"
    fi
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

