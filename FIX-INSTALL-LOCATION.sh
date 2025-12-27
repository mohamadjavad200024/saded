#!/bin/bash
# بررسی و رفع محل نصب tailwindcss

echo "=== بررسی محل نصب tailwindcss ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules پروژه ==="
if [ -L "node_modules" ]; then
    echo "node_modules یک symlink است"
    TARGET=$(readlink -f node_modules)
    echo "Symlink به: $TARGET"
elif [ -d "node_modules" ]; then
    echo "node_modules یک directory است"
else
    echo "node_modules موجود نیست"
fi

echo ""
echo "=== بررسی tailwindcss در venv ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شده"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -3
    
    echo ""
    echo "=== ایجاد symlink ==="
    if [ ! -L "node_modules" ]; then
        rm -rf node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
        echo "✓ symlink ایجاد شد"
    fi
    
    echo ""
    echo "=== بررسی tailwindcss از طریق symlink ==="
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
    fi
else
    echo "✗ tailwindcss در venv نصب نشده"
    echo ""
    echo "=== نصب در venv ==="
    cd /home/shop1111/nodevenv/repositories/saded/20
    npm install /home/shop1111/repositories/saded/tailwindcss-3.4.19.tgz /home/shop1111/repositories/saded/autoprefixer-10.4.23.tgz --save-dev
    
    echo ""
    echo "=== بررسی نصب ==="
    if [ -d "lib/node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در venv نصب شد"
    else
        echo "✗ tailwindcss نصب نشد"
        exit 1
    fi
    
    echo ""
    echo "=== ایجاد symlink ==="
    cd /home/shop1111/repositories/saded
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    echo "✓ symlink ایجاد شد"
fi

echo ""
echo "=== آپدیت next.config.js ==="

# فعال کردن symlinks
if grep -q "config.resolve.symlinks = false" next.config.js; then
    sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js
    echo "✓ symlinks فعال شد"
fi

# آپدیت venvPath
if ! grep -q "const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';" next.config.js; then
    sed -i "s|const venvPath =.*|    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js
    echo "✓ venvPath آپدیت شد"
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
if [ -f ".next/BUILD_ID" ]; then
    echo "✓✓✓ Build موفق بود! ✓✓✓"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق"
    tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
fi

