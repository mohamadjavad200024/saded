#!/bin/bash

# اسکریپت بررسی خطاهای جدید بعد از pull کردن chunks/ssr

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 بررسی خطاهای جدید..."
echo ""

# 1. بررسی آخرین خطاها (50 خط جدید)
echo "1️⃣ آخرین خطاها (50 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --err --nostream | tail -60
echo ""

# 2. بررسی آخرین خروجی‌ها
echo "2️⃣ آخرین خروجی‌ها (30 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 30 --out --nostream | tail -35
echo ""

# 3. تست با جزئیات
echo "3️⃣ تست localhost:"
curl -s http://localhost:3001/ 2>&1 | head -c 500
echo ""
echo ""

# 4. بررسی فایل‌های ضروری
echo "4️⃣ بررسی فایل‌های ضروری:"
echo "   page.js: $(test -f .next/server/app/page.js && echo '✅' || echo '❌')"
echo "   [turbopack]_runtime.js: $(test -f .next/server/chunks/ssr/[turbopack]_runtime.js && echo '✅' || echo '❌')"
echo "   تعداد فایل‌های ssr: $(find .next/server/chunks/ssr -name "*.js" 2>/dev/null | wc -l)"
echo ""

echo "✅ بررسی کامل شد"

