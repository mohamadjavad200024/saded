#!/bin/bash

# این اسکریپت کامل برای deploy در هاست طراحی شده است.

echo "🚀 در حال اجرای Deploy کامل..."

# 1. حل مشکل Git pull
echo "1️⃣ حل مشکل Git pull..."
# Force reset فایل‌های مشکل‌دار
rm -f HOST-RESTART-PM2.sh HOST-FIX-GIT-PULL.sh 2>/dev/null || true
git checkout HEAD -- HOST-RESTART-PM2.sh HOST-FIX-GIT-PULL.sh 2>/dev/null || true
git reset HEAD HOST-RESTART-PM2.sh HOST-FIX-GIT-PULL.sh 2>/dev/null || true

# Stash تغییرات محلی
git stash push -m "Backup before pull" 2>/dev/null || true

# Pull تغییرات جدید
echo "2️⃣ Pull تغییرات جدید..."
git fetch origin main
git reset --hard origin/main

if [ $? -ne 0 ]; then
    echo "❌ خطای Git pull."
    exit 1
fi

echo "✅ Git pull با موفقیت انجام شد."

# 3. بررسی BUILD_ID جدید
echo "3️⃣ بررسی BUILD_ID جدید..."
if [ -f ".next/BUILD_ID" ]; then
    NEW_BUILD_ID=$(cat .next/BUILD_ID)
    echo "✅ BUILD_ID جدید: $NEW_BUILD_ID"
else
    echo "❌ فایل .next/BUILD_ID یافت نشد."
    exit 1
fi

# 4. دریافت فولدر static جدید
echo "4️⃣ دریافت فولدر static جدید..."
if [ ! -d ".next/static/$NEW_BUILD_ID" ]; then
    git checkout HEAD -- .next/static/$NEW_BUILD_ID/ 2>/dev/null || true
    if [ ! -d ".next/static/$NEW_BUILD_ID" ]; then
        echo "⚠️ فولدر .next/static/$NEW_BUILD_ID/ موجود نیست. ممکن است نیاز به build باشد."
    else
        echo "✅ فولدر static جدید دریافت شد."
    fi
else
    echo "✅ فولدر static جدید موجود است."
fi

# 5. دریافت تمام فایل‌های chunks (برای اطمینان)
echo "5️⃣ دریافت فایل‌های chunks..."
git checkout HEAD -- .next/static/chunks/*.js 2>&1 | head -5 || true

# 6. Restart PM2
echo "6️⃣ Restart PM2..."
chmod +x HOST-RESTART-PM2.sh 2>/dev/null || true
./HOST-RESTART-PM2.sh

if [ $? -ne 0 ]; then
    echo "⚠️ خطای Restart کردن PM2. در حال تلاش به صورت دستی..."
    export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
    if [ -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ] && [ -f "$HOME/.npm-global/bin/pm2" ]; then
        /opt/alt/alt-nodejs20/root/usr/bin/node $HOME/.npm-global/bin/pm2 restart saded --update-env
        sleep 5
        /opt/alt/alt-nodejs20/root/usr/bin/node $HOME/.npm-global/bin/pm2 status
    else
        echo "❌ Node.js یا PM2 یافت نشد."
        exit 1
    fi
fi

echo "✅ Deploy کامل با موفقیت انجام شد!"

