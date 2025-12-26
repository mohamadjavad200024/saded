# رفع نهایی مشکل Turbopack با Symlink

## مشکل:
`NEXT_PRIVATE_SKIP_TURBO=1` کار نمی‌کند و Turbopack هنوز استفاده می‌شود.

## راه حل 1: استفاده از export (توصیه می‌شود)

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# تنظیم متغیر محیطی با export
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

# Build
npx next build
```

## راه حل 2: ایجاد فایل .env.production

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد فایل .env.production
echo "NEXT_PRIVATE_SKIP_TURBO=1" >> .env.production
echo "NODE_OPTIONS=--max-old-space-size=2048" >> .env.production

# Build
npx next build
```

## راه حل 3: استفاده از webpack به صورت مستقیم

اگر هیچکدام کار نکرد، باید next.config.js را تغییر دهیم.

## دستورات کامل (راه حل 1):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# تنظیم متغیرهای محیطی
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

# Build
npx next build

# بررسی خروجی - باید "webpack" ببینید نه "Turbopack"
```

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

