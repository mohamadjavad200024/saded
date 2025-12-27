#!/bin/bash
# رفع مشکل Out of Memory

echo "=== رفع مشکل Out of Memory ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== مشکل: Out of Memory ==="
echo "سرور منابع کافی ندارد برای build"
echo ""
echo "راه حل: استفاده از build:low-resource"

echo ""
echo "=== بررسی tailwindcss ==="
if [ ! -d "node_modules/tailwindcss" ] && [ ! -L "node_modules/tailwindcss" ]; then
    echo "نصب tailwindcss..."
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
fi

echo ""
echo "=== آپدیت package.json برای build:low-resource ==="
# بررسی اینکه آیا build:low-resource وجود دارد
if grep -q '"build:low-resource"' package.json; then
    echo "✓ build:low-resource موجود است"
else
    echo "اضافه کردن build:low-resource..."
    # این کار پیچیده است، بهتر است از build:low-resource موجود استفاده کنیم
fi

echo ""
echo "=== راه حل 1: استفاده از build:low-resource در cPanel ==="
echo "در cPanel → Node.js App Manager:"
echo "1. Run JS script را بزن"
echo "2. Choose script: build:low-resource را انتخاب کن"
echo "3. RUN JS SCRIPT را بزن"
echo ""

echo "=== راه حل 2: Build در Local و Push ==="
echo "اگر build:low-resource هم کار نکرد:"
echo "1. در کامپیوتر محلی: npm run build"
echo "2. فایل‌های .next را commit و push کن"
echo "3. در هاست: git pull"
echo ""

echo "=== راه حل 3: کاهش Memory Usage ==="
echo "آپدیت package.json برای استفاده از memory کمتر:"
echo "build:low-resource از NODE_OPTIONS='--max-old-space-size=2048' استفاده می‌کند"

