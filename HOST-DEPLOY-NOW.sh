#!/bin/bash

# اسکریپت استقرار فوری برای اعمال تغییرات جدید
# این اسکریپت تغییرات را از Git دریافت می‌کند و PM2 را restart می‌کند

cd ~/public_html/saded

echo "🚀 شروع استقرار تغییرات..."
echo ""

# 1. بررسی وضعیت Git
echo "1️⃣ بررسی وضعیت Git..."
git status --short | head -5
echo ""

# 2. دریافت تغییرات از Git
echo "2️⃣ دریافت تغییرات از Git..."
git fetch origin main
if [ $? -ne 0 ]; then
    echo "❌ خطا در دریافت تغییرات از Git"
    exit 1
fi

# 3. Reset به آخرین commit
echo "3️⃣ Reset به آخرین commit..."
git reset --hard origin/main
if [ $? -ne 0 ]; then
    echo "❌ خطا در reset کردن"
    exit 1
fi

echo "✅ تغییرات دریافت شد"
echo ""

# 4. بررسی BUILD_ID جدید
echo "4️⃣ بررسی BUILD_ID جدید..."
if [ -f ".next/BUILD_ID" ]; then
    NEW_BUILD_ID=$(cat .next/BUILD_ID)
    echo "✅ BUILD_ID جدید: $NEW_BUILD_ID"
else
    echo "⚠️ فایل .next/BUILD_ID یافت نشد"
fi
echo ""

# 5. بررسی فایل reviews-section.tsx
echo "5️⃣ بررسی فایل reviews-section.tsx..."
if grep -q "Rating Summary - Desktop Only (With Stars)" components/home/reviews-section.tsx 2>/dev/null; then
    echo "✅ تغییرات در فایل اعمال شده است"
else
    echo "❌ تغییرات در فایل یافت نشد!"
    echo "در حال دریافت مجدد فایل..."
    git checkout HEAD -- components/home/reviews-section.tsx
fi
echo ""

# 6. دریافت فایل‌های static جدید
echo "6️⃣ دریافت فایل‌های static جدید..."
if [ -f ".next/BUILD_ID" ]; then
    BUILD_ID=$(cat .next/BUILD_ID)
    if [ -d ".next/static/$BUILD_ID" ]; then
        echo "✅ فولدر static/$BUILD_ID موجود است"
    else
        echo "⚠️ فولدر static/$BUILD_ID موجود نیست، در حال دریافت..."
        git checkout HEAD -- .next/static/$BUILD_ID/ 2>/dev/null || echo "⚠️ فولدر در Git موجود نیست"
    fi
fi
echo ""

# 7. Restart PM2
echo "7️⃣ Restart کردن PM2..."
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی وجود PM2
if [ ! -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

# Restart PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

if [ $? -ne 0 ]; then
    echo "⚠️ خطا در restart کردن PM2، در حال تلاش مجدد..."
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded
    sleep 2
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 delete saded
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
fi

echo ""

# 8. بررسی وضعیت PM2
echo "8️⃣ بررسی وضعیت PM2..."
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
echo ""

# 9. بررسی آخرین commit
echo "9️⃣ آخرین commit:"
git log --oneline -1
echo ""

echo "✅ استقرار کامل شد!"
echo ""
echo "📝 برای بررسی تغییرات، صفحه را refresh کنید (Ctrl+F5)"

