#!/bin/bash
# Build نهایی

echo "=== Build نهایی ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی tailwindcss ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
else
    echo "✗ tailwindcss در venv موجود نیست"
    exit 1
fi

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules" ]; then
    echo "✓ node_modules یک symlink است"
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
        rm -rf node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
else
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
fi

echo ""
echo "=== بررسی npx ==="
which npx || echo "npx پیدا نشد - استفاده از npm exec"

echo ""
echo "=== آپدیت next.config.js ==="
sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

# استفاده از npm exec به جای npx
npm exec next build --webpack 2>&1 | tee build.log

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
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

