# راه حل مشکل Build با خطای EAGAIN/EPERM

## مشکل:
خطای `EAGAIN` و `EPERM` به دلیل استفاده از 31 worker همزمان در Turbopack است که برای shared hosting زیاد است.

## راه حل 1: استفاده از Build با منابع محدود

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با منابع محدود
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 next build
```

## راه حل 2: استفاده از اسکریپت جدید

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# استفاده از اسکریپت build جدید
npm run build:low-resource
```

## راه حل 3: محدود کردن تعداد Worker ها

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# محدود کردن به 1 worker
NEXT_PRIVATE_SKIP_TURBO=1 NODE_OPTIONS='--max-old-space-size=2048' next build --experimental-worker-count=1
```

## راه حل 4: Build مرحله به مرحله

اگر هنوز خطا داد، می‌توانید build را در چند مرحله انجام دهید:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# پاک کردن cache قبلی
rm -rf .next

# Build با تنظیمات محدود
NEXT_PRIVATE_SKIP_TURBO=1 NODE_OPTIONS='--max-old-space-size=2048' next build
```

## نکات مهم:

1. **NEXT_PRIVATE_SKIP_TURBO=1**: غیرفعال کردن Turbopack و استفاده از Webpack
2. **NODE_OPTIONS='--max-old-space-size=2048'**: محدود کردن حافظه به 2GB
3. Build ممکن است کمی بیشتر طول بکشد اما موفق می‌شود

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

