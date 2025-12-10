#!/bin/bash

# اسکریپت بررسی خطای 500

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "🔍 بررسی خطای 500..."
echo ""

# 1. بررسی وضعیت PM2
echo "1️⃣ وضعیت PM2:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 2. تست localhost
echo "2️⃣ تست localhost:3001:"
curl -v http://localhost:3001/ 2>&1 | head -30
echo ""

# 3. بررسی آخرین خطاها
echo "3️⃣ آخرین خطاها (30 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 30 --err --nostream | tail -40
echo ""

# 4. بررسی آخرین خروجی‌ها
echo "4️⃣ آخرین خروجی‌ها (20 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 20 --out --nostream | tail -25
echo ""

echo "✅ بررسی کامل شد"

