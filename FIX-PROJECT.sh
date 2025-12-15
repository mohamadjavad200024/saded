#!/bin/bash

# اسکریپت رفع مشکل پروژه
# این اسکریپت فایل reviews-section.tsx را بررسی و درست می‌کند

cd ~/public_html/saded

echo "🔧 شروع رفع مشکل..."
echo ""

FILE="components/home/reviews-section.tsx"

# بررسی وجود فایل
if [ ! -f "$FILE" ]; then
    echo "❌ فایل $FILE یافت نشد!"
    exit 1
fi

# ایجاد پشتیبان
cp "$FILE" "$FILE.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ فایل پشتیبان ایجاد شد"

# بررسی اینکه آیا averageRating تعریف شده
if ! grep -q "const averageRating" "$FILE"; then
    echo "❌ averageRating تعریف نشده!"
    echo "در حال اضافه کردن..."
    
    # پیدا کردن خط قبل از return
    LINE_NUM=$(grep -n "return (" "$FILE" | head -1 | cut -d: -f1)
    
    if [ -n "$LINE_NUM" ]; then
        # اضافه کردن تعریف averageRating قبل از return
        sed -i "$((LINE_NUM-1)) a\\
\\
  // Calculate average rating\\
  const averageRating = reviews.length > 0\\
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length\\
    : 0;
" "$FILE"
        echo "✅ averageRating اضافه شد"
    fi
fi

# بررسی بخش Desktop Rating Summary
if grep -q "Rating Summary - Desktop Only (Just Count)" "$FILE"; then
    echo "⚠️ بخش Desktop نیاز به به‌روزرسانی دارد"
    
    # پیدا کردن خط مربوطه
    LINE_NUM=$(grep -n "Rating Summary - Desktop Only (Just Count)" "$FILE" | head -1 | cut -d: -f1)
    
    if [ -n "$LINE_NUM" ]; then
        # جایگزینی comment
        sed -i "${LINE_NUM}s/Just Count/With Stars/" "$FILE"
        
        # پیدا کردن بخش span که باید جایگزین شود
        # این بخش پیچیده است و نیاز به ویرایش دستی دارد
        echo "⚠️ نیاز به ویرایش دستی بخش Desktop Rating Summary"
        echo "خط $LINE_NUM را بررسی کنید"
    fi
fi

# بررسی syntax errors
if command -v node &> /dev/null; then
    echo "🔍 بررسی syntax..."
    if node -c "$FILE" 2>/dev/null; then
        echo "✅ Syntax درست است"
    else
        echo "⚠️ ممکن است syntax error وجود داشته باشد"
    fi
fi

echo ""
echo "✅ بررسی کامل شد"
echo ""
echo "📝 اگر مشکل ادامه دارد:"
echo "1. فایل $FILE را با ویرایشگر باز کنید"
echo "2. خط 268-289 را بررسی کنید"
echo "3. مطمئن شوید که کد Desktop Rating Summary درست است"

