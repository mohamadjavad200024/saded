#!/bin/bash

# اسکریپت رفع مشکل فایل required-server-files.json

cd ~/public_html/saded

echo "🔧 دریافت فایل required-server-files.json از Git..."
echo ""

# 1. Pull تغییرات
echo "1️⃣ Pull تغییرات..."
git pull origin main
echo ""

# 2. بررسی وجود فایل
echo "2️⃣ بررسی فایل required-server-files.json:"
if [ -f ".next/required-server-files.json" ]; then
    echo "   ✅ فایل موجود است"
    ls -lh .next/required-server-files.json
else
    echo "   ❌ فایل موجود نیست!"
    echo "   🔄 دریافت از Git..."
    git checkout HEAD -- .next/required-server-files.json 2>/dev/null || echo "   ⚠️ فایل در Git نیست"
fi
echo ""

# 3. Restart PM2
echo "3️⃣ Restart PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded
sleep 2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start ecosystem.config.js
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
echo ""

# 4. بررسی وضعیت
echo "4️⃣ بررسی وضعیت PM2:"
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 5. تست
echo "5️⃣ تست localhost:"
curl -s http://localhost:3001/ | head -c 200
echo ""
echo ""

echo "✅ بررسی کامل شد"

