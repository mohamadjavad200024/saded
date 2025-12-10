#!/bin/bash

# اسکریپت بررسی وجود فایل‌های ضروری Next.js روی هاست

echo "🔍 بررسی فایل‌های ضروری Next.js..."
echo ""

cd ~/public_html/saded

# 1. بررسی BUILD_ID
echo "1️⃣ بررسی BUILD_ID:"
if [ -f ".next/BUILD_ID" ]; then
    echo "   ✅ BUILD_ID موجود است: $(cat .next/BUILD_ID)"
else
    echo "   ❌ BUILD_ID موجود نیست!"
fi
echo ""

# 2. بررسی فولدر server
echo "2️⃣ بررسی فولدر .next/server:"
if [ -d ".next/server" ]; then
    echo "   ✅ فولدر server موجود است"
    echo "   📁 تعداد فایل‌های API: $(find .next/server/app/api -type f 2>/dev/null | wc -l)"
else
    echo "   ❌ فولدر server موجود نیست!"
fi
echo ""

# 3. بررسی فولدر static
echo "3️⃣ بررسی فولدر .next/static:"
if [ -d ".next/static" ]; then
    echo "   ✅ فولدر static موجود است"
    echo "   📁 تعداد chunk files: $(find .next/static/chunks -name "*.js" 2>/dev/null | wc -l)"
    
    # بررسی فایل مشکل‌دار
    if [ -f ".next/static/chunks/bfaaa57470bc0270.js" ]; then
        echo "   ✅ فایل bfaaa57470bc0270.js موجود است"
    else
        echo "   ❌ فایل bfaaa57470bc0270.js موجود نیست!"
    fi
else
    echo "   ❌ فولدر static موجود نیست!"
fi
echo ""

# 4. بررسی manifest files
echo "4️⃣ بررسی Manifest Files:"
for file in "routes-manifest.json" "build-manifest.json" "prerender-manifest.json"; do
    if [ -f ".next/$file" ]; then
        echo "   ✅ $file موجود است"
    else
        echo "   ❌ $file موجود نیست!"
    fi
done
echo ""

# 5. بررسی ساختار کلی
echo "5️⃣ ساختار فولدر .next:"
if [ -d ".next" ]; then
    echo "   📁 محتویات .next:"
    ls -la .next/ | head -20
else
    echo "   ❌ فولدر .next موجود نیست!"
fi
echo ""

echo "✅ بررسی کامل شد!"

