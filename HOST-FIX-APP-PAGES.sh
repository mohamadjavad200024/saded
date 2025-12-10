#!/bin/bash

# اسکریپت رفع مشکل فایل‌های app/page.js

cd ~/public_html/saded

echo "🔧 دریافت فایل‌های .next/server/app/ از Git..."
echo ""

# 1. Pull تغییرات
echo "1️⃣ Pull تغییرات..."
git pull origin main
echo ""

# 2. بررسی وجود فایل page.js
echo "2️⃣ بررسی فایل page.js:"
if [ -f ".next/server/app/page.js" ]; then
    echo "   ✅ فایل page.js موجود است"
    ls -lh .next/server/app/page.js
else
    echo "   ❌ فایل page.js موجود نیست!"
    echo "   🔄 دریافت از Git..."
    git checkout HEAD -- .next/server/app/page.js 2>/dev/null || echo "   ⚠️ فایل در Git نیست"
fi
echo ""

# 3. دریافت تمام فایل‌های app/ از Git
echo "3️⃣ دریافت تمام فایل‌های .next/server/app/ از Git..."
git checkout HEAD -- .next/server/app/ 2>&1 | head -20
echo ""

# 4. بررسی ساختار
echo "4️⃣ بررسی ساختار .next/server/app/:"
if [ -d ".next/server/app" ]; then
    echo "   ✅ فولدر app موجود است"
    echo "   📁 تعداد فایل‌های .js: $(find .next/server/app -name "*.js" 2>/dev/null | wc -l)"
    echo "   📁 فایل page.js: $(test -f .next/server/app/page.js && echo '✅ موجود' || echo '❌ موجود نیست')"
else
    echo "   ❌ فولدر app موجود نیست!"
fi
echo ""

# 5. Restart PM2
echo "5️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded
sleep 2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start ecosystem.config.js
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
echo ""

# 6. بررسی وضعیت
echo "6️⃣ بررسی وضعیت PM2:"
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 7. تست
echo "7️⃣ تست localhost:"
curl -s http://localhost:3001/ | head -c 200
echo ""
echo ""

echo "✅ بررسی کامل شد"

