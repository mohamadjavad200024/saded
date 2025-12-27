#!/bin/bash
# راه حل کاملاً متفاوت

echo "=== راه حل متفاوت ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== 1. بررسی tailwindcss در venv ==="
VENV_TAILWIND="/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss"
if [ -d "$VENV_TAILWIND" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la "$VENV_TAILWIND" | head -3
else
    echo "✗ tailwindcss در venv موجود نیست"
    echo ""
    echo "لطفاً دوباره NPM Install را در cPanel انجام دهید"
    echo "1. cPanel → Setup Node.js App"
    echo "2. Application خود را پیدا کنید"
    echo "3. NPM Install را بزنید"
    exit 1
fi

echo ""
echo "=== 2. ایجاد symlink ==="
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules

echo ""
echo "=== 3. بررسی symlink ==="
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از symlink قابل دسترسی است"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss از symlink قابل دسترسی نیست"
    echo "بررسی مسیر venv..."
    ls -la "$VENV_TAILWIND"
    exit 1
fi

echo ""
echo "=== 4. آپدیت next.config.js (من آپدیت کردم) ==="
# Pull تغییرات
git pull origin main 2>/dev/null || echo "git pull failed - ادامه..."

# یا دستی آپدیت کن
# next.config.js باید fallback برای tailwindcss داشته باشد

echo ""
echo "=== 5. پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== 6. Build با NODE_PATH ==="
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

