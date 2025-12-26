# Build با Webpack (راه حل نهایی)

## مشکل:
Turbopack نمی‌تواند با symlink که به خارج از filesystem root اشاره می‌کند کار کند.

## راه حل: استفاده از --webpack flag

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات
git pull origin main

# Build با Webpack
npm run build:low-resource
```

## یا به صورت مستقیم:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با Webpack
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

## نکات:

- `--webpack` flag باعث می‌شود Next.js از Webpack به جای Turbopack استفاده کند
- `NODE_OPTIONS='--max-old-space-size=2048'` حافظه را به 2GB محدود می‌کند
- Webpack با symlink‌های CloudLinux سازگار است

