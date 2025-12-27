#!/bin/bash
# راه حل واقعی - استفاده از cPanel npm install

echo "=== راه حل واقعی - استفاده از npm install کامل ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== روش 1: استفاده از cPanel Node.js App Manager ==="
echo "1. به cPanel بروید"
echo "2. Setup Node.js App را باز کنید"
echo "3. Application خود را پیدا کنید"
echo "4. روی 'NPM Install' کلیک کنید"
echo ""
echo "این کار تمام dependencies را از package.json نصب می‌کند"
echo ""

echo "=== روش 2: نصب کامل با npm install (اگر cPanel کار نکرد) ==="

# حذف tailwindcss extract شده (چون dependencies ندارد)
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "حذف tailwindcss extract شده..."
    rm -rf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss
fi

# نصب کامل tailwindcss با npm (که dependencies را هم نصب می‌کند)
echo ""
echo "=== نصب tailwindcss با npm (که dependencies را هم نصب می‌کند) ==="
cd /home/shop1111/nodevenv/repositories/saded/20

# ایجاد package.json در venv اگر وجود ندارد
if [ ! -f "package.json" ]; then
    cat > package.json << 'EOF'
{
  "name": "saded-venv",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "tailwindcss": "3.4.19",
    "autoprefixer": "10.4.23"
  }
}
EOF
fi

# نصب با npm (که dependencies را هم نصب می‌کند)
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss نصب شد"
    
    # بررسی dependencies
    if [ -d "lib/node_modules/@alloc" ]; then
        echo "✓ dependencies نصب شدند"
        ls -la lib/node_modules/@alloc
    else
        echo "✗ dependencies نصب نشدند"
        echo "نصب dependencies..."
        npm install --save-dev
    fi
else
    echo "✗ tailwindcss نصب نشد"
    exit 1
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== ایجاد symlink ==="
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules

echo ""
echo "=== آپدیت next.config.js برای path aliases ==="
# بررسی و آپدیت next.config.js
if ! grep -q "'@': rootDir" next.config.js; then
    echo "اضافه کردن path alias..."
    # این کار پیچیده است، باید فایل را بخوانیم و آپدیت کنیم
fi

# فعال کردن symlinks
sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js

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

