# Pull و Run در هاست

## مشکل:
- Divergent branches (branch محلی و remote متفاوت هستند)
- `.next` directory وجود ندارد

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. حل divergent branches - merge
git config pull.rebase false
git pull origin master --no-rebase

# یا اگر می‌خواهید local changes را نگه دارید:
# git stash
# git pull origin master --no-rebase
# git stash pop

# 2. بررسی وجود .next
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"

# 3. اگر .next وجود ندارد، بررسی کنید که pull موفق بود
git status

# 4. اگر هنوز .next وجود ندارد، بررسی کنید که فایل‌ها pull شده‌اند
ls -la .next/ 2>/dev/null | head -10

# 5. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر pull موفق نبود:

```bash
# Force pull (توجه: local changes از دست می‌رود)
git fetch origin master
git reset --hard origin/master

# بررسی
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found"
```

