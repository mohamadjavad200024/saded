#!/bin/bash

# اسکریپت تست نهایی بعد از pull

echo "🔍 تست نهایی سیستم..."
echo ""

cd ~/public_html/saded

# 1. بررسی وضعیت Git
echo "1️⃣ بررسی وضعیت Git:"
git status --short | head -10
echo ""

# 2. بررسی وجود فایل‌های ضروری
echo "2️⃣ بررسی فایل‌های ضروری:"
if [ -f ".next/BUILD_ID" ]; then
    echo "   ✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "   ❌ BUILD_ID موجود نیست!"
fi

if [ -d ".next/server" ]; then
    echo "   ✅ فولدر server موجود است"
    echo "   📁 تعداد فایل‌های API: $(find .next/server/app/api -type f 2>/dev/null | wc -l)"
else
    echo "   ❌ فولدر server موجود نیست!"
fi

if [ -d ".next/static" ]; then
    echo "   ✅ فولدر static موجود است"
    echo "   📁 تعداد chunk files: $(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)"
    
    # بررسی فایل مشکل‌دار قبلی
    if [ -f ".next/static/chunks/bfaaa57470bc0270.js" ]; then
        echo "   ✅ فایل bfaaa57470bc0270.js موجود است"
    else
        echo "   ❌ فایل bfaaa57470bc0270.js موجود نیست!"
    fi
else
    echo "   ❌ فولدر static موجود نیست!"
fi
echo ""

# 3. بررسی وضعیت PM2
echo "3️⃣ وضعیت PM2:"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 4. تست API Health
echo "4️⃣ تست API Health:"
curl -s "http://localhost:3001/api/health" | head -c 200
echo ""
echo ""

# 5. تست API Chat Unread Count
echo "5️⃣ تست Chat Unread Count:"
curl -s "http://localhost:3001/api/chat/unread-count?all=true" | head -c 300
echo ""
echo ""

# 6. تست API Chat List
echo "6️⃣ تست Chat List:"
curl -s "http://localhost:3001/api/chat" | head -c 300
echo ""
echo ""

# 7. بررسی آخرین خطاها
echo "7️⃣ آخرین خطاهای PM2 (5 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 5 --err --nostream 2>/dev/null | tail -10
echo ""

echo "✅ تست کامل شد!"


