#!/bin/bash
# بررسی خطاهای دقیق در PM2 logs

echo "=========================================="
echo "بررسی لاگ‌های PM2 برای خطاهای دقیق"
echo "=========================================="

cd ~/public_html/saded

# بررسی آخرین خطاها
echo ""
echo "📋 آخرین خطاهای PM2 (50 خط):"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --err --nostream

echo ""
echo "=========================================="
echo "تست مستقیم API از سرور:"
echo "=========================================="

# تست API
echo ""
echo "✅ تست /api/chat/unread-count:"
curl -s "http://localhost:3001/api/chat/unread-count?all=true" | head -c 500
echo ""

echo ""
echo "✅ تست /api/chat (list):"
curl -s "http://localhost:3001/api/chat" | head -c 500
echo ""

echo ""
echo "=========================================="
echo "بررسی وضعیت PM2:"
echo "=========================================="
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status

