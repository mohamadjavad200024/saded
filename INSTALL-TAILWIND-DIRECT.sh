#!/bin/bash
# نصب مستقیم tailwindcss - راه حل قطعی

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

echo "=========================================="
echo "نصب مستقیم tailwindcss"
echo "=========================================="

cd /home/shop1111/nodevenv/public_html/saded/20

# بررسی package.json
echo "بررسی package.json..."
grep -A 2 "tailwindcss" package.json || echo "tailwindcss در package.json نیست!"

# نصب مستقیم با --save-dev
echo "نصب tailwindcss..."
npm install tailwindcss@3.4.19 --save-dev --legacy-peer-deps

# نصب autoprefixer
echo "نصب autoprefixer..."
npm install autoprefixer@10.4.23 --save-dev --legacy-peer-deps

# بررسی نصب
echo "بررسی نصب..."
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss نصب شد"
    ls -la lib/node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss هنوز نصب نشد - تلاش با force..."
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force --legacy-peer-deps
fi

# بررسی مجدد
if [ -d "lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss با موفقیت نصب شد"
else
    echo "✗ خطا: tailwindcss نصب نشد"
    echo "لیست پکیج‌های نصب شده:"
    ls lib/node_modules | grep -i tail || echo "هیچ tailwindcss پیدا نشد"
    exit 1
fi

cd /home/shop1111/public_html/saded

# ایجاد symlink
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# بررسی از طریق symlink
if [ -L "node_modules/tailwindcss" ] || [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink قابل دسترسی است"
else
    echo "✗ خطا: tailwindcss از طریق symlink قابل دسترسی نیست"
    exit 1
fi

echo "=========================================="
echo "Build"
echo "=========================================="

export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

