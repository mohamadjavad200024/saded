#!/bin/bash

# اسکریپت ساده برای restart کردن پروژه
# بدون استفاده از fork برای جلوگیری از خطای Resource temporarily unavailable

cd ~/public_html/saded

echo "🔄 در حال restart کردن پروژه..."
echo ""

# تنظیم PATH
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی وجود Node.js
if [ ! -f "/opt/alt/alt-nodejs20/root/usr/bin/node" ]; then
    echo "❌ Node.js یافت نشد"
    exit 1
fi

# بررسی وجود PM2
if [ ! -f "$HOME/.npm-global/bin/pm2" ]; then
    echo "❌ PM2 یافت نشد"
    exit 1
fi

# Restart PM2
echo "1️⃣ در حال restart کردن PM2..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

if [ $? -eq 0 ]; then
    echo "✅ PM2 با موفقیت restart شد"
else
    echo "⚠️ خطا در restart، در حال تلاش مجدد..."
    
    # Stop و Start مجدد
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded
    sleep 2
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start ecosystem.config.js
    /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 save
fi

echo ""
echo "2️⃣ بررسی وضعیت PM2..."
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

echo ""
echo "✅ پروژه restart شد!"
echo ""
echo "📝 اگر مشکل ادامه دارد، چند دقیقه صبر کنید و دوباره بررسی کنید"

