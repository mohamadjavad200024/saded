#!/bin/bash
# بررسی و نصب tailwindcss

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

echo "=========================================="
echo "بررسی tailwindcss"
echo "=========================================="

# بررسی در node_modules کپی شده
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پیدا شد"
    ls -la node_modules/tailwindcss | head -3
else
    echo "✗ tailwindcss در node_modules پیدا نشد"
fi

# بررسی در venv
if [ -d "/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv پیدا شد"
else
    echo "✗ tailwindcss در venv پیدا نشد - در حال نصب..."
    cd /home/shop1111/nodevenv/public_html/saded/20
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force
    cd /home/shop1111/public_html/saded
fi

echo "=========================================="
echo "نصب مستقیم tailwindcss در پروژه"
echo "=========================================="

# نصب مستقیم در پروژه (بدون استفاده از venv)
cd /home/shop1111/public_html/saded
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force

# بررسی نصب
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss با موفقیت نصب شد"
else
    echo "✗ خطا در نصب tailwindcss"
    exit 1
fi

echo "=========================================="
echo "Build"
echo "=========================================="

export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

