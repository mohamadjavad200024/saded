#!/bin/bash
# اسکریپت رفع کامل مشکلات deployment
# این اسکریپت تمام مشکلات را برطرف می‌کند

set -e  # در صورت خطا متوقف شود

echo "=========================================="
echo "شروع رفع مشکلات deployment..."
echo "=========================================="

# فعال‌سازی virtual environment
echo "فعال‌سازی virtual environment..."
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# 1. حل مشکل git pull - backup کردن server.js محلی
echo "=========================================="
echo "مرحله 1: حل مشکل git pull..."
echo "=========================================="
if [ -f "server.js" ]; then
    echo "پشتیبان‌گیری از server.js محلی..."
    cp server.js server.js.backup
fi

# Pull با overwrite کردن فایل‌های محلی
echo "دریافت تغییرات از repository..."
git fetch origin main
git reset --hard origin/main

# اگر server.js.backup وجود داشت و server.js جدید متفاوت است، می‌توانید آن را restore کنید
# اما معمولاً بهتر است از نسخه repository استفاده شود

# 2. بررسی package.json
echo "=========================================="
echo "مرحله 2: بررسی package.json..."
echo "=========================================="
if [ ! -f "package.json" ]; then
    echo "خطا: package.json پیدا نشد!"
    exit 1
fi

# نمایش تعداد dependencies
DEP_COUNT=$(cat package.json | grep -c '"' || echo "0")
echo "تعداد dependencies در package.json: $DEP_COUNT"

# 3. حذف node_modules و package-lock.json
echo "=========================================="
echo "مرحله 3: پاک‌سازی dependencies قدیمی..."
echo "=========================================="
rm -rf node_modules
rm -f package-lock.json

# 4. نصب dependencies در virtual environment
echo "=========================================="
echo "مرحله 4: نصب dependencies..."
echo "=========================================="
cd /home/shop1111/nodevenv/public_html/saded/20

# کپی package.json به venv
cp /home/shop1111/public_html/saded/package.json .

# حذف node_modules در venv
rm -rf lib/node_modules package-lock.json

# نصب dependencies
echo "در حال نصب dependencies (این ممکن است چند دقیقه طول بکشد)..."
npm install

# بررسی نصب Next.js
if [ ! -d "lib/node_modules/next" ]; then
    echo "خطا: Next.js نصب نشد! در حال نصب دستی..."
    npm install next@16.0.3 --save
fi

# 5. ایجاد symlink
echo "=========================================="
echo "مرحله 5: ایجاد symlink..."
echo "=========================================="
cd /home/shop1111/public_html/saded

# حذف symlink قدیمی اگر وجود دارد
rm -rf node_modules

# ایجاد symlink جدید
VENV_NODE_MODULES="/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules"
ln -sf "$VENV_NODE_MODULES" node_modules

# بررسی symlink
if [ -L "node_modules" ]; then
    echo "✓ Symlink ایجاد شد"
else
    echo "✗ خطا در ایجاد symlink"
    exit 1
fi

# 6. بررسی نصب dependencies مهم
echo "=========================================="
echo "مرحله 6: بررسی نصب dependencies..."
echo "=========================================="
MISSING_DEPS=0

check_dep() {
    if [ -d "node_modules/$1" ]; then
        echo "✓ $1 نصب شده"
    else
        echo "✗ $1 نصب نشده!"
        MISSING_DEPS=1
    fi
}

check_dep "next"
check_dep "react"
check_dep "react-dom"
check_dep "mysql2"
check_dep "next-auth"

if [ $MISSING_DEPS -eq 1 ]; then
    echo "برخی dependencies نصب نشده‌اند. در حال نصب مجدد..."
    cd /home/shop1111/nodevenv/public_html/saded/20
    npm install --force
    cd /home/shop1111/public_html/saded
fi

# 7. Build پروژه
echo "=========================================="
echo "مرحله 7: Build پروژه..."
echo "=========================================="
cd /home/shop1111/public_html/saded

# حذف build قدیمی
rm -rf .next

# Build با تنظیمات کم‌منابع
NODE_OPTIONS='--max-old-space-size=2048' npm run build

# بررسی build
if [ ! -d ".next" ]; then
    echo "خطا: Build ناموفق بود!"
    exit 1
fi

echo "=========================================="
echo "✓ تمام مراحل با موفقیت انجام شد!"
echo "=========================================="
echo ""
echo "حالا می‌توانید سرور را راه‌اندازی کنید:"
echo "  npm start"
echo "  یا"
echo "  pm2 start ecosystem.config.js"
echo ""

