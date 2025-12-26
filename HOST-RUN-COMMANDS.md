# دستورات Run برای هاست

## بررسی نصب tailwindcss (بعد از NPM Install از cPanel):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی tailwindcss در venv
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found in venv" || echo "✗ Not found in venv"

# 2. بررسی tailwindcss در symlink
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found via symlink" || echo "✗ Not found via symlink"

# 3. اگر پیدا نشد، نصب دستی
if [ ! -d "/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss" ]; then
  echo "Installing tailwindcss manually..."
  cd /home/shop1111/nodevenv/public_html/saded/20
  npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
  cd /home/shop1111/public_html/saded
fi

# 4. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Ready" || echo "✗ Still missing"
```

## دستورات Run:

### روش 1: با PM2 (توصیه می‌شود)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# بررسی PM2
which pm2 || npm install -g pm2

# Stop اگر در حال اجرا است
pm2 stop saded 2>/dev/null || true
pm2 delete saded 2>/dev/null || true

# Start با ecosystem.config.js
pm2 start ecosystem.config.js

# Save برای auto-restart
pm2 save

# Status
pm2 status
pm2 logs saded --lines 50
```

### روش 2: مستقیم با node (برای تست)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Run مستقیم
NODE_ENV=production PORT=3001 HOSTNAME=0.0.0.0 NODE_OPTIONS='--max-old-space-size=4096' node server.js
```

### روش 3: با cPanel Node.js App Manager

1. به cPanel بروید
2. Node.js App Manager را باز کنید
3. Application URI را انتخاب کنید (77191336.shop)
4. روی "Run JS script" کلیک کنید و `server.js` را انتخاب کنید
5. یا روی "START APP" کلیک کنید

## بررسی Logs:

```bash
# PM2 logs
pm2 logs saded --lines 100

# یا log files
tail -f /home/shop1111/public_html/saded/logs/pm2-combined.log
```

## بررسی Status:

```bash
# PM2 status
pm2 status

# Process check
ps aux | grep node

# Port check
netstat -tuln | grep 3001
```

## اگر Build نیاز است:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با webpack
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

