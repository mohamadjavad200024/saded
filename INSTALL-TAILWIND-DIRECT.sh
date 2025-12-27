#!/bin/bash
# نصب مستقیم tailwindcss در venv

echo "=== نصب مستقیم tailwindcss در venv ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

echo ""
echo "=== بررسی مسیر venv ==="
echo "VIRTUAL_ENV: $VIRTUAL_ENV"
echo "npm prefix: $(npm config get prefix)"
echo "which npm: $(which npm)"

echo ""
echo "=== رفتن به مسیر venv ==="
cd /home/shop1111/nodevenv/repositories/saded/20

echo ""
echo "=== بررسی package.json در venv ==="
if [ -f "package.json" ]; then
    echo "✓ package.json موجود است"
    cat package.json | head -20
else
    echo "✗ package.json موجود نیست - ایجاد..."
    cat > package.json << 'EOF'
{
  "name": "saded-venv",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {}
}
EOF
fi

echo ""
echo "=== نصب tailwindcss در venv (با cd به venv) ==="
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
    ls -la lib/node_modules/tailwindcss | head -5
else
    echo "✗ tailwindcss نصب نشد"
    echo "بررسی مسیرهای دیگر..."
    find . -name "tailwindcss" -type d 2>/dev/null | head -5
    exit 1
fi

echo ""
echo "=== برگشت به مسیر پروژه ==="
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules" ]; then
    echo "✓ node_modules یک symlink است"
    ls -la node_modules | head -3
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
        echo "ایجاد مجدد symlink..."
        rm -f node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
else
    echo "✗ node_modules یک symlink نیست"
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
fi

echo ""
echo "=== بررسی next.config.js ==="
if grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    echo "✓ next.config.js درست است"
else
    echo "✗ next.config.js نیاز به آپدیت دارد"
    # آپدیت next.config.js
    sed -i "s|const venvPath =.*|    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js
    echo "✓ next.config.js آپدیت شد"
fi

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

npx next build --webpack 2>&1 | tee build.log

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 5 -B 5 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi
