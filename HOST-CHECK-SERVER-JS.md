# بررسی server.js در هاست

## مشکل:
`server.js` پیدا نمی‌شود در هاست.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وجود server.js
ls -la server.js && echo "✓ server.js exists" || echo "✗ server.js NOT found"

# 2. اگر server.js وجود ندارد، pull مجدد
git fetch origin master
git reset --hard origin/master

# 3. بررسی مجدد
ls -la server.js && echo "✓ server.js exists" || echo "✗ server.js NOT found"

# 4. اگر هنوز وجود ندارد، بررسی git status
git status server.js

# 5. Restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر server.js در remote نیست:

باید در محلی commit و push کنید:
```bash
git add server.js
git commit -m "Add: server.js for production"
git push origin master
```

