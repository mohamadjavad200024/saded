#!/bin/bash
# نصب نهایی tailwindcss و رفع مشکلات

echo "=== نصب tailwindcss در virtual environment ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی مسیر venv ==="
echo "VENV: $VIRTUAL_ENV"
echo "NPM: $(which npm)"
echo "NODE: $(which node)"

echo ""
echo "=== بررسی node_modules در venv ==="
ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/ | head -10

echo ""
echo "=== نصب tailwindcss در venv (با npm از venv) ==="
cd /home/shop1111/nodevenv/repositories/saded/20
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -5
else
    echo "✗ tailwindcss نصب نشد - تلاش با روش دیگر..."
    
    # روش جایگزین: نصب در مسیر پروژه با npm از venv
    cd /home/shop1111/repositories/saded
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
    
    # بررسی symlink
    if [ -L "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در node_modules (symlink) موجود است"
        ls -la node_modules/tailwindcss
    fi
fi

echo ""
echo "=== بررسی next.config.js ==="
cd /home/shop1111/repositories/saded
grep -A 5 "venvPath" next.config.js

echo ""
echo "=== آپدیت next.config.js برای path resolution ==="

# بررسی و آپدیت next.config.js
if ! grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    echo "آپدیت next.config.js..."
    sed -i "s|const venvPath = .*|const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js
fi

echo ""
echo "=== بررسی postcss.config.js ==="
if [ -f "postcss.config.js" ]; then
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
    tail -30 build.log
    exit 1
fi

