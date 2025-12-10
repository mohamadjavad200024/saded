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

# 2. تنظیم PATH برای Node.js
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# 3. بررسی وجود Node.js
if [ ! -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
    echo "❌ Node.js در مسیر /opt/alt/alt-nodejs20/root/usr/bin/node یافت نشد."
    echo "💡 در حال جستجوی Node.js در مسیرهای دیگر..."
    NODE_PATH=$(which node 2>/dev/null || find /opt -name "node" -type f 2>/dev/null | head -1)
    if [ -z "$NODE_PATH" ]; then
        echo "❌ Node.js یافت نشد."
        exit 1
    fi
    echo "✅ Node.js یافت شد: $NODE_PATH"
else
    NODE_PATH="/opt/alt/alt-nodejs20/root/usr/bin/node"
fi

# 4. Restart PM2
if [ -f "$HOME/.npm-global/bin/pm2" ]; then
    echo "🔄 در حال Restart کردن PM2 با Node.js: $NODE_PATH"
    $NODE_PATH $HOME/.npm-global/bin/pm2 restart saded --update-env
elif [ -f "$HOME/.npm-global/lib/node_modules/pm2/bin/pm2" ]; then
    echo "🔄 در حال Restart کردن PM2 با Node.js: $NODE_PATH"
    $NODE_PATH $HOME/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded --update-env
else
    echo "❌ PM2 یافت نشد."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "❌ خطای Restart کردن PM2. لطفاً لاگ‌های PM2 را بررسی کنید."
    exit 1
fi

echo "✅ PM2 با موفقیت Restart شد."

# 5. بررسی وضعیت PM2
echo "⏳ در حال بررسی وضعیت PM2 (5 ثانیه صبر کنید)..."
sleep 5

if [ -f "$HOME/.npm-global/bin/pm2" ]; then
    $NODE_PATH $HOME/.npm-global/bin/pm2 status
elif [ -f "$HOME/.npm-global/lib/node_modules/pm2/bin/pm2" ]; then
    $NODE_PATH $HOME/.npm-global/lib/node_modules/pm2/bin/pm2 status
else
    echo "❌ PM2 یافت نشد."
    exit 1
fi

if [ $? -ne 0 ]; then
    echo "❌ خطای دریافت وضعیت PM2."
    exit 1
fi

echo "✅ وضعیت PM2 بررسی شد."

