#!/bin/bash
# نصب tailwindcss در venv و build

echo "=== نصب tailwindcss در venv و build ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی tailwindcss در venv ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss در venv موجود نیست"
    echo ""
    echo "=== Extract tailwindcss از .tgz ==="
    
    if [ -f "tailwindcss-3.4.19.tgz" ]; then
        cd /tmp
        rm -rf package tailwindcss
        tar -xzf /home/shop1111/repositories/saded/tailwindcss-3.4.19.tgz
        if [ -d "package" ]; then
            mv package tailwindcss
            cp -r tailwindcss /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/
            echo "✓ tailwindcss به venv کپی شد"
        else
            echo "✗ extract ناموفق"
            exit 1
        fi
    else
        echo "✗ فایل tailwindcss-3.4.19.tgz موجود نیست"
        exit 1
    fi
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی autoprefixer در venv ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/autoprefixer" ]; then
    echo "✓ autoprefixer در venv موجود است"
else
    echo "✗ autoprefixer در venv موجود نیست"
    if [ -f "autoprefixer-10.4.23.tgz" ]; then
        cd /tmp
        rm -rf package autoprefixer
        tar -xzf /home/shop1111/repositories/saded/autoprefixer-10.4.23.tgz
        if [ -d "package" ]; then
            mv package autoprefixer
            cp -r autoprefixer /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/
            echo "✓ autoprefixer به venv کپی شد"
        fi
    fi
fi

cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی symlink ==="
if [ -L "node_modules" ]; then
    echo "✓ node_modules یک symlink است"
    if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
        echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
    else
        echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
        echo "ایجاد مجدد symlink..."
        rm -f node_modules
        ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
    fi
else
    echo "ایجاد symlink..."
    rm -rf node_modules
    ln -sf /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules node_modules
fi

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

