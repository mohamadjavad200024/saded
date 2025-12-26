# بررسی فایل‌های Git

## مشکل:
- `app` folder در هاست وجود ندارد
- `git pull` می‌گوید "Already up to date"
- این یعنی فایل‌ها در git commit نشده‌اند

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی اینکه آیا app folder در git است
echo "=== Checking if app folder is in git ==="
git ls-files | grep "^app/" | head -10

# 2. بررسی git status
echo "=== Checking git status ==="
git status | head -30

# 3. بررسی remote repository
echo "=== Checking remote ==="
git remote -v

# 4. بررسی آخرین commit
echo "=== Checking last commit ==="
git log --oneline -5

# 5. بررسی اینکه آیا app folder در آخرین commit است
echo "=== Checking if app folder is in last commit ==="
git ls-tree -r HEAD --name-only | grep "^app/" | head -10

# 6. اگر app folder در git نیست، باید از local push کنیم
# اما اول باید بررسی کنیم که آیا در local وجود دارد
```

## راه حل:

اگر `app` folder در git نیست، باید:
1. از local commit کنیم
2. push کنیم
3. در هاست pull کنیم

اما از آنجایی که کاربر گفته بود که build را local انجام دهیم و push کنیم، احتمالاً فایل‌های source code در git نیستند.

**راه حل موقت:** باید فایل‌های source code را از local به هاست منتقل کنیم یا در git commit کنیم.

