#!/bin/bash

# این اسکریپت برای حل مشکل Git pull در هاست طراحی شده است.

echo "🔧 حل مشکل Git pull..."

# 1. ذخیره تغییرات محلی
echo "1️⃣ ذخیره تغییرات محلی..."
git stash push -m "Backup local changes before pull"

# 2. Reset فایل‌های مشکل‌دار
echo "2️⃣ Reset فایل‌های مشکل‌دار..."
git checkout HEAD -- HOST-RESTART-PM2.sh HOST-FIX-GIT-PULL.sh 2>/dev/null || true

# 3. Pull تغییرات جدید
echo "3️⃣ Pull تغییرات جدید..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ خطای Git pull. در حال استفاده از روش جایگزین..."
    git fetch origin main
    git reset --hard origin/main
    echo "✅ تغییرات با reset اعمال شد."
else
    echo "✅ Git pull با موفقیت انجام شد."
fi

# 4. بررسی وضعیت Git
echo "4️⃣ بررسی وضعیت Git..."
git status

echo "✅ انجام شد!"
