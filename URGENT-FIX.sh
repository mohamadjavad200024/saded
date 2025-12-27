#!/bin/bash
# راه حل فوری - نصب مستقیم tailwindcss

echo "=== راه حل فوری ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules ==="
if [ -L "node_modules" ]; then
    echo "node_modules یک symlink است"
    TARGET=$(readlink -f node_modules)
    echo "Symlink به: $TARGET"
    
    echo ""
    echo "=== حذف symlink و ایجاد directory ==="
    rm -f node_modules
    
    echo ""
    echo "=== نصب tailwindcss در node_modules پروژه ==="
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
    
    echo ""
    echo "=== بررسی نصب ==="
    if [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss نصب شد"
    else
        echo "✗ tailwindcss نصب نشد - تلاش با روش دیگر..."
        
        # نصب در venv
        cd /home/shop1111/nodevenv/repositories/saded/20
        npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force
        
        # ایجاد symlink
        cd /home/shop1111/repositories/saded
        rm -rf node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
else
    echo "node_modules یک directory است"
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی نهایی ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss موجود نیست"
    echo "بررسی venv..."
    if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss در venv موجود است"
        if [ ! -L "node_modules" ]; then
            echo "ایجاد symlink..."
            rm -rf node_modules
            ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
        fi
    else
        echo "✗ tailwindcss در venv هم موجود نیست"
        exit 1
    fi
fi

echo ""
echo "=== آپدیت next.config.js ==="

# فعال کردن symlinks
sed -i "s|config.resolve.symlinks = false|config.resolve.symlinks = true|" next.config.js

# آپدیت venvPath
sed -i "s|const venvPath =.*|    const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js

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

