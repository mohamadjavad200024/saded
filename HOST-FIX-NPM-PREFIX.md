# رفع مشکل npm prefix

## مشکل شناسایی شده:
npm prefix به `/opt/alt/alt-nodejs20/root/usr` اشاره می‌کند به جای virtual environment. این باعث می‌شود که `npm install` packages را در مسیر اشتباه نصب کند.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. تنظیم npm prefix به virtual environment
npm config set prefix /home/shop1111/nodevenv/public_html/saded/20

# 2. بررسی prefix
npm config get prefix

# 3. نصب tailwindcss و autoprefixer
npm install tailwindcss@^3 autoprefixer --save-dev

# 4. بررسی نصب
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 5. اگر پیدا شد، symlink را دوباره ایجاد کنید
rm -f node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 6. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found via symlink" || echo "✗ Still not found"

# 7. پاک کردن cache
rm -rf .next

# 8. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز کار نکرد:

```bash
# نصب مستقیم در virtual environment با --prefix
npm install --prefix /home/shop1111/nodevenv/public_html/saded/20 tailwindcss@^3 autoprefixer --save-dev
```

