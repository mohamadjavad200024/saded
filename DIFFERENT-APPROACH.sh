#!/bin/bash
# راه حل کاملاً متفاوت - استفاده از NODE_PATH

echo "=== راه حل متفاوت - استفاده از NODE_PATH ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی tailwindcss در venv (بعد از NPM Install در cPanel) ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -5
    
    # بررسی dependencies
    if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/@alloc" ]; then
        echo "✓ dependencies موجود هستند"
    else
        echo "⚠ dependencies ممکن است نصب نشده باشند"
    fi
else
    echo "✗ tailwindcss در venv موجود نیست"
    echo ""
    echo "=== بررسی node_modules در venv ==="
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/ | grep -E "tailwind|alloc" | head -10
    
    echo ""
    echo "اگر tailwindcss نصب نشده، باید دوباره NPM Install را در cPanel انجام دهید"
    exit 1
fi

echo ""
echo "=== ایجاد symlink ==="
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از symlink قابل دسترسی است"
else
    echo "✗ tailwindcss از symlink قابل دسترسی نیست"
    echo "بررسی مسیر venv..."
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss
    exit 1
fi

echo ""
echo "=== آپدیت next.config.js ==="
# فعال کردن symlinks
sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js

# اضافه کردن NODE_PATH به webpack config
if ! grep -q "NODE_PATH" next.config.js; then
    echo "اضافه کردن NODE_PATH به webpack config..."
    # این کار پیچیده است، بهتر است از environment variable استفاده کنیم
fi

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build با NODE_PATH ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'
export NODE_PATH=/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules

npm run build 2>&1 | tee build.log

echo ""
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
fi

