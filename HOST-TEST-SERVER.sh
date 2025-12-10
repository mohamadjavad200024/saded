#!/bin/bash

# اسکریپت تست سرور Next.js

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 تست سرور Next.js..."
echo ""

# 1. بررسی وضعیت PM2
echo "1️⃣ وضعیت PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 2. تست localhost
echo "2️⃣ تست localhost:3001:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3001/ || echo "❌ خطا در اتصال به localhost:3001"
echo ""

# 3. تست health endpoint
echo "3️⃣ تست Health Check:"
curl -s "http://localhost:3001/api/health/db" | head -c 200
echo ""
echo ""

# 4. بررسی لاگ‌های آخر
echo "4️⃣ آخرین لاگ‌ها (10 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 10 --nostream | tail -15
echo ""

echo "✅ تست کامل شد"

