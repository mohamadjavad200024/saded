#!/bin/bash

# اسکریپت بررسی دقیق خطاهای API

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 بررسی دقیق خطاهای API..."
echo ""

# 1. بررسی آخرین خطاها (50 خط جدید)
echo "1️⃣ آخرین خطاها (50 خط جدید):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --err --nostream | tail -60
echo ""

# 2. تست API با جزئیات بیشتر
echo "2️⃣ تست API با جزئیات:"
echo ""
echo "   📡 تست /api/categories:"
curl -v http://localhost:3001/api/categories 2>&1 | grep -A 10 "< HTTP" | head -15
echo ""

echo "   📡 تست /api/products?limit=1:"
curl -v "http://localhost:3001/api/products?limit=1" 2>&1 | grep -A 10 "< HTTP" | head -15
echo ""

# 3. بررسی فایل‌های ضروری
echo "3️⃣ بررسی فایل‌های ضروری:"
echo "   [turbopack]_runtime.js در chunks: $(test -f .next/server/chunks/[turbopack]_runtime.js && echo '✅' || echo '❌')"
echo "   [turbopack]_runtime.js در chunks/ssr: $(test -f .next/server/chunks/ssr/[turbopack]_runtime.js && echo '✅' || echo '❌')"
echo "   required-server-files.json: $(test -f .next/required-server-files.json && echo '✅' || echo '❌')"
echo ""

# 4. بررسی ساختار route.js
echo "4️⃣ بررسی ساختار route.js:"
if [ -f ".next/server/app/api/categories/route.js" ]; then
    echo "   ✅ route.js موجود است"
    echo "   📄 خط اول route.js:"
    head -1 .next/server/app/api/categories/route.js
else
    echo "   ❌ route.js موجود نیست!"
fi
echo ""

echo "✅ بررسی کامل شد"

