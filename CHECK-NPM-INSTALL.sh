#!/bin/bash
# بررسی دقیق npm install

echo "=== بررسی دقیق npm install ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی npm prefix ==="
npm config get prefix
echo "which npm: $(which npm)"
echo "npm root: $(npm root)"

echo ""
echo "=== بررسی node_modules ==="
if [ -L "node_modules" ]; then
    echo "node_modules یک symlink است"
    TARGET=$(readlink -f node_modules)
    echo "Symlink به: $TARGET"
    echo "بررسی tailwindcss در venv..."
    ls -la $TARGET/tailwindcss 2>&1 | head -5
elif [ -d "node_modules" ]; then
    echo "node_modules یک directory است"
    echo "بررسی tailwindcss..."
    ls -la node_modules/tailwindcss 2>&1 | head -5
else
    echo "node_modules موجود نیست"
fi

echo ""
echo "=== نصب با npm install (با بررسی دقیق) ==="
rm -rf node_modules package-lock.json

# نصب با log بیشتر
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps --verbose 2>&1 | tee npm-install.log

echo ""
echo "=== بررسی نصب ==="
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه نصب شد"
    ls -la node_modules/tailwindcss | head -5
elif [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    ls -la node_modules/tailwindcss | head -5
else
    echo "✗ tailwindcss نصب نشد"
    echo ""
    echo "=== بررسی npm install log ==="
    tail -30 npm-install.log | grep -i "tailwind\|error\|warn" || tail -20 npm-install.log
    
    echo ""
    echo "=== بررسی npm list ==="
    npm list tailwindcss 2>&1
    
    echo ""
    echo "=== استفاده از cPanel Node.js App Manager ==="
    echo "1. به cPanel بروید"
    echo "2. Setup Node.js App را باز کنید"
    echo "3. Application خود را پیدا کنید"
    echo "4. روی 'NPM Install' کلیک کنید"
    echo ""
    echo "این کار تمام dependencies را از package.json نصب می‌کند"
    exit 1
fi

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
echo "=== Build ==="
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npm run build 2>&1 | tee build.log

echo ""
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
fi

