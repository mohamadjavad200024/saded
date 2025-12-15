#!/bin/bash

# ایجاد فایل BUILD_ID در هاست

echo "ایجاد فایل BUILD_ID..."

# محتوای BUILD_ID از بیلد محلی
BUILD_ID_CONTENT="c2M42uMZWduC1fETQfbZ0"

# ایجاد فایل
mkdir -p .next
echo "$BUILD_ID_CONTENT" > .next/BUILD_ID

echo "✅ فایل BUILD_ID ایجاد شد!"
echo "محتوا: $BUILD_ID_CONTENT"
echo ""
echo "حالا PM2 را restart کنید:"
echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH"
echo "/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env"

