# Fix: Missing prerender-manifest.json

## مشکل:
Next.js به `.next/prerender-manifest.json` نیاز دارد اما پیدا نمی‌شود.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی فایل‌های موجود در .next
ls -la .next/ | head -20
find .next -name "*.json" | head -10

# 2. بررسی وجود prerender-manifest.json
ls -la .next/prerender-manifest.json 2>/dev/null && echo "✓ Found" || echo "✗ NOT found"

# 3. اگر وجود ندارد، بررسی BUILD_ID
ls -la .next/BUILD_ID && echo "✓ BUILD_ID exists" || echo "✗ BUILD_ID NOT found"

# 4. بررسی محتویات .next/server
ls -la .next/server/ | head -10

# 5. اگر فایل‌های build ناقص هستند، باید rebuild کنید
# اما چون build در محلی انجام شده، باید pull مجدد کنید
git fetch origin master
git reset --hard origin/master

# 6. بررسی مجدد
ls -la .next/prerender-manifest.json 2>/dev/null && echo "✓ Found" || echo "✗ NOT found"

# 7. اگر هنوز وجود ندارد، باید rebuild کنید (اما این زمان‌بر است)
# یا می‌توانید یک فایل خالی ایجاد کنید (اما این ممکن است کار نکند)
# بهتر است rebuild کنید:
# npm run build:low-resource

# 8. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

