#!/bin/bash
# آپدیت package.json و Build

echo "=== آپدیت package.json و Build ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== آپدیت package.json ==="
# Backup
cp package.json package.json.backup

# آپدیت build script
sed -i 's|"build": "next build --webpack",|"build": "NEXT_PRIVATE_SKIP_TURBO=1 next build --webpack",|' package.json

echo "✓ package.json آپدیت شد"
echo "Build script:"
grep '"build"' package.json

echo ""
echo "=== بررسی tailwindcss ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
else
    echo "✗ tailwindcss موجود نیست"
    exit 1
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
else
    echo "✗ Build ناموفق"
    echo ""
    echo "بررسی لاگ..."
    
    # بررسی اینکه آیا webpack استفاده شده
    if grep -q "webpack" build.log && ! grep -q "Turbopack" build.log; then
        echo "✓ Webpack استفاده شده"
    else
        echo "✗ هنوز Turbopack است"
        echo ""
        echo "تلاش با روش دیگر..."
        
        # روش جایگزین: حذف symlink و نصب مستقیم
        echo ""
        echo "=== حذف symlink و نصب مستقیم ==="
        rm -rf node_modules
        npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
        
        if [ -d "node_modules/tailwindcss" ]; then
            echo "✓ tailwindcss در node_modules پروژه نصب شد"
            echo ""
            echo "=== Build مجدد ==="
            rm -rf .next
            NODE_OPTIONS='--max-old-space-size=2048' npm run build 2>&1 | tee build2.log
            
            if [ -f ".next/BUILD_ID" ]; then
                echo "✓✓✓ Build موفق بود! ✓✓✓"
                cat .next/BUILD_ID
            else
                tail -50 build2.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build2.log
            fi
        else
            tail -50 build.log | grep -A 10 "Error\|error\|ERROR" || tail -30 build.log
        fi
    fi
    exit 1
fi

