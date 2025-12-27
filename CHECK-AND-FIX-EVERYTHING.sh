#!/bin/bash
# بررسی کامل و رفع همه مشکلات

echo "=== بررسی کامل ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== 1. بررسی tailwindcss در venv ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -3
    
    # بررسی dependencies
    if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/@alloc" ]; then
        echo "✓ dependencies موجود هستند"
        ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/@alloc
    else
        echo "✗ dependencies موجود نیستند"
    fi
else
    echo "✗ tailwindcss در venv موجود نیست"
    echo "نصب مجدد..."
    cd /home/shop1111/nodevenv/repositories/saded/20
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev
    cd /home/shop1111/repositories/saded
fi

echo ""
echo "=== 2. بررسی symlink ==="
if [ -L "node_modules" ]; then
    echo "✓ node_modules یک symlink است"
    TARGET=$(readlink -f node_modules)
    echo "Symlink به: $TARGET"
    
    # بررسی tailwindcss از طریق symlink
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
        ls -la node_modules/tailwindcss | head -3
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
        echo "ایجاد مجدد symlink..."
        rm -f node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
        echo "✓ symlink ایجاد شد"
        
        # بررسی مجدد
        if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
            echo "✓ حالا tailwindcss قابل دسترسی است"
        else
            echo "✗ هنوز قابل دسترسی نیست"
            echo "بررسی مسیر venv..."
            ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss
        fi
    fi
else
    echo "✗ node_modules یک symlink نیست"
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
fi

echo ""
echo "=== 3. بررسی next.config.js ==="
# بررسی symlinks
if grep -q "config.resolve.symlinks = true" next.config.js; then
    echo "✓ symlinks فعال است"
else
    echo "✗ symlinks فعال نیست - آپدیت..."
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
fi

# بررسی path alias
if grep -q "'@': rootDir" next.config.js; then
    echo "✓ Path alias '@' تنظیم شده"
else
    echo "✗ Path alias تنظیم نشده"
fi

echo ""
echo "=== 4. بررسی postcss.config.js ==="
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
    
    # بررسی دقیق‌تر
    echo ""
    echo "=== بررسی دقیق‌تر ==="
    echo "tailwindcss در venv:"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss 2>&1 | head -5
    
    echo ""
    echo "tailwindcss از طریق symlink:"
    ls -la node_modules/tailwindcss 2>&1 | head -5
    
    echo ""
    echo "next.config.js symlinks:"
    grep "symlinks" next.config.js
fi

