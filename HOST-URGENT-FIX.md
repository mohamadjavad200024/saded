# راه حل فوری - رفع مشکلات Build

## دستورات کامل (کپی و پیست کنید):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب مجدد تمام dependencies (شامل devDependencies)
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install

# 2. بررسی نصب @tailwindcss/postcss
ls -la node_modules/@tailwindcss/postcss 2>/dev/null && echo "✓ Found" || echo "✗ Not found"

# 3. اگر پیدا نشد، نصب مستقیم
if [ ! -d "node_modules/@tailwindcss/postcss" ]; then
  /home/shop1111/nodevenv/public_html/saded/20/bin/npm install @tailwindcss/postcss tailwindcss --save-dev
fi

# 4. Pull تغییرات (next.config.js به‌روز شده)
git pull origin main

# 5. پاک کردن cache
rm -rf .next

# 6. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## تغییرات انجام شده:

1. ✅ `next.config.js` - اضافه شدن `config.resolve.symlinks = false` برای رفع مشکل symlink
2. ✅ Webpack alias برای path resolution

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

