#!/bin/bash
# پیدا کردن tailwindcss

echo "=== پیدا کردن tailwindcss ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== بررسی node_modules پروژه ==="
if [ -d "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در node_modules پروژه موجود است"
    ls -la node_modules/tailwindcss | head -5
    TAILWIND_FOUND=true
elif [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss از طریق symlink موجود است"
    ls -la node_modules/tailwindcss | head -5
    TAILWIND_FOUND=true
else
    echo "✗ tailwindcss در node_modules پروژه موجود نیست"
    TAILWIND_FOUND=false
fi

echo ""
echo "=== بررسی venv ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv موجود است"
    ls -la /home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss | head -5
    TAILWIND_FOUND=true
else
    echo "✗ tailwindcss در venv موجود نیست"
fi

echo ""
echo "=== جستجوی tailwindcss در تمام مسیرها ==="
find /home/shop1111/nodevenv/repositories/saded/20 -name "tailwindcss" -type d 2>/dev/null | head -5
find /home/shop1111/repositories/saded -name "tailwindcss" -type d 2>/dev/null | head -5

echo ""
echo "=== بررسی package.json در venv ==="
if [ -f "/home/shop1111/nodevenv/repositories/saded/20/package.json" ]; then
    echo "✓ package.json در venv موجود است"
    grep -i tailwind /home/shop1111/nodevenv/repositories/saded/20/package.json || echo "tailwindcss در package.json venv نیست"
else
    echo "✗ package.json در venv موجود نیست"
fi

echo ""
echo "=== بررسی package.json پروژه ==="
if [ -f "package.json" ]; then
    echo "✓ package.json پروژه موجود است"
    grep -i tailwind package.json || echo "tailwindcss در package.json پروژه نیست"
fi

echo ""
if [ "$TAILWIND_FOUND" = true ]; then
    echo "✓ tailwindcss پیدا شد - می‌توانیم build کنیم"
else
    echo "✗ tailwindcss پیدا نشد"
    echo ""
    echo "راه حل:"
    echo "1. به cPanel بروید"
    echo "2. Setup Node.js App → Application خود را پیدا کنید"
    echo "3. NPM Install را بزنید"
    echo "4. یا در Terminal این دستور را اجرا کنید:"
    echo "   cd /home/shop1111/repositories/saded"
    echo "   npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev"
fi

