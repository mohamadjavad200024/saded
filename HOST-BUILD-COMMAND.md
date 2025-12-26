# دستور Build روی سرور (با npx)

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (اگر نیاز بود)
git pull origin main || git pull origin master

# Build با Webpack (بدون Turbopack) - استفاده از npx
NODE_OPTIONS='--max-old-space-size=2048' npx next build --no-turbo
```

## یا استفاده از npm:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات
git pull origin main || git pull origin master

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

