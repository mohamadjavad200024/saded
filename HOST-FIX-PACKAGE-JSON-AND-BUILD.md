# Fix package.json and Build

## مشکل:
- `package.json` در virtual environment آپدیت نشده
- `npm run` هیچ خروجی نمی‌دهد
- scripts وجود ندارند

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی package.json در project root
echo "=== Checking package.json in project ==="
head -30 package.json | grep -A 20 '"scripts"'

# 2. بررسی package.json در virtual environment
echo "=== Checking package.json in venv ==="
head -30 /home/shop1111/nodevenv/public_html/saded/20/package.json 2>/dev/null | grep -A 20 '"scripts"' || echo "No package.json in venv"

# 3. کپی package.json به virtual environment (اگر لازم باشد)
# معمولاً نباید این کار را انجام دهیم، اما می‌توانیم بررسی کنیم

# 4. Build مستقیماً با next build
echo "=== Building directly with next build ==="
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

# 5. بررسی بعد از build
echo "=== Checking after build ==="
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"
ls -la .next/server/app/ 2>/dev/null | head -20

# 6. اگر build موفق بود، Restart PM2
pm2 restart saded

# 7. Wait and test
sleep 5
curl -v http://localhost:3001/ 2>&1 | head -40
```

## نکات:

1. **اگر `npx next build` کار کرد:** build انجام می‌شود
2. **اگر build fail کرد:** باید خطاهای build را بررسی کنیم
3. **اگر build موفق بود:** باید `page.js` وجود داشته باشد

