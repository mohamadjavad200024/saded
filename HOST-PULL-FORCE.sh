#!/bin/bash

# اسکریپت برای pull کردن با حل مشکل conflict

cd ~/public_html/saded || {
    echo "❌ Cannot access project directory!"
    exit 1
}

echo "=========================================="
echo "📥 Pulling with conflict resolution..."
echo "=========================================="

# Backup فایل‌های conflict
echo "1️⃣ Backup فایل‌های conflict..."
if [ -f ".next/BUILD_ID" ]; then
    cp .next/BUILD_ID .next/BUILD_ID.backup 2>/dev/null
    echo "✅ BUILD_ID backed up"
fi

# حذف فایل‌های conflict
echo ""
echo "2️⃣ حذف فایل‌های conflict..."
rm -f .next/BUILD_ID 2>/dev/null
echo "✅ فایل‌های conflict حذف شدند"

# Pull از Git
echo ""
echo "3️⃣ Pull از Git..."
git pull origin main

if [ $? -eq 0 ]; then
    echo "✅ Pull موفق بود"
else
    echo "⚠️  Pull با مشکل مواجه شد، تلاش با reset..."
    git reset --hard origin/main
fi

# بررسی فایل‌های بیلد
echo ""
echo "4️⃣ بررسی فایل‌های بیلد..."
if [ -f ".next/BUILD_ID" ]; then
    echo "✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "❌ BUILD_ID موجود نیست!"
fi

if [ -d ".next/server" ]; then
    echo "✅ .next/server موجود است"
else
    echo "❌ .next/server موجود نیست!"
fi

if [ -d ".next/static" ]; then
    echo "✅ .next/static موجود است"
else
    echo "❌ .next/static موجود نیست!"
fi

echo ""
echo "=========================================="
echo "✅ Pull کامل شد!"
echo "=========================================="

