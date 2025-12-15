#!/bin/bash

# اسکریپت تست API چت بعد از rebuild

echo "🔍 تست API های چت..."
echo ""

# 1. تست Health Check
echo "1️⃣ Health Check:"
curl -s "http://localhost:3001/api/health" | head -c 200
echo ""
echo ""

# 2. تست Unread Count (All)
echo "2️⃣ Chat Unread Count (All):"
curl -s "http://localhost:3001/api/chat/unread-count?all=true" | head -c 300
echo ""
echo ""

# 3. تست Chat List
echo "3️⃣ Chat List:"
curl -s "http://localhost:3001/api/chat" | head -c 300
echo ""
echo ""

# 4. بررسی PM2 Status
echo "4️⃣ PM2 Status:"
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
echo ""

# 5. بررسی آخرین خطاها
echo "5️⃣ آخرین خطاهای PM2 (10 خط):"
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 10 --err --nostream | tail -20
echo ""

echo "✅ تست کامل شد!"


