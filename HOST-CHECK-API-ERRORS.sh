#!/bin/bash

# اسکریپت بررسی خطاهای API

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 بررسی خطاهای API..."
echo ""

# 1. تست API‌ها
echo "1️⃣ تست API‌ها:"
echo ""
echo "   📡 تست /api/categories:"
curl -s http://localhost:3001/api/categories | head -c 500
echo ""
echo ""

echo "   📡 تست /api/products?limit=1:"
curl -s "http://localhost:3001/api/products?limit=1" | head -c 500
echo ""
echo ""

echo "   📡 تست /api/cart:"
curl -s http://localhost:3001/api/cart | head -c 500
echo ""
echo ""

# 2. بررسی آخرین خطاها (100 خط)
echo "2️⃣ آخرین خطاها (100 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 100 --err --nostream | tail -120
echo ""

# 3. بررسی آخرین خروجی‌ها
echo "3️⃣ آخرین خروجی‌ها (50 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --out --nostream | tail -60
echo ""

# 4. تست اتصال دیتابیس
echo "4️⃣ تست اتصال دیتابیس:"
curl -s http://localhost:3001/api/health/db | head -c 500
echo ""
echo ""

echo "✅ بررسی کامل شد"

