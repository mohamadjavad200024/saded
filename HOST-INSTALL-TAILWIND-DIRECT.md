# نصب مستقیم tailwindcss در virtual environment

## مشکل:
npm install می‌گوید "up to date" اما tailwindcss نصب نمی‌شود.

## راه حل: نصب مستقیم با --prefix

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب مستقیم tailwindcss و autoprefixer با --prefix
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install --prefix /home/shop1111/nodevenv/public_html/saded/20 tailwindcss@^3 autoprefixer --save-dev

# 2. بررسی نصب
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 3. اگر پیدا نشد، بررسی package.json در virtual environment
cat /home/shop1111/nodevenv/public_html/saded/20/package.json 2>/dev/null || echo "No package.json in venv"

# 4. کپی package.json به virtual environment (اگر نیاز بود)
if [ ! -f "/home/shop1111/nodevenv/public_html/saded/20/package.json" ]; then
  cp package.json /home/shop1111/nodevenv/public_html/saded/20/
  cd /home/shop1111/nodevenv/public_html/saded/20
  /home/shop1111/nodevenv/public_html/saded/20/bin/npm install
  cd /home/shop1111/public_html/saded
fi

# 5. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 6. پاک کردن cache
rm -rf .next

# 7. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## راه حل جایگزین: استفاده از cPanel

اگر npm install کار نکرد، از cPanel Node.js Selector استفاده کنید:
1. وارد cPanel شوید
2. به "Setup Node.js App" بروید
3. Application را انتخاب کنید
4. روی "NPM Install" کلیک کنید

این کار تمام dependencies را از package.json نصب می‌کند.

