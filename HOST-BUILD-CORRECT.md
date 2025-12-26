# دستور Build صحیح روی سرور

## مشکل:
`--no-turbo` در Next.js 16.0.3 پشتیبانی نمی‌شود. باید از متغیر محیطی استفاده کنیم.

## دستورات صحیح:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با Webpack (غیرفعال کردن Turbopack با متغیر محیطی)
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npx next build
```

## یا استفاده از npm run:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (اگر package.json به‌روز شده)
git pull origin main

# Build
npm run build:low-resource
```

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

## نکات:

- `NEXT_PRIVATE_SKIP_TURBO=1` باعث می‌شود از Webpack به جای Turbopack استفاده شود
- `NODE_OPTIONS='--max-old-space-size=2048'` حافظه را به 2GB محدود می‌کند
- از `npx next` استفاده کنید چون `next` در PATH نیست

