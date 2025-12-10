#!/bin/bash

# اسکریپت نهایی رفع خطای 503
# این اسکریپت تمام مراحل لازم برای رفع خطای 503 را انجام می‌دهد

echo "🔧 شروع رفع خطای 503..."
echo ""

cd ~/public_html/saded

# 1. حل conflict در package-lock.json
echo "1️⃣ حل conflict در package-lock.json:"
git checkout HEAD -- package-lock.json
echo "   ✅ package-lock.json reset شد"
echo ""

# 2. Pull تغییرات از Git
echo "2️⃣ Pull تغییرات از Git:"
git pull origin main
echo ""

# 3. بررسی وجود BUILD_ID
echo "3️⃣ بررسی BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
    echo "   ✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "   ❌ BUILD_ID موجود نیست!"
    echo "   ⚠️  باید از Git pull کنید یا build کنید"
    exit 1
fi
echo ""

# 4. بررسی فایل‌های مهم
echo "4️⃣ بررسی فایل‌های مهم:"
if [ -d ".next/server" ]; then
    echo "   ✅ .next/server موجود است"
    SERVER_COUNT=$(find .next/server -type f | wc -l)
    echo "   📊 تعداد فایل‌ها: $SERVER_COUNT"
else
    echo "   ❌ .next/server موجود نیست!"
    exit 1
fi

if [ -d ".next/static" ]; then
    echo "   ✅ .next/static موجود است"
    STATIC_COUNT=$(find .next/static -type f | wc -l)
    echo "   📊 تعداد فایل‌ها: $STATIC_COUNT"
else
    echo "   ❌ .next/static موجود نیست!"
    exit 1
fi

if [ -f "server.js" ]; then
    echo "   ✅ server.js موجود است"
else
    echo "   ❌ server.js موجود نیست!"
    exit 1
fi
echo ""

# 5. بررسی environment variables
echo "5️⃣ بررسی Environment Variables:"
if [ -f ".env" ]; then
    echo "   ✅ .env موجود است"
    if grep -q "DB_PASSWORD" .env; then
        echo "   ✅ DB_PASSWORD تنظیم شده است"
    else
        echo "   ⚠️  DB_PASSWORD تنظیم نشده است!"
    fi
else
    echo "   ⚠️  .env موجود نیست!"
fi
echo ""

# 6. Stop و Delete PM2
echo "6️⃣ Stop و Delete PM2:"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded 2>/dev/null || true
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded 2>/dev/null || true
echo "   ✅ PM2 process حذف شد"
echo ""

# 7. Start PM2 با config جدید
echo "7️⃣ Start PM2 با config جدید:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start ecosystem.config.js
echo ""

# 8. Save PM2
echo "8️⃣ Save PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
echo ""

# 9. صبر برای راه‌اندازی
echo "9️⃣ صبر برای راه‌اندازی سرور..."
sleep 10
echo ""

# 10. بررسی وضعیت نهایی
echo "🔟 بررسی وضعیت نهایی PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 11. بررسی لاگ‌های جدید
echo "1️⃣1️⃣ بررسی آخرین لاگ‌ها:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 10 --nostream | tail -20
echo ""

# 12. تست Health Check
echo "1️⃣2️⃣ تست Health Check:"
curl -s "http://localhost:3001/api/health/db" | head -c 500
echo ""
echo ""

echo "✅ بررسی کامل شد!"
echo ""
echo "💡 اگر هنوز خطا دارید:"
echo "   1. بررسی کنید که BUILD_ID موجود است: cat .next/BUILD_ID"
echo "   2. بررسی کنید که .next/server موجود است: ls -la .next/server | head"
echo "   3. بررسی لاگ‌های PM2: pm2 logs saded --lines 50"

