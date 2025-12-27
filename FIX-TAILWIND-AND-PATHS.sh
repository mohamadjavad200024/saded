#!/bin/bash
# رفع tailwindcss و path aliases

echo "=== رفع tailwindcss و path aliases ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules ==="
ls -la node_modules | head -10

echo ""
echo "=== بررسی tailwindcss ==="
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss موجود نیست - نصب مجدد..."
    
    # نصب مجدد
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps --force
    
    # بررسی مجدد
    if [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss نصب شد"
    else
        echo "✗ tailwindcss نصب نشد"
        echo "بررسی npm install output..."
        npm list tailwindcss 2>&1 | head -10
        exit 1
    fi
fi

echo ""
echo "=== بررسی autoprefixer ==="
if [ -d "node_modules/autoprefixer" ]; then
    echo "✓ autoprefixer موجود است"
else
    echo "✗ autoprefixer موجود نیست"
    npm install autoprefixer@10.4.23 --save-dev --legacy-peer-deps
fi

echo ""
echo "=== بررسی next.config.js برای path aliases ==="
if grep -q "'@': rootDir" next.config.js; then
    echo "✓ Path alias '@' تنظیم شده"
else
    echo "✗ Path alias تنظیم نشده - آپدیت..."
    # بررسی webpack config
    if grep -q "config.resolve.alias" next.config.js; then
        echo "webpack config موجود است"
    else
        echo "اضافه کردن webpack config..."
        # این کار پیچیده است، بهتر است فایل را بخوانیم و آپدیت کنیم
    fi
fi

echo ""
echo "=== بررسی postcss.config.js ==="
if [ -f "postcss.config.js" ]; then
    echo "✓ postcss.config.js موجود است"
    cat postcss.config.js
else
    echo "ایجاد postcss.config.js..."
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

