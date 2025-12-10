#!/bin/bash

# اسکریپت کامل رفع خطای 503
# این اسکریپت تمام مراحل لازم برای رفع خطای 503 را انجام می‌دهد

echo "🔧 شروع رفع خطای 503..."
echo ""

cd ~/public_html/saded

# 1. بررسی وضعیت PM2
echo "1️⃣ بررسی وضعیت PM2:"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 2. بررسی لاگ‌های PM2 برای خطاها
echo "2️⃣ بررسی آخرین خطاهای PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 20 --err --nostream | tail -30
echo ""

# 3. بررسی وجود BUILD_ID
echo "3️⃣ بررسی BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
    echo "   ✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "   ❌ BUILD_ID موجود نیست!"
    echo "   ⚠️  باید از Git pull کنید"
fi
echo ""

# 4. بررسی فایل‌های مهم
echo "4️⃣ بررسی فایل‌های مهم:"
if [ -d ".next/server" ]; then
    echo "   ✅ .next/server موجود است"
else
    echo "   ❌ .next/server موجود نیست!"
fi

if [ -d ".next/static" ]; then
    echo "   ✅ .next/static موجود است"
else
    echo "   ❌ .next/static موجود نیست!"
fi

if [ -f "server.js" ]; then
    echo "   ✅ server.js موجود است"
else
    echo "   ❌ server.js موجود نیست!"
fi
echo ""

# 5. Pull تغییرات از Git
echo "5️⃣ Pull تغییرات از Git:"
git pull origin main
echo ""

# 6. بررسی environment variables
echo "6️⃣ بررسی Environment Variables:"
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

# 7. Restart PM2
echo "7️⃣ Restart PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded --update-env
echo ""

# 8. صبر برای راه‌اندازی
echo "8️⃣ صبر برای راه‌اندازی سرور..."
sleep 5
echo ""

# 9. بررسی وضعیت نهایی
echo "9️⃣ بررسی وضعیت نهایی PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 10. تست Health Check
echo "🔟 تست Health Check:"
curl -s "http://localhost:3001/api/health/db" | head -c 500
echo ""
echo ""

echo "✅ بررسی کامل شد!"
echo ""
echo "💡 اگر هنوز خطای 503 دارید:"
echo "   1. لاگ‌های PM2 را بررسی کنید: pm2 logs saded --lines 50"
echo "   2. مطمئن شوید که BUILD_ID موجود است"
echo "   3. مطمئن شوید که .next/server و .next/static موجود هستند"
echo "   4. مطمئن شوید که environment variables درست تنظیم شده‌اند"

