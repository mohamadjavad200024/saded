#!/bin/bash
# حذف symlink و نصب مستقیم node_modules

echo "=== حذف symlink و نصب مستقیم ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== حذف symlink ==="
if [ -L "node_modules" ]; then
    echo "حذف symlink node_modules..."
    rm -f node_modules
    echo "✓ symlink حذف شد"
elif [ -d "node_modules" ]; then
    echo "node_modules یک directory است - حذف..."
    rm -rf node_modules
    echo "✓ node_modules حذف شد"
fi

echo ""
echo "=== نصب tailwindcss و autoprefixer در node_modules پروژه ==="
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps

echo ""
echo "=== بررسی نصب ==="
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه نصب شد"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss نصب نشد"
    exit 1
fi

if [ -d "node_modules/autoprefixer" ]; then
    echo "✓ autoprefixer در node_modules پروژه نصب شد"
else
    echo "✗ autoprefixer نصب نشد"
    exit 1
fi

echo ""
echo "=== آپدیت package.json ==="
# آپدیت build script
sed -i 's|"build": "next build",|"build": "NEXT_PRIVATE_SKIP_TURBO=1 next build --webpack",|' package.json

echo "✓ package.json آپدیت شد"
grep '"build"' package.json

echo ""
echo "=== آپدیت next.config.js ==="
# غیرفعال کردن symlinks (چون دیگر symlink نداریم)
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
    echo ""
    echo "Build ID:"
    cat .next/BUILD_ID
    echo ""
    echo "حالا می‌توانی در cPanel → Node.js App Manager → Restart App را بزنی"
else
    echo "✗ Build ناموفق"
    echo ""
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR\|webpack\|Turbopack" || tail -30 build.log
    
    # بررسی اینکه آیا webpack استفاده شده
    if grep -q "webpack" build.log && ! grep -q "Turbopack" build.log; then
        echo ""
        echo "✓ Webpack استفاده شده"
    else
        echo ""
        echo "✗ هنوز Turbopack است"
    fi
    exit 1
fi

