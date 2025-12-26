# Fix Runtime 500 Error

## دستورات برای بررسی دقیق‌تر:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی تمام logs برای خطاها
pm2 logs saded --lines 200 --nostream | grep -i "error\|exception\|failed" | tail -20

# 2. بررسی فایل log خروجی کامل (بعد از 18:40)
tail -200 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -A 10 -B 5 "Error\|error\|ERROR\|15:1"

# 3. بررسی فایل‌های build
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"
ls -la .next/server/app/_not-found/page.js 2>/dev/null && echo "✓ _not-found exists" || echo "✗ _not-found NOT found"

# 4. بررسی static files
ls -la .next/static/ 2>/dev/null | head -10

# 5. تست با verbose logging
NODE_ENV=production node server.js &
sleep 2
curl -v http://localhost:3001/ 2>&1
pkill -f "node server.js"

# 6. بررسی اینکه آیا خطا در database connection است
# (اگر صفحه به DB نیاز دارد)
```

## راه حل احتمالی: بهبود error handling در server.js

اگر خطاها لاگ نمی‌شوند، باید server.js را بهبود دهیم تا خطاها را بهتر لاگ کند.

