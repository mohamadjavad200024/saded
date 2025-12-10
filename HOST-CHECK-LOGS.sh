#!/bin/bash

# اسکریپت بررسی لاگ‌های PM2

cd ~/public_html/saded

export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

echo "📋 بررسی لاگ‌های PM2..."
echo ""

echo "🔴 آخرین خطاها:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 20 --err --nostream | tail -30
echo ""

echo "📊 آخرین خروجی‌ها:"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 20 --out --nostream | tail -30
echo ""

echo "✅ بررسی کامل شد"

