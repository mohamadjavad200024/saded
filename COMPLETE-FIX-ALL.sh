#!/bin/bash
# راه حل کامل - همه چیز در یک جا

echo "=== راه حل کامل ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه (مهم!)
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی مسیر فعلی ==="
pwd
echo "VIRTUAL_ENV: $VIRTUAL_ENV"

echo ""
echo "=== 1. نصب tailwindcss در venv ==="
cd /home/shop1111/nodevenv/repositories/saded/20

# ایجاد package.json در venv
if [ ! -f "package.json" ]; then
    cat > package.json << 'EOF'
{
  "name": "saded-venv",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {}
}
EOF
fi

# نصب tailwindcss
echo "نصب tailwindcss..."
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
    ls -la lib/node_modules/tailwindcss | head -3
    
    # بررسی dependencies
    if [ -d "lib/node_modules/@alloc" ]; then
        echo "✓ dependencies موجود هستند"
    else
        echo "⚠ dependencies ممکن است نصب نشده باشند"
        echo "نصب مجدد..."
        npm install
    fi
else
    echo "✗ tailwindcss نصب نشد"
    exit 1
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== 2. ایجاد symlink ==="
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
else
    echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
    echo "بررسی venv..."
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss
    exit 1
fi

echo ""
echo "=== 3. آپدیت next.config.js ==="
if [ -f "next.config.js" ]; then
    # فعال کردن symlinks
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ next.config.js آپدیت شد"
else
    echo "✗ next.config.js موجود نیست"
    exit 1
fi

echo ""
echo "=== 4. بررسی postcss.config.js ==="
if [ ! -f "postcss.config.js" ]; then
    cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF
    echo "✓ postcss.config.js ایجاد شد"
fi

echo ""
echo "=== 5. پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== 6. Build ==="
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

