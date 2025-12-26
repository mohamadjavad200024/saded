#!/bin/bash
# دستورات صحیح برای build و راه‌اندازی

# 1. فعال‌سازی virtual environment (مهم!)
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# 2. رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# 3. دریافت تغییرات (اختیاری)
git pull origin main

# 4. Build با webpack
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npm run build

# 5. راه‌اندازی
npm start

