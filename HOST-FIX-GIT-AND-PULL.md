# رفع Git Config و Pull

## مشکل:
- Git config برای user.name و user.email تنظیم نشده
- `.next/BUILD_ID` وجود ندارد

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. تنظیم Git config
git config user.email "shop1111@example.com"
git config user.name "shop1111"

# 2. Force pull با --allow-unrelated-histories
git pull origin master --allow-unrelated-histories --no-rebase

# 3. بررسی وجود BUILD_ID
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"

# 4. اگر BUILD_ID وجود ندارد، بررسی محتویات
ls -la .next/ | head -20
find .next -name "BUILD_ID" 2>/dev/null

# 5. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر pull conflict داشت:

```bash
# Stash local changes
git stash

# Pull
git pull origin master --allow-unrelated-histories --no-rebase

# بررسی
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"
```

