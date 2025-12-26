# Build کامل پروژه

## مشکل:
- `.next/server/app/page.js` وجود ندارد
- فقط `_global-error` folder وجود دارد
- `build:low-resource` script وجود ندارد

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی scripts موجود
echo "=== Available scripts ==="
npm run

# 2. بررسی package.json
echo "=== Checking package.json ==="
grep -A 10 '"scripts"' package.json | head -20

# 3. Build با script موجود
echo "=== Building... ==="
# اگر build:low-resource وجود ندارد، از build استفاده کنید
npm run build

# یا اگر build:low-resource وجود دارد:
# npm run build:low-resource

# 4. بررسی بعد از build
echo "=== Checking after build ==="
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"
ls -la .next/server/app/ 2>/dev/null | head -20

# 5. اگر build موفق بود، Restart PM2
pm2 restart saded

# 6. Wait and test
sleep 5
curl -v http://localhost:3001/ 2>&1 | head -40
```

## نکات:

1. **اگر build fail کرد:** باید خطاهای build را بررسی کنیم
2. **اگر build موفق بود:** باید `page.js` وجود داشته باشد
3. **اگر `page.js` هنوز وجود ندارد:** باید بررسی کنیم که آیا build کامل شده یا نه

