#!/bin/bash

# اسکریپت رفع مشکل فایل‌های API routes

cd ~/public_html/saded

echo "🔧 دریافت فایل‌های مورد نیاز برای API routes از Git..."
echo ""

# 1. Pull تغییرات
echo "1️⃣ Pull تغییرات..."
git pull origin main
echo ""

# 2. بررسی وجود فایل [turbopack]_runtime.js در chunks (بدون ssr)
echo "2️⃣ بررسی فایل [turbopack]_runtime.js در chunks/:"
if [ -f ".next/server/chunks/[turbopack]_runtime.js" ]; then
    echo "   ✅ فایل موجود است"
    ls -lh .next/server/chunks/[turbopack]_runtime.js
else
    echo "   ❌ فایل موجود نیست!"
    echo "   🔄 دریافت از Git..."
    git checkout HEAD -- .next/server/chunks/[turbopack]_runtime.js 2>/dev/null || echo "   ⚠️ فایل در Git نیست"
fi
echo ""

# 3. دریافت تمام فایل‌های chunks/ از Git (بدون ssr)
echo "3️⃣ دریافت تمام فایل‌های .next/server/chunks/ از Git (بدون ssr)..."
# دریافت فایل‌های ضروری
git checkout HEAD -- .next/server/chunks/[turbopack]_runtime.js 2>/dev/null
git checkout HEAD -- .next/server/chunks/[turbopack]_runtime.js.map 2>/dev/null
echo ""

# 4. بررسی ساختار
echo "4️⃣ بررسی ساختار .next/server/chunks/:"
if [ -d ".next/server/chunks" ]; then
    echo "   ✅ فولدر chunks موجود است"
    echo "   📁 فایل [turbopack]_runtime.js: $(test -f .next/server/chunks/[turbopack]_runtime.js && echo '✅ موجود' || echo '❌ موجود نیست')"
    echo "   📁 فایل [turbopack]_runtime.js در ssr: $(test -f .next/server/chunks/ssr/[turbopack]_runtime.js && echo '✅ موجود' || echo '❌ موجود نیست')"
else
    echo "   ❌ فولدر chunks موجود نیست!"
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

# 7. تست API‌ها
echo "7️⃣ تست API‌ها:"
echo "   📡 تست /api/categories:"
curl -s http://localhost:3001/api/categories | head -c 200
echo ""
echo "   📡 تست /api/products?limit=1:"
curl -s "http://localhost:3001/api/products?limit=1" | head -c 200
echo ""
echo ""

echo "✅ بررسی کامل شد"

