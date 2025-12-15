#!/bin/bash

# اسکریپت بررسی جدول users در دیتابیس

echo "🔍 بررسی جدول users در دیتابیس..."
echo ""

cd ~/public_html/saded

# بررسی از طریق API
echo "1️⃣ تست API Register (برای ساخت خودکار جدول):"
curl -s -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"test","phone":"09123456789","password":"test123"}' | head -c 300
echo ""
echo ""

# بررسی از طریق API Login (برای تست جدول)
echo "2️⃣ تست API Login:"
curl -s -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"phone":"09123456789","password":"test123"}' | head -c 300
echo ""
echo ""

# بررسی Health Check
echo "3️⃣ تست Health Check:"
curl -s "http://localhost:3001/api/health" | head -c 200
echo ""
echo ""

echo "✅ بررسی کامل شد!"


