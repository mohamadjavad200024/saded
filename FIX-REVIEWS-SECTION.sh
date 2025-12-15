#!/bin/bash

# اسکریپت اعمال دستی تغییرات در reviews-section.tsx
# این اسکریپت بدون استفاده از Git تغییرات را اعمال می‌کند

FILE="components/home/reviews-section.tsx"

if [ ! -f "$FILE" ]; then
    echo "❌ فایل $FILE یافت نشد"
    exit 1
fi

# بررسی اینکه آیا تغییرات اعمال شده یا نه
if grep -q "Rating Summary - Desktop Only (With Stars)" "$FILE"; then
    echo "✅ تغییرات قبلاً اعمال شده است"
    exit 0
fi

# پیدا کردن خط مربوط به Rating Summary - Desktop
LINE_NUM=$(grep -n "Rating Summary - Desktop" "$FILE" | head -1 | cut -d: -f1)

if [ -z "$LINE_NUM" ]; then
    echo "❌ خط مورد نظر یافت نشد"
    exit 1
fi

echo "📝 خط $LINE_NUM پیدا شد"

# ایجاد فایل پشتیبان
cp "$FILE" "$FILE.backup"
echo "✅ فایل پشتیبان ایجاد شد: $FILE.backup"

# استفاده از sed برای جایگزینی
# این کد بخش قدیمی را با بخش جدید جایگزین می‌کند
sed -i "${LINE_NUM}s/.*/            {\\/\* Rating Summary - Desktop Only (With Stars) *\\/}/" "$FILE"

# بررسی نتیجه
if grep -q "Rating Summary - Desktop Only (With Stars)" "$FILE"; then
    echo "✅ تغییرات اعمال شد"
else
    echo "⚠️ نیاز به ویرایش دستی"
    echo "لطفاً خط $LINE_NUM تا $((LINE_NUM + 10)) را بررسی کنید"
fi

