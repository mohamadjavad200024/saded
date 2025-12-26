# Pull app folder در هاست

## بررسی:
- `app` folder در local وجود دارد
- احتمالاً در git commit شده است
- باید در هاست pull کنیم

## دستورات در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی اینکه آیا app folder در git است
git ls-tree -r HEAD --name-only | grep "^app/" | head -5

# 2. اگر app folder در git است، pull کنیم
git pull origin master

# 3. بررسی بعد از pull
ls -la app/ | head -10

# 4. اگر app folder وجود دارد، build کنیم
if [ -d "app" ]; then
  echo "=== Building... ==="
  NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
else
  echo "✗ app folder still not found"
fi

# 5. بررسی بعد از build
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"

# 6. Restart PM2
pm2 restart saded

# 7. Wait and test
sleep 5
curl -v http://localhost:3001/ 2>&1 | head -40
```

