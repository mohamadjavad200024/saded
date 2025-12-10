#!/bin/bash

# اسکریپت رفع مشکل فایل‌های [root-of-the-server]__*.js

cd ~/public_html/saded

echo "🔧 دریافت فایل‌های [root-of-the-server]__*.js از Git..."
echo ""

# 1. Pull تغییرات
echo "1️⃣ Pull تغییرات..."
git pull origin main
echo ""

# 2. بررسی وجود فایل‌های [root-of-the-server]__*.js
echo "2️⃣ بررسی فایل‌های [root-of-the-server]__*.js:"
if ls .next/server/chunks/\[root-of-the-server\]__*.js 1> /dev/null 2>&1; then
    echo "   ✅ فایل‌های موجود:"
    ls -lh .next/server/chunks/\[root-of-the-server\]__*.js
else
    echo "   ❌ فایل‌های [root-of-the-server]__*.js موجود نیستند!"
fi
echo ""

# 3. دریافت تمام فایل‌های chunks/ از Git
echo "3️⃣ دریافت تمام فایل‌های .next/server/chunks/ از Git..."
git checkout HEAD -- .next/server/chunks/ 2>&1 | head -30
echo ""

# 4. بررسی مجدد
echo "4️⃣ بررسی مجدد فایل‌های [root-of-the-server]__*.js:"
if ls .next/server/chunks/\[root-of-the-server\]__*.js 1> /dev/null 2>&1; then
    echo "   ✅ فایل‌های موجود:"
    ls -lh .next/server/chunks/\[root-of-the-server\]__*.js
    echo ""
    echo "   📊 تعداد فایل‌ها: $(ls .next/server/chunks/\[root-of-the-server\]__*.js 2>/dev/null | wc -l)"
else
    echo "   ❌ فایل‌های [root-of-the-server]__*.js هنوز موجود نیستند!"
    echo "   ⚠️ ممکن است نیاز به rebuild باشد"
fi
echo ""

# 5. بررسی تمام فایل‌های chunks
echo "5️⃣ بررسی تمام فایل‌های .next/server/chunks/:"
if [ -d ".next/server/chunks" ]; then
    echo "   ✅ فولدر chunks موجود است"
    echo "   📁 تعداد فایل‌های .js: $(find .next/server/chunks -name "*.js" -type f 2>/dev/null | wc -l)"
    echo "   📁 لیست فایل‌های اصلی:"
    ls -lh .next/server/chunks/*.js 2>/dev/null | head -10
else
    echo "   ❌ فولدر chunks موجود نیست!"
fi
echo ""

# 6. Restart PM2
echo "6️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start ecosystem.config.js
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
echo ""

# 7. بررسی وضعیت
echo "7️⃣ بررسی وضعیت PM2:"
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 8. تست API
echo "8️⃣ تست API‌ها:"
echo "   📡 تست /api/categories:"
curl -s http://localhost:3001/api/categories | head -c 200 && echo "" || echo "   ❌ خطا"
echo ""

echo "✅ بررسی کامل شد"

