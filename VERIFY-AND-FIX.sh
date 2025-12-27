#!/bin/bash
# بررسی دقیق و رفع مشکل

echo "=== بررسی دقیق ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی tailwindcss در venv ==="
ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss 2>&1

echo ""
echo "=== بررسی node_modules در venv ==="
ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/ | grep -E "tailwind|alloc" | head -10

echo ""
echo "=== بررسی npm prefix ==="
npm config get prefix

echo ""
echo "=== نصب tailwindcss با --force ==="
cd /home/shop1111/nodevenv/repositories/saded/20
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force

echo ""
echo "=== بررسی مجدد ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss نصب شد"
    ls -la lib/node_modules/tailwindcss | head -5
else
    echo "✗ tailwindcss نصب نشد"
    echo ""
    echo "=== استفاده از روش جایگزین: نصب در node_modules پروژه ==="
    cd /home/shop1111/repositories/saded
    
    # حذف symlink
    rm -rf node_modules
    
    # نصب در node_modules پروژه (مستقیم)
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
    
    if [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در node_modules پروژه نصب شد"
    else
        echo "✗ tailwindcss نصب نشد"
        exit 1
    fi
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules" ]; then
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از symlink قابل دسترسی نیست"
        echo "ایجاد مجدد symlink..."
        rm -f node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
elif [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه موجود است (نه symlink)"
    # آپدیت next.config.js برای غیرفعال کردن symlinks
    sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js
fi

echo ""
echo "=== آپدیت next.config.js ==="
# اگر node_modules symlink نیست، symlinks را false کن
if [ ! -L "node_modules" ]; then
    sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js
    echo "✓ symlinks غیرفعال شد (چون node_modules symlink نیست)"
else
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ symlinks فعال شد"
fi

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

