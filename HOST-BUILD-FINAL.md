# دستورات نهایی Build روی سرور

## دستورات کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات جدید
git pull origin main

# Build با Webpack (بدون Turbopack) - استفاده از npx
NODE_OPTIONS='--max-old-space-size=2048' npx next build --no-turbo

# یا استفاده از npm run build:low-resource (بعد از pull)
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

- از `npx next` به جای `next` استفاده کنید
- `--no-turbo` باعث استفاده از Webpack می‌شود که با symlink سازگار است
- `NODE_OPTIONS='--max-old-space-size=2048'` حافظه را محدود می‌کند

