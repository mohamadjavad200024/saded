#!/bin/bash
# راه حل نهایی - نصب tailwindcss در node_modules پروژه

echo "=== راه حل نهایی - نصب tailwindcss ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules فعلی ==="
if [ -L "node_modules" ]; then
    echo "node_modules یک symlink است"
    ls -la node_modules | head -3
elif [ -d "node_modules" ]; then
    echo "node_modules یک directory است"
else
    echo "node_modules موجود نیست"
fi

echo ""
echo "=== نصب tailwindcss در node_modules پروژه ==="
# نصب در مسیر پروژه - این در node_modules (که symlink است) نصب می‌شود
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps

echo ""
echo "=== بررسی نصب ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules موجود است"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss نصب نشد"
    
    # اگر symlink است، بررسی venv
    if [ -L "node_modules" ]; then
        echo "بررسی venv..."
        if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
            echo "✓ tailwindcss در venv موجود است"
        else
            echo "✗ tailwindcss در venv هم موجود نیست"
            echo "تلاش برای نصب مستقیم در venv..."
            cd /home/shop1111/nodevenv/repositories/saded/20
            npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force
            cd /home/shop1111/repositories/saded
        fi
    fi
fi

echo ""
echo "=== آپدیت next.config.js ==="

# فعال کردن symlinks
if grep -q "config.resolve.symlinks = false" next.config.js; then
    echo "فعال کردن symlinks..."
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
fi

# آپدیت venvPath
if ! grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    echo "آپدیت venvPath..."
    sed -i "s|const venvPath =.*|    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js
fi

echo ""
echo "=== بررسی postcss.config.js ==="
if [ ! -f "postcss.config.js" ]; then
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
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

npx next build --webpack 2>&1 | tee build.log

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
    echo ""
    echo "حالا می‌توانی در cPanel → Node.js App Manager → Restart App را بزنی"
else
    echo "✗ Build ناموفق بود"
    echo ""
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 10 -B 5 "Error\|error\|ERROR\|Cannot find" || tail -30 build.log
    exit 1
fi
