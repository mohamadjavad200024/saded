# Fix: server.js missing on host

## مشکل:
`server.js` در هاست پیدا نمی‌شود.

## راه حل:

### در محلی (Windows):
```powershell
# 1. رفتن به مسیر پروژه
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# 2. Add و commit server.js
git add server.js
git commit -m "Add: server.js for production deployment"
git push origin master
```

### در هاست (Linux):
```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull تغییرات جدید
git fetch origin master
git reset --hard origin/master

# 2. بررسی وجود server.js
ls -la server.js && echo "✓ server.js exists" || echo "✗ server.js NOT found"

# 3. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

