# Debug Runtime Error

## مشکل:
سرور راه‌اندازی شده اما درخواست‌ها خطای 500 می‌دهند و خطا در log نیست.

## دستورات برای بررسی دقیق‌تر:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی تمام logs (stdout و stderr)
pm2 logs saded --lines 100 --nostream | grep -A 5 -B 5 "Error\|error\|ERROR\|15:1"

# 2. بررسی فایل log خروجی کامل
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -A 5 -B 5 "Error\|error\|ERROR"

# 3. تست با curl و مشاهده response کامل
curl -v http://localhost:3001/ 2>&1 | head -30

# 4. بررسی اینکه آیا خطا در console.log است
pm2 logs saded --lines 200 --nostream | tail -50

# 5. بررسی فایل‌های build
ls -la .next/server/app/ | head -10
ls -la .next/server/app/page.js 2>/dev/null || echo "page.js not found"

# 6. تست یک route ساده
curl -v http://localhost:3001/api/health 2>&1 || echo "No health endpoint"

# 7. بررسی node_modules
ls -la node_modules/next 2>/dev/null && echo "next found" || echo "next NOT found"
```

## اگر خطا در rendering است:

```bash
# بررسی فایل‌های build شده
find .next/server -name "*.js" | head -5
ls -la .next/server/app/page.js 2>/dev/null || ls -la .next/server/pages/index.js 2>/dev/null
```

