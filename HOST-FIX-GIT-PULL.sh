#!/bin/bash

# اسکریپت حل مشکل Git pull برای فایل‌های .next

echo "🔧 حل مشکل Git pull..."

cd ~/public_html/saded

# 1. ذخیره تغییرات محلی (اختیاری - برای backup)
echo "1️⃣ ذخیره تغییرات محلی..."
git stash push -m "Backup local .next changes before pull" .next/ 2>/dev/null || true

# 2. Reset فایل‌های .next به آخرین commit
echo "2️⃣ Reset فایل‌های .next..."
git checkout HEAD -- .next/ 2>/dev/null || true

# 3. Pull تغییرات جدید
echo "3️⃣ Pull تغییرات جدید..."
git pull origin main

# 4. بررسی وضعیت
echo "4️⃣ بررسی وضعیت Git..."
git status --short .next/ | head -20

echo ""
echo "✅ انجام شد!"

