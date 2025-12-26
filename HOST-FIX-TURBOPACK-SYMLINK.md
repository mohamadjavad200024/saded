# رفع مشکل Turbopack با Symlink

## مشکل:
Turbopack نمی‌تواند با symlink که به خارج از filesystem root اشاره می‌کند کار کند.

## راه حل:

### گزینه 1: استفاده از --no-turbo flag (توصیه می‌شود)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build بدون Turbopack (استفاده از Webpack)
NODE_OPTIONS='--max-old-space-size=2048' next build --no-turbo
```

### گزینه 2: استفاده از npm run build:low-resource (بعد از به‌روزرسانی)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات جدید
git pull origin main

# Build
npm run build:low-resource
```

### گزینه 3: تنظیم next.config.js برای استفاده از Webpack

اگر --no-turbo کار نکرد، باید next.config.js را تغییر دهید.

## دستورات کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (شامل fix)
git pull origin main

# Build با Webpack (بدون Turbopack)
NODE_OPTIONS='--max-old-space-size=2048' next build --no-turbo
```

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

