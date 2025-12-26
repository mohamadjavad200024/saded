#!/bin/bash
# راه حل نهایی - بررسی دقیق و نصب tailwindcss

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

echo "=========================================="
echo "بررسی دقیق tailwindcss"
echo "=========================================="

cd /home/shop1111/nodevenv/public_html/saded/20

# بررسی همه مسیرهای ممکن
echo "بررسی lib/node_modules/tailwindcss..."
ls -la lib/node_modules/tailwindcss 2>/dev/null && echo "✓ پیدا شد" || echo "✗ پیدا نشد"

echo "بررسی node_modules/tailwindcss..."
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ پیدا شد" || echo "✗ پیدا نشد"

echo "جستجوی tailwindcss در همه مسیرها..."
find . -name "tailwindcss" -type d 2>/dev/null | head -5

echo "بررسی package.json..."
grep tailwindcss package.json

echo "بررسی package-lock.json..."
grep -A 2 "tailwindcss" package-lock.json 2>/dev/null | head -5 || echo "package-lock.json وجود ندارد"

echo "=========================================="
echo "نصب مجدد tailwindcss"
echo "=========================================="

# حذف cache npm
npm cache clean --force

# نصب مجدد
npm install tailwindcss@3.4.19 --save-dev --no-save --force

# بررسی مجدد
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss نصب شد"
    ls -la lib/node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss هنوز نصب نشد"
    echo "لیست پکیج‌های نصب شده:"
    ls lib/node_modules | grep -i tail || echo "هیچ tailwindcss پیدا نشد"
    
    # نصب با روش دیگر
    echo "تلاش با روش دیگر..."
    cd lib/node_modules
    npm install tailwindcss@3.4.19 --save-dev --force 2>&1 | head -10
    cd ../..
fi

cd /home/shop1111/public_html/saded

# ایجاد symlink
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# بررسی از طریق symlink
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
else
    echo "✗ tailwindcss از طریق symlink قابل دسترسی نیست"
    echo "لیست node_modules:"
    ls node_modules | head -10
fi

echo "=========================================="
echo "Build"
echo "=========================================="

export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

