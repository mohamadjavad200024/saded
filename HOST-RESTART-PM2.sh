#!/bin/bash

# این اسکریپت برای Restart کردن PM2 در هاست طراحی شده است.

echo "🚀 در حال Restart کردن PM2..."

# 1. پیدا کردن مسیر PM2
PM2_PATH=$(which pm2)
if [ -z "$PM2_PATH" ]; then
    # اگر pm2 در PATH نبود، مسیرهای معمول را چک کن
    if [ -f "$HOME/.npm-global/bin/pm2" ]; then
        PM2_PATH="$HOME/.npm-global/bin/pm2"
    elif [ -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
        # استفاده از node برای اجرای pm2
        NODE_PATH="/opt/alt/alt-nodejs20/root/usr/bin/node"
        PM2_PATH="$NODE_PATH $HOME/.npm-global/bin/pm2"
    else
        echo "❌ PM2 یافت نشد. لطفاً مسیر PM2 را مشخص کنید."
        exit 1
    fi
fi

echo "✅ مسیر PM2: $PM2_PATH"

# 2. Restart PM2
if [ -n "$NODE_PATH" ]; then
    # اگر از node استفاده می‌کنیم
    $NODE_PATH $HOME/.npm-global/bin/pm2 restart saded --update-env
else
    # اگر pm2 مستقیماً در PATH است
    $PM2_PATH restart saded --update-env
fi

if [ $? -ne 0 ]; then
    echo "❌ خطای Restart کردن PM2. لطفاً لاگ‌های PM2 را بررسی کنید."
    exit 1
fi

echo "✅ PM2 با موفقیت Restart شد."

# 3. بررسی وضعیت PM2
echo "⏳ در حال بررسی وضعیت PM2 (5 ثانیه صبر کنید)..."
sleep 5

if [ -n "$NODE_PATH" ]; then
    $NODE_PATH $HOME/.npm-global/bin/pm2 status
else
    $PM2_PATH status
fi

if [ $? -ne 0 ]; then
    echo "❌ خطای دریافت وضعیت PM2."
    exit 1
fi

echo "✅ وضعیت PM2 بررسی شد."

