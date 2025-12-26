# راه حل ساده - رفع مشکلات Build

## مشکل چیست؟

1. **`@tailwindcss/postcss` پیدا نمی‌شود**: این پکیج در virtual environment نصب می‌شود اما به خاطر symlink، Next.js نمی‌تواند آن را پیدا کند.

2. **`@/components/layout/header` پیدا نمی‌شود**: Path aliases کار نمی‌کنند.

## راه حل ساده:

### گزینه 1: استفاده از Tailwind CSS v3 (توصیه می‌شود)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب tailwindcss v3 و autoprefixer
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install tailwindcss@^3 autoprefixer --save-dev

# 2. Pull تغییرات (postcss.config.js تغییر کرده)
git pull origin main

# 3. پاک کردن cache
rm -rf .next

# 4. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

### گزینه 2: نصب @tailwindcss/postcss در مسیر مستقیم

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب مستقیم در virtual environment
cd /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install @tailwindcss/postcss --save-dev
cd /home/shop1111/public_html/saded

# Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## تغییرات انجام شده:

1. ✅ `postcss.config.mjs` → `postcss.config.js` (استفاده از tailwindcss به جای @tailwindcss/postcss)
2. ✅ `next.config.js` - اضافه شدن `symlinks: false` برای رفع مشکل symlink

## بعد از Build موفق:

```bash
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

