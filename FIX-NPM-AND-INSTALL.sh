#!/bin/bash
# رفع مشکل npm و نصب tailwindcss

echo "=== رفع مشکل npm و نصب tailwindcss ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی npm prefix ==="
echo "npm prefix: $(npm config get prefix)"
echo "VIRTUAL_ENV: $VIRTUAL_ENV"
echo "which npm: $(which npm)"

echo ""
echo "=== تنظیم npm prefix به venv ==="
npm config set prefix /home/shop1111/nodevenv/repositories/saded/20

echo ""
echo "=== بررسی مجدد npm prefix ==="
npm config get prefix

echo ""
echo "=== بررسی node_modules در venv ==="
ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/ | head -10

echo ""
echo "=== نصب tailwindcss در venv (با prefix تنظیم شده) ==="
cd /home/shop1111/nodevenv/repositories/saded/20
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force

echo ""
echo "=== بررسی نصب ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
    ls -la lib/node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss نصب نشد - تلاش با روش دیگر..."
    
    # روش جایگزین: نصب در مسیر پروژه
    cd /home/shop1111/repositories/saded
    
    # حذف node_modules و نصب مستقیم
    rm -rf node_modules
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
    
    if [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در node_modules پروژه نصب شد"
    else
        echo "✗ tailwindcss نصب نشد"
        exit 1
    fi
fi

echo ""
echo "=== برگشت به مسیر پروژه ==="
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules" ]; then
    echo "✓ node_modules یک symlink است"
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
        echo "ایجاد مجدد symlink..."
        rm -f node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
elif [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه موجود است"
else
    echo "✗ node_modules موجود نیست یا tailwindcss نصب نشده"
    exit 1
fi

echo ""
echo "=== آپدیت next.config.js برای استفاده از symlinks ==="

# بررسی و آپدیت next.config.js
if grep -q "config.resolve.symlinks = false" next.config.js; then
    echo "تغییر symlinks به true..."
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ next.config.js آپدیت شد"
fi

# بررسی venvPath
if ! grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    echo "آپدیت venvPath..."
    sed -i "s|const venvPath =.*|    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js
    echo "✓ venvPath آپدیت شد"
fi

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

npx next build --webpack 2>&1 | tee build.log

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 5 -B 5 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

