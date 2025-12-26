# Fix Missing Build Files

## مشکل:
- `.next/server/app/page.js` وجود ندارد
- این یعنی build کامل نشده یا فایل‌های build ناقص است

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی ساختار .next folder
echo "=== Checking .next structure ==="
ls -la .next/ 2>/dev/null | head -20
ls -la .next/server/ 2>/dev/null | head -20
ls -la .next/server/app/ 2>/dev/null | head -20

# 2. بررسی اینکه آیا فایل‌های build وجود دارند
echo "=== Checking build files ==="
find .next/server -name "*.js" -type f 2>/dev/null | head -10
find .next/server/app -name "*.js" -type f 2>/dev/null | head -10

# 3. بررسی BUILD_ID
echo "=== Checking BUILD_ID ==="
cat .next/BUILD_ID 2>/dev/null || echo "BUILD_ID not found"

# 4. بررسی اینکه آیا باید دوباره build کنیم
echo "=== Checking if rebuild is needed ==="
# اگر page.js وجود ندارد، باید build کنیم

# 5. Build مجدد (اگر لازم باشد)
echo "=== Rebuilding... ==="
npm run build:low-resource

# 6. بررسی بعد از build
echo "=== Checking after build ==="
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"

# 7. Restart PM2
pm2 restart saded

# 8. Wait and test
sleep 5
curl -v http://localhost:3001/ 2>&1 | head -40
```

## نکات:

1. **اگر `page.js` وجود ندارد:** باید build کنیم
2. **اگر build fail کرد:** باید خطاهای build را بررسی کنیم
3. **اگر build موفق بود:** باید PM2 را restart کنیم

