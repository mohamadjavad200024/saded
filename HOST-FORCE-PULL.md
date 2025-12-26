# Force Pull در هاست

## مشکل:
- `fatal: refusing to merge unrelated histories` - Git histories متفاوت هستند
- `.next/BUILD_ID` وجود ندارد

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Force pull با --allow-unrelated-histories
git pull origin master --allow-unrelated-histories --no-rebase

# یا اگر conflict داشت:
# git fetch origin master
# git reset --hard origin/master

# 2. بررسی وجود BUILD_ID
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"

# 3. اگر BUILD_ID وجود ندارد، بررسی محتویات .next
ls -la .next/ | grep -E "BUILD_ID|static|server"

# 4. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر هنوز BUILD_ID وجود ندارد:

```bash
# بررسی که فایل‌های build pull شده‌اند
find .next -name "BUILD_ID" 2>/dev/null
find .next -name "*.json" | head -5
ls -la .next/server/ 2>/dev/null | head -5
ls -la .next/static/ 2>/dev/null | head -5
```

