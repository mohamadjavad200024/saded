#!/bin/bash

# اسکریپت بررسی و رفع مشکل routes-manifest.json

cd ~/public_html/saded

echo "🔍 بررسی routes-manifest.json..."
echo ""

# 1. بررسی وجود فایل
if [ -f ".next/routes-manifest.json" ]; then
    echo "✅ فایل موجود است"
    echo "   اندازه: $(ls -lh .next/routes-manifest.json | awk '{print $5}')"
else
    echo "❌ فایل موجود نیست!"
    echo ""
    echo "🔧 تلاش برای دریافت از Git..."
    
    # 2. بررسی در Git
    if git ls-files --error-unmatch .next/routes-manifest.json > /dev/null 2>&1; then
        echo "   ✅ فایل در Git موجود است"
        echo "   🔄 دریافت از Git..."
        git checkout HEAD -- .next/routes-manifest.json
        if [ -f ".next/routes-manifest.json" ]; then
            echo "   ✅ فایل دریافت شد"
        else
            echo "   ❌ دریافت ناموفق"
        fi
    else
        echo "   ❌ فایل در Git موجود نیست!"
        echo "   ⚠️  باید از کامپیوتر محلی build و commit شود"
    fi
fi

echo ""
echo "📋 بررسی سایر فایل‌های مهم:"
for file in "BUILD_ID" "server" "static"; do
    if [ -d ".next/$file" ] || [ -f ".next/$file" ]; then
        echo "   ✅ .next/$file موجود است"
    else
        echo "   ❌ .next/$file موجود نیست!"
    fi
done

echo ""
echo "✅ بررسی کامل شد"

