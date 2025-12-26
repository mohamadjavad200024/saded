# دستورات نهایی برای دپلوی روی هاست

## دستورات کامل (کپی و پیست کنید):

```bash
# فعال‌سازی محیط مجازی و رفتن به مسیر پروژه
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات جدید
git pull origin main

# Build با منابع محدود (غیرفعال کردن Turbopack)
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npm run build

# نصب PM2 (اگر نصب نشده)
npm install -g pm2

# راه‌اندازی PM2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# ذخیره تنظیمات PM2
pm2 save

# بررسی وضعیت
pm2 status
pm2 logs saded --lines 20
```

## دستورات به صورت یک خط (برای کپی سریع):

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate && cd /home/shop1111/public_html/saded && git pull origin main && NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npm run build && npm install -g pm2 && pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js && pm2 save && pm2 status
```

## اگر Build خطا داد:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# پاک کردن cache
rm -rf .next

# Build مجدد
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npm run build
```

## دستورات مدیریت PM2:

```bash
# بررسی وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs saded --lines 50

# مشاهده لاگ‌های خطا
pm2 logs saded --err --lines 50

# راه‌اندازی مجدد
pm2 restart saded

# توقف
pm2 stop saded

# شروع
pm2 start ecosystem.config.js

# حذف
pm2 delete saded

# بررسی استفاده از منابع
pm2 monit
```

## بررسی وضعیت سرور:

```bash
# بررسی پورت
netstat -tulpn | grep :3001

# بررسی استفاده از حافظه
free -h

# بررسی process ها
ps aux | grep node
```

## نکات مهم:

1. **NEXT_PRIVATE_SKIP_TURBO=1**: غیرفعال کردن Turbopack و استفاده از Webpack (کمتر resource مصرف می‌کند)
2. **NODE_OPTIONS='--max-old-space-size=2048'**: محدود کردن حافظه به 2GB
3. **پورت**: مطابق ecosystem.config.js پورت 3001 استفاده می‌شود
4. **PM2**: اگر نصب نشده، با `npm install -g pm2` نصب کنید

## عیب‌یابی:

### اگر Build خطا داد:
```bash
# پاک کردن cache و build مجدد
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' NEXT_PRIVATE_SKIP_TURBO=1 npm run build
```

### اگر PM2 کار نمی‌کند:
```bash
# بررسی نصب
which pm2

# نصب PM2
npm install -g pm2

# راه‌اندازی دستی برای تست
node server.js
```

### اگر پورت در دسترس نیست:
```bash
# بررسی process روی پورت
lsof -i :3001

# بررسی فایروال
sudo ufw status
```

