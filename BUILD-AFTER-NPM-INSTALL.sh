#!/bin/bash
# Build بعد از NPM Install در cPanel

echo "=== Build بعد از NPM Install ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی tailwindcss ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss موجود نیست"
    echo "بررسی venv..."
    if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در venv موجود است"
        if [ ! -L "node_modules" ]; then
            rm -rf node_modules
            ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
        fi
    else
        echo "✗ tailwindcss در venv هم موجود نیست"
        exit 1
    fi
fi

echo ""
echo "=== بررسی autoprefixer ==="
if [ -d "node_modules/autoprefixer" ] || [ -L "node_modules/autoprefixer" ]; then
    echo "✓ autoprefixer موجود است"
else
    echo "✗ autoprefixer موجود نیست"
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
echo "=== آپدیت next.config.js ==="
# اگر node_modules symlink است، symlinks را فعال کن
if [ -L "node_modules" ]; then
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ symlinks فعال شد"
else
    sed -i "s|config.resolve.symlinks = true|config.resolve.symlinks = false|" next.config.js
    echo "✓ symlinks غیرفعال شد"
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
    echo "سپس سایت را در مرورگر باز کن"
else
    echo "✗ Build ناموفق"
    echo ""
    echo "آخرین خطوط لاگ:"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
    exit 1
fi

