#!/bin/bash

# اسکریپت رفع مشکل فایل‌های chunks/ssr/

cd ~/public_html/saded

echo "🔧 دریافت فایل‌های .next/server/chunks/ssr/ از Git..."
echo ""

# 1. Pull تغییرات
echo "1️⃣ Pull تغییرات..."
git pull origin main
echo ""

# 2. بررسی وجود فولدر ssr
echo "2️⃣ بررسی فولدر chunks/ssr/:"
if [ -d ".next/server/chunks/ssr" ]; then
    echo "   ✅ فولدر ssr موجود است"
    echo "   📁 تعداد فایل‌های .js: $(find .next/server/chunks/ssr -name "*.js" 2>/dev/null | wc -l)"
else
    echo "   ❌ فولدر ssr موجود نیست!"
fi
echo ""

# 3. دریافت تمام فایل‌های chunks/ssr/ از Git
echo "3️⃣ دریافت تمام فایل‌های .next/server/chunks/ssr/ از Git..."
git checkout HEAD -- .next/server/chunks/ssr/ 2>&1 | head -20
echo ""

# 4. بررسی فایل [turbopack]_runtime.js
echo "4️⃣ بررسی فایل [turbopack]_runtime.js:"
if [ -f ".next/server/chunks/ssr/[turbopack]_runtime.js" ]; then
    echo "   ✅ فایل [turbopack]_runtime.js موجود است"
    ls -lh .next/server/chunks/ssr/[turbopack]_runtime.js
else
    echo "   ❌ فایل [turbopack]_runtime.js موجود نیست!"
    echo "   🔄 دریافت از Git..."
    git checkout HEAD -- .next/server/chunks/ssr/[turbopack]_runtime.js 2>/dev/null || echo "   ⚠️ فایل در Git نیست"
fi
echo ""

# 5. بررسی ساختار
echo "5️⃣ بررسی ساختار .next/server/chunks/:"
if [ -d ".next/server/chunks" ]; then
    echo "   ✅ فولدر chunks موجود است"
    echo "   📁 تعداد فایل‌های .js در ssr: $(find .next/server/chunks/ssr -name "*.js" 2>/dev/null | wc -l)"
    echo "   📁 فایل [turbopack]_runtime.js: $(test -f .next/server/chunks/ssr/[turbopack]_runtime.js && echo '✅ موجود' || echo '❌ موجود نیست')"
else
    echo "   ❌ فولدر chunks موجود نیست!"
fi
echo ""

# 6. Restart PM2
echo "6️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded
sleep 2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start ecosystem.config.js
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
echo ""

# 7. بررسی وضعیت
echo "7️⃣ بررسی وضعیت PM2:"
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 8. تست
echo "8️⃣ تست localhost:"
curl -s http://localhost:3001/ | head -c 200
echo ""
echo ""

echo "✅ بررسی کامل شد"

