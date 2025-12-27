#!/bin/bash
# رفع مشکل npm prefix

echo "=== رفع مشکل npm prefix ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== مشکل: npm install در venv نصب می‌کند نه در node_modules پروژه ==="
echo "npm prefix فعلی: $(npm config get prefix)"

echo ""
echo "=== راه حل 1: تغییر npm prefix به پروژه ==="
# تنظیم npm prefix به مسیر پروژه (موقت)
npm config set prefix /home/shop1111/repositories/saded

echo "npm prefix جدید: $(npm config get prefix)"

echo ""
echo "=== نصب tailwindcss در node_modules پروژه ==="
rm -rf node_modules package-lock.json
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps

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
    echo "=== راه حل 2: نصب در venv و ایجاد symlink ==="
    cd /home/shop1111/nodevenv/repositories/saded/20
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev
    
    cd /home/shop1111/repositories/saded
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از symlink هم قابل دسترسی نیست"
        exit 1
    fi
fi

# برگشت npm prefix به venv
npm config set prefix /home/shop1111/nodevenv/repositories/saded/20

cd /home/shop1111/repositories/saded

echo ""
echo "=== آپدیت next.config.js ==="
if [ -L "node_modules" ]; then
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ symlinks فعال شد"
else
    sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js
    echo "✓ symlinks غیرفعال شد"
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

