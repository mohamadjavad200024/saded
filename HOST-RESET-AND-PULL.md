# Reset و Pull در هاست

## مشکل:
- Git pull conflict - local changes در `.next` وجود دارد
- `.next/BUILD_ID` وجود ندارد

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. حذف local changes در .next
rm -rf .next

# 2. Pull از remote
git fetch origin master
git reset --hard origin/master

# 3. بررسی وجود BUILD_ID
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"

# 4. اگر BUILD_ID وجود ندارد، بررسی محتویات
ls -la .next/ | head -20
find .next -name "BUILD_ID" 2>/dev/null

# 5. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر هنوز BUILD_ID وجود ندارد:

```bash
# بررسی که فایل‌های build pull شده‌اند
ls -la .next/server/ 2>/dev/null | head -10
ls -la .next/static/ 2>/dev/null | head -10
ls -la .next/*.json 2>/dev/null
```

