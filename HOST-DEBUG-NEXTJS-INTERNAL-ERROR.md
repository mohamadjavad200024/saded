# Debug Next.js Internal Error

## مشکل:
- handle() کامل می‌شود اما 500 می‌دهد
- هیچ خطایی در catch block دیده نمی‌شود
- Next.js خودش خطا را handle می‌کند

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی اینکه آیا .next folder کامل است
echo "=== Checking .next folder ==="
ls -la .next/ 2>/dev/null | head -20
ls -la .next/server/ 2>/dev/null | head -10
ls -la .next/static/ 2>/dev/null | head -10

# 2. بررسی اینکه آیا page.js وجود دارد
echo "=== Checking page.js ==="
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"

# 3. بررسی prerender-manifest.json
echo "=== Checking prerender-manifest.json ==="
ls -la .next/prerender-manifest.json 2>/dev/null && echo "✓ prerender-manifest.json exists" || echo "✗ prerender-manifest.json NOT found"

# 4. تست با NODE_ENV=development برای دیدن خطاهای بیشتر
echo "=== Testing with NODE_ENV=development ==="
# ابتدا PM2 را stop کنید
pm2 stop saded

# سپس مستقیماً اجرا کنید
NODE_ENV=development PORT=3001 node server.js &
SERVER_PID=$!
sleep 3

# تست
curl -v http://localhost:3001/ 2>&1 | head -40

# Kill server
kill $SERVER_PID 2>/dev/null

# Restart PM2
pm2 restart saded

# 5. بررسی Next.js build logs (اگر موجود باشد)
echo "=== Checking for build errors ==="
find .next -name "*.log" -o -name "*error*" 2>/dev/null | head -10

# 6. بررسی اینکه آیا database connection مشکل دارد
echo "=== Checking database connection ==="
# اگر .env.local وجود دارد، بررسی کنید
cat .env.local 2>/dev/null | grep -E "DB_|DATABASE" || echo "No .env.local or no DB config"

# 7. بررسی logs بعد از تست
echo "=== Recent logs after test ==="
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log | tail -50
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log
```

## اگر مشکل از Next.js internal error handling است:

باید بررسی کنیم که آیا:
1. `.next` folder کامل است
2. Database connection مشکل دارد
3. Import کردن module مشکل دارد
4. Render کردن صفحه مشکل دارد

