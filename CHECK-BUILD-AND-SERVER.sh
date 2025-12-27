#!/bin/bash
# بررسی Build و سرور

echo "=== بررسی Build و سرور ==="

source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded

echo ""
echo "=== 1. بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بوده"
    echo "Build ID:"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق - .next/BUILD_ID موجود نیست"
    echo ""
    echo "بررسی .next directory:"
    ls -la .next 2>&1 | head -10
fi

echo ""
echo "=== 2. بررسی لاگ‌های Build ==="
# لاگ‌های cPanel معمولاً در این مسیرها هستند:
if [ -f "logs/passenger.log" ]; then
    echo "آخرین خطوط passenger.log:"
    tail -50 logs/passenger.log | grep -A 5 -B 5 "Error\|error\|ERROR\|Build\|build" || tail -30 logs/passenger.log
fi

echo ""
echo "=== 3. بررسی سرور ==="
# بررسی اینکه آیا سرور در حال اجرا است
ps aux | grep -E "node|next|server.js" | grep -v grep || echo "هیچ process node پیدا نشد"

echo ""
echo "=== 4. بررسی پورت ==="
netstat -tulpn 2>/dev/null | grep -E ":3000|:3001|node" || ss -tulpn 2>/dev/null | grep -E ":3000|:3001|node" || echo "پورت پیدا نشد"

echo ""
echo "=== 5. بررسی tailwindcss ==="
if [ -d "node_modules/tailwindcss" ] || [ -L "node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss موجود است"
else
    echo "✗ tailwindcss موجود نیست"
    echo "نصب tailwindcss..."
    npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
fi

echo ""
echo "=== 6. بررسی next.config.js ==="
if [ -f "next.config.js" ]; then
    echo "✓ next.config.js موجود است"
    grep "symlinks" next.config.js
else
    echo "✗ next.config.js موجود نیست"
fi

echo ""
echo "=== 7. راه حل ==="
echo "اگر Build ناموفق بوده:"
echo "1. در cPanel → Node.js App Manager"
echo "2. Run JS script → build را دوباره اجرا کن"
echo "3. یا از Terminal: npm run build"
echo ""
echo "اگر Build موفق بوده اما 503 می‌دهد:"
echo "1. در cPanel → Node.js App Manager"
echo "2. Restart App را بزن"
echo "3. 30 ثانیه صبر کن"
echo "4. View Logs را بزن و خطاها را بررسی کن"

