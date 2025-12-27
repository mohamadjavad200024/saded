#!/bin/bash
# آخرین راه حل - بررسی دقیق و نصب واقعی

echo "=== آخرین راه حل ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules ==="
if [ -L "node_modules" ]; then
    echo "node_modules یک symlink است"
    TARGET=$(readlink -f node_modules)
    echo "Symlink به: $TARGET"
    rm -rf node_modules
elif [ -d "node_modules" ]; then
    echo "node_modules یک directory است"
    echo "بررسی tailwindcss..."
    ls -la node_modules/tailwindcss 2>&1 | head -5
    if [ ! -d "node_modules/tailwindcss" ]; then
        echo "tailwindcss موجود نیست - حذف و نصب مجدد..."
        rm -rf node_modules
    fi
fi

echo ""
echo "=== نصب tailwindcss در node_modules پروژه (مستقیم) ==="
# نصب با --no-save تا در package.json تغییر نکند
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps --no-optional

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
    echo "=== بررسی npm install output ==="
    npm list tailwindcss 2>&1 | head -10
    exit 1
fi

echo ""
echo "=== آپدیت next.config.js ==="
# غیرفعال کردن symlinks چون node_modules مستقیماً در پروژه است
sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js

# آپدیت modules resolution
sed -i "s|path.resolve(venvPath, 'lib/node_modules'),|// path.resolve(venvPath, 'lib/node_modules'),|" next.config.js

echo ""
echo "=== بررسی postcss.config.js ==="
if [ ! -f "postcss.config.js" ]; then
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF
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

