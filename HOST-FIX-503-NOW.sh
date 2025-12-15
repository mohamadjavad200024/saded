#!/bin/bash

# اسکریپت تشخیص و رفع خطای 503
# این اسکریپت تمام مشکلات احتمالی را بررسی و رفع می‌کند

echo "=========================================="
echo "🔧 تشخیص و رفع خطای 503..."
echo "=========================================="

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# 1. بررسی وضعیت PM2
echo ""
echo "1️⃣ بررسی وضعیت PM2..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
echo ""

# 2. بررسی لاگ‌های خطا
echo "2️⃣ بررسی آخرین خطاهای PM2..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 30 --err --nostream 2>/dev/null | tail -40
echo ""

# 3. بررسی فایل‌های بیلد
echo "3️⃣ بررسی فایل‌های بیلد..."
echo "=========================================="

BUILD_ID_EXISTS=false
SERVER_EXISTS=false
STATIC_EXISTS=false

if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "✅ BUILD_ID موجود است: $BUILD_ID"
    BUILD_ID_EXISTS=true
else
    echo "❌ BUILD_ID موجود نیست!"
fi

if [ -d ".next/server" ]; then
    SERVER_COUNT=$(find .next/server -type f | wc -l)
    echo "✅ .next/server موجود است ($SERVER_COUNT فایل)"
    SERVER_EXISTS=true
else
    echo "❌ .next/server موجود نیست!"
fi

if [ -d ".next/static" ]; then
    STATIC_COUNT=$(find .next/static -type f | wc -l)
    echo "✅ .next/static موجود است ($STATIC_COUNT فایل)"
    STATIC_EXISTS=true
else
    echo "❌ .next/static موجود نیست!"
fi

# 4. اگر فایل‌های بیلد وجود ندارند، pull از Git
if [ "$BUILD_ID_EXISTS" = false ] || [ "$SERVER_EXISTS" = false ] || [ "$STATIC_EXISTS" = false ]; then
    echo ""
    echo "4️⃣ فایل‌های بیلد ناقص هستند. Pull از Git..."
    echo "=========================================="
    git pull origin main
    echo ""
    
    # بررسی مجدد
    if [ -f ".next/BUILD_ID" ] && [ -d ".next/server" ] && [ -d ".next/static" ]; then
        echo "✅ فایل‌های بیلد بعد از pull موجود شدند"
    else
        echo "⚠️  فایل‌های بیلد هنوز موجود نیستند!"
        echo "   باید از محیط محلی بیلد کنید و push کنید"
    fi
fi

# 5. Stop کردن PM2 اگر در حال اجرا است
echo ""
echo "5️⃣ Stop کردن PM2 (اگر در حال اجرا است)..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded 2>/dev/null
sleep 2

# 6. حذف process قدیمی
echo ""
echo "6️⃣ حذف process قدیمی..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded 2>/dev/null
sleep 1

# 7. بررسی وجود server.js
echo ""
echo "7️⃣ بررسی فایل‌های ضروری..."
echo "=========================================="
if [ -f "server.js" ]; then
    echo "✅ server.js موجود است"
else
    echo "❌ server.js موجود نیست!"
    exit 1
fi

if [ -f "ecosystem.config.js" ]; then
    echo "✅ ecosystem.config.js موجود است"
else
    echo "⚠️  ecosystem.config.js موجود نیست (استفاده از server.js مستقیم)"
fi

# 8. Start کردن PM2
echo ""
echo "8️⃣ Start کردن PM2..."
echo "=========================================="

if [ -f "ecosystem.config.js" ]; then
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
else
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start server.js \
        --name saded \
        --env production \
        --update-env \
        -- NODE_ENV=production PORT=3001 HOSTNAME=0.0.0.0
fi

PM2_EXIT_CODE=$?

if [ $PM2_EXIT_CODE -eq 0 ]; then
    echo "✅ PM2 start شد"
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
else
    echo "❌ PM2 start نشد!"
fi

# 9. صبر برای راه‌اندازی
echo ""
echo "9️⃣ صبر برای راه‌اندازی سرور..."
echo "=========================================="
sleep 5

# 10. بررسی وضعیت نهایی
echo ""
echo "🔟 بررسی وضعیت نهایی..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
echo ""

# 11. بررسی لاگ‌های جدید
echo ""
echo "1️⃣1️⃣ آخرین خروجی‌های PM2..."
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20 --nostream 2>/dev/null | tail -30
echo ""

# 12. تست localhost
echo ""
echo "1️⃣2️⃣ تست localhost:3001..."
echo "=========================================="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3001/ || echo "❌ سرور پاسخ نمی‌دهد"
echo ""

echo "=========================================="
echo "✅ بررسی کامل شد!"
echo "=========================================="
echo ""
echo "💡 اگر هنوز خطای 503 دارید:"
echo "   1. لاگ‌های کامل را بررسی کنید:"
echo "      pm2 logs saded --lines 100"
echo ""
echo "   2. مطمئن شوید که فایل‌های بیلد کامل هستند:"
echo "      ls -la .next/BUILD_ID"
echo "      ls -la .next/server/ | head"
echo "      ls -la .next/static/ | head"
echo ""
echo "   3. بررسی کنید که پورت 3001 در دسترس است:"
echo "      netstat -tuln | grep 3001"
echo ""

