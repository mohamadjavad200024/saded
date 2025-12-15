#!/bin/bash

# اسکریپت بیلد محلی و آماده‌سازی برای آپلود

echo "=========================================="
echo "بیلد پروژه در محیط محلی"
echo "=========================================="

# بیلد پروژه
echo "در حال بیلد..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ بیلد موفق بود!"
    echo ""
    echo "=========================================="
    echo "فایل‌های مورد نیاز برای آپلود:"
    echo "=========================================="
    echo ""
    echo "1. پوشه .next/static/ (کل پوشه)"
    echo "2. پوشه .next/server/ (کل پوشه)"
    echo "3. فایل .next/BUILD_ID"
    echo ""
    echo "این فایل‌ها را از محیط محلی به هاست آپلود کنید:"
    echo "مسیر در هاست: ~/public_html/saded/.next/"
    echo ""
    echo "بعد از آپلود، در هاست اجرا کنید:"
    echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH"
    echo "/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env"
else
    echo "❌ بیلد شکست خورد!"
    exit 1
fi

