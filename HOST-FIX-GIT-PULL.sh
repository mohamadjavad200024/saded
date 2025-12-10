#!/bin/bash

# این اسکریپت برای حل مشکل Git pull در هاست طراحی شده است.

echo "🚀 در حال حل مشکل Git pull..."

# 1. بررسی تغییرات محلی
echo "📋 بررسی تغییرات محلی..."
git status

# 2. اگر فایل HOST-RESTART-PM2.sh تغییر کرده، آن را reset کن
if git diff --quiet HOST-RESTART-PM2.sh; then
    echo "✅ فایل HOST-RESTART-PM2.sh تغییر نکرده است."
else
    echo "⚠️ فایل HOST-RESTART-PM2.sh تغییر کرده است. در حال reset..."
    git checkout HEAD -- HOST-RESTART-PM2.sh
    echo "✅ فایل HOST-RESTART-PM2.sh reset شد."
fi

# 3. Pull تغییرات جدید
echo "🔄 در حال Pull کردن آخرین تغییرات از Git..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ خطای Git pull. لطفاً تداخل‌ها را به صورت دستی حل کنید."
    echo "💡 می‌توانید از دستورات زیر استفاده کنید:"
    echo "   git stash"
    echo "   git pull origin main"
    echo "   git stash pop"
    exit 1
fi

echo "✅ Git pull با موفقیت انجام شد."
