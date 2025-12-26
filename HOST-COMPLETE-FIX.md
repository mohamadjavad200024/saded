# راه حل کامل و نهایی

## دستورات کامل (کپی و پیست کنید):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب @tailwindcss/postcss
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install @tailwindcss/postcss --save-dev

# 2. Pull تغییرات (next.config.js به‌روز شده)
git pull origin main

# 3. پاک کردن cache
rm -rf .next

# 4. Build با Webpack
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

## تغییرات انجام شده:

1. ✅ `next.config.js` - اضافه شدن webpack config برای path resolution
2. ✅ نصب `@tailwindcss/postcss` در virtual environment

## اگر هنوز مشکل داشتید:

```bash
# نصب تمام dependencies
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install

# Build مجدد
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

