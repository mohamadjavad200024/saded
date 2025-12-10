#!/bin/bash

# اسکریپت بررسی آخرین خطاها

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 بررسی آخرین خطاها..."
echo ""

# 1. بررسی آخرین خطاها (100 خط)
echo "1️⃣ آخرین خطاها (100 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 100 --err --nostream | tail -120
echo ""

# 2. بررسی آخرین خروجی‌ها
echo "2️⃣ آخرین خروجی‌ها (50 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --out --nostream | tail -60
echo ""

# 3. تست با جزئیات بیشتر
echo "3️⃣ تست localhost با جزئیات:"
curl -v http://localhost:3001/ 2>&1 | grep -A 20 "< HTTP"
echo ""

# 4. بررسی فایل‌های ضروری
echo "4️⃣ بررسی فایل‌های ضروری:"
echo "   page.js: $(test -f .next/server/app/page.js && echo '✅' || echo '❌')"
echo "   app-paths-manifest.json: $(test -f .next/server/app-paths-manifest.json && echo '✅' || echo '❌')"
echo "   routes-manifest.json: $(test -f .next/routes-manifest.json && echo '✅' || echo '❌')"
echo "   BUILD_ID: $(test -f .next/BUILD_ID && echo '✅' || echo '❌')"
echo ""

echo "✅ بررسی کامل شد"

