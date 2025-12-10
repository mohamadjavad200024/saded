#!/bin/bash

# اسکریپت دریافت تمام فایل‌های manifest از Git

cd ~/public_html/saded

echo "🔧 دریافت تمام فایل‌های manifest از Git..."
echo ""

# لیست فایل‌های manifest ضروری
MANIFEST_FILES=(
    ".next/routes-manifest.json"
    ".next/prerender-manifest.json"
    ".next/build-manifest.json"
    ".next/fallback-build-manifest.json"
    ".next/images-manifest.json"
    ".next/app-path-routes-manifest.json"
)

# دریافت هر فایل از Git
for file in "${MANIFEST_FILES[@]}"; do
    if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
        echo "✅ دریافت $file..."
        git checkout HEAD -- "$file"
        if [ -f "$file" ]; then
            echo "   ✅ دریافت شد"
        else
            echo "   ❌ دریافت ناموفق"
        fi
    else
        echo "⚠️  $file در Git موجود نیست"
    fi
done

echo ""
echo "✅ تمام فایل‌های manifest دریافت شدند"

