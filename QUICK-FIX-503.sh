#!/bin/bash
# اسکریپت سریع برای رفع خطای 503

echo "=== شروع رفع خطای 503 ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

echo ""
echo "=== بررسی وضعیت فعلی ==="

# بررسی Build
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موجود است"
else
    echo "✗ Build موجود نیست - باید build کنید"
fi

# بررسی server.js
if [ -f "server.js" ]; then
    echo "✓ server.js موجود است"
else
    echo "✗ server.js موجود نیست"
fi

# بررسی Next.js
if [ -d "node_modules/next" ]; then
    echo "✓ Next.js نصب شده"
else
    echo "✗ Next.js نصب نشده"
fi

echo ""
echo "=== نصب Dependencies ==="
npm install

echo ""
echo "=== Build پروژه ==="
npm run build

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    exit 1
fi

echo ""
echo "=== بررسی لاگ‌ها ==="
if [ -f "logs/passenger.log" ]; then
    echo "آخرین خطوط لاگ:"
    tail -20 logs/passenger.log
else
    echo "لاگ passenger.log موجود نیست"
fi

echo ""
echo "=== تمام! حالا در cPanel → Node.js App Manager → Restart App را بزنید ==="

