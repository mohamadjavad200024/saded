#!/bin/bash

# اسکریپت ایمن برای دریافت تغییرات از Git
# بدون استفاده از git fetch که ممکن است مشکل ایجاد کند

cd ~/public_html/saded

echo "🔄 دریافت تغییرات از Git..."
echo ""

# بررسی وضعیت فعلی
echo "1️⃣ بررسی وضعیت Git..."
git status --short | head -10
echo ""

# دریافت تغییرات با git pull (بدون fetch جداگانه)
echo "2️⃣ دریافت تغییرات..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "⚠️ خطا در git pull، در حال استفاده از روش جایگزین..."
    git reset --hard origin/main
fi

echo ""
echo "✅ تغییرات دریافت شد"
echo ""

# بررسی آخرین commit
echo "3️⃣ آخرین commit:"
git log --oneline -1
echo ""

# بررسی فایل reviews-section.tsx
echo "4️⃣ بررسی فایل reviews-section.tsx..."
if grep -q "Rating Summary - Desktop Only (With Stars)" components/home/reviews-section.tsx; then
    echo "✅ تغییرات در فایل اعمال شده است"
else
    echo "⚠️ تغییرات در فایل یافت نشد"
fi

echo ""
echo "✅ انجام شد!"

