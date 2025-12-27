#!/bin/bash
# راه حل نهایی و واقعی

echo "=== راه حل نهایی ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== مشکل: tailwindcss extract شده dependencies ندارد ==="
echo "راه حل: حذف و نصب کامل با npm install"

# حذف tailwindcss extract شده
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "حذف tailwindcss extract شده..."
    rm -rf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss
fi

echo ""
echo "=== نصب کامل tailwindcss با npm (که dependencies را هم نصب می‌کند) ==="
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

# نصب کامل (که dependencies را هم نصب می‌کند)
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss نصب شد"
    
    # بررسی dependencies
    if [ -d "lib/node_modules/@alloc" ]; then
        echo "✓ dependencies نصب شدند"
    else
        echo "⚠ dependencies ممکن است نصب نشده باشند"
        echo "نصب مجدد برای اطمینان..."
        npm install
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
echo "=== آپدیت next.config.js ==="
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

