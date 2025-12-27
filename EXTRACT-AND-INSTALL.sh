#!/bin/bash
# Extract و نصب مستقیم tailwindcss

echo "=== Extract و نصب مستقیم tailwindcss ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی فایل‌های .tgz ==="
if [ -f "tailwindcss-3.4.19.tgz" ]; then
    echo "✓ tailwindcss-3.4.19.tgz موجود است"
else
    echo "✗ tailwindcss-3.4.19.tgz موجود نیست"
    exit 1
fi

if [ -f "autoprefixer-10.4.23.tgz" ]; then
    echo "✓ autoprefixer-10.4.23.tgz موجود است"
else
    echo "✗ autoprefixer-10.4.23.tgz موجود نیست"
    exit 1
fi

echo ""
echo "=== Extract tailwindcss ==="
cd /tmp
rm -rf package tailwindcss
tar -xzf /home/shop1111/repositories/saded/tailwindcss-3.4.19.tgz

if [ -d "package" ]; then
    echo "✓ tailwindcss extract شد"
    mv package tailwindcss
    
    echo ""
    echo "=== کپی tailwindcss به venv ==="
    cp -r tailwindcss /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/
    echo "✓ tailwindcss کپی شد"
else
    echo "✗ tailwindcss extract نشد"
    exit 1
fi

echo ""
echo "=== Extract autoprefixer ==="
rm -rf package autoprefixer
tar -xzf /home/shop1111/repositories/saded/autoprefixer-10.4.23.tgz

if [ -d "package" ]; then
    echo "✓ autoprefixer extract شد"
    mv package autoprefixer
    
    echo ""
    echo "=== کپی autoprefixer به venv ==="
    cp -r autoprefixer /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/
    echo "✓ autoprefixer کپی شد"
else
    echo "✗ autoprefixer extract نشد"
    exit 1
fi

echo ""
echo "=== بررسی نصب ==="
cd /home/shop1111/repositories/saded

if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss در venv موجود نیست"
    exit 1
fi

if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/autoprefixer" ]; then
    echo "✓ autoprefixer در venv موجود است"
else
    echo "✗ autoprefixer در venv موجود نیست"
    exit 1
fi

echo ""
echo "=== ایجاد symlink ==="
if [ ! -L "node_modules" ]; then
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    echo "✓ symlink ایجاد شد"
fi

echo ""
echo "=== بررسی tailwindcss از طریق symlink ==="
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
else
    echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
    exit 1
fi

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

npx next build --webpack 2>&1 | tee build.log

echo ""
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
    echo ""
    echo "حالا می‌توانی در cPanel → Node.js App Manager → Restart App را بزنی"
else
    echo "✗ Build ناموفق"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

