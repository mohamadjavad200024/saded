#!/bin/bash

# اسکریپت Deploy سیستم مدیریت محتوای Footer
# این اسکریپت تغییرات را از Git دریافت کرده و PM2 را restart می‌کند

set -e  # در صورت خطا متوقف شود

echo "🚀 شروع Deploy سیستم مدیریت محتوای Footer..."
echo ""

# رفتن به دایرکتوری پروژه
cd ~/public_html/saded

echo "📂 دایرکتوری پروژه: $(pwd)"
echo ""

# دریافت تغییرات از Git
echo "📥 دریافت آخرین تغییرات از Git..."
git pull origin main
echo "✅ تغییرات دریافت شد"
echo ""

# تنظیم PATH برای Node.js
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی نسخه Node.js
echo "🔍 بررسی Node.js..."
/opt/alt/alt-nodejs20/root/usr/bin/node --version
echo ""

# Restart PM2
echo "🔄 Restart کردن PM2..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
echo ""

# صبر برای اطمینان از restart
echo "⏳ صبر برای اطمینان از restart..."
sleep 3
echo ""

# بررسی وضعیت
echo "📊 بررسی وضعیت PM2..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
echo ""

# نمایش لاگ‌های اخیر
echo "📋 نمایش آخرین لاگ‌ها..."
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 10 --nostream
echo ""

echo "✅ Deploy با موفقیت انجام شد!"
echo ""
echo "🔗 بررسی سیستم:"
echo "   - صفحه ادمین: https://your-domain.com/admin/settings"
echo "   - API: https://your-domain.com/api/settings/site-content"
echo ""


