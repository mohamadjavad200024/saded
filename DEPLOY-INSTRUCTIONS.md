# دستورات دپلوی و هاستینگ

## مراحل آماده‌سازی

### 1. بیلد پروژه
```bash
npm run build
```

### 2. راه‌اندازی Git (اگر هنوز initialize نشده)
```bash
git init
git add .
git commit -m "Clean up: Remove temporary files and build for production"
```

### 3. اتصال به Remote Repository (اگر وجود دارد)
```bash
git remote add origin <YOUR_REPO_URL>
git branch -M main
git push -u origin main
```

## دستورات هاستینگ (Linux/cPanel)

### اتصال به سرور
```bash
ssh username@your-server.com
# یا از طریق cPanel Terminal
```

### نصب Dependencies
```bash
cd /home/username/public_html
# یا مسیر پروژه شما
npm install --production
```

### Pull تغییرات از Git
```bash
git pull origin main
# یا
git pull origin master
```

### بیلد پروژه
```bash
npm run build
```

### راه‌اندازی با PM2
```bash
# نصب PM2 (اگر نصب نشده)
npm install -g pm2

# راه‌اندازی با PM2
pm2 start ecosystem.config.js

# یا راه‌اندازی مستقیم
pm2 start server.js --name "saded"

# ذخیره تنظیمات PM2
pm2 save

# تنظیم PM2 برای راه‌اندازی خودکار
pm2 startup
```

### بررسی وضعیت
```bash
# بررسی وضعیت PM2
pm2 status

# مشاهده لاگ‌ها
pm2 logs saded

# بررسی پورت
netstat -tulpn | grep :3000
```

### متغیرهای محیطی
اطمینان حاصل کنید که فایل `.env.production` یا `.env` با تنظیمات زیر وجود دارد:
```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

### Restart سرور
```bash
pm2 restart saded
# یا
pm2 restart all
```

### بررسی خطاها
```bash
# لاگ‌های PM2
pm2 logs saded --lines 100

# بررسی خطاهای Next.js
tail -f .next/trace

# بررسی استفاده از منابع
pm2 monit
```

## دستورات مفید دیگر

### توقف سرور
```bash
pm2 stop saded
```

### حذف از PM2
```bash
pm2 delete saded
```

### بررسی استفاده از حافظه
```bash
pm2 list
free -h
```

### بررسی لاگ‌های سیستم
```bash
journalctl -u nodejs -f
# یا
tail -f /var/log/nodejs.log
```

## نکات مهم

1. **پورت**: مطمئن شوید پورت 3000 (یا پورت تعریف شده) در فایروال باز است
2. **دیتابیس**: اطمینان حاصل کنید که دیتابیس MySQL/PostgreSQL در دسترس است
3. **فایل‌های Upload**: پوشه `/public/uploads` باید قابل نوشتن باشد
4. **متغیرهای محیطی**: تمام متغیرهای لازم را در `.env.production` تنظیم کنید
5. **HTTPS**: برای production از SSL استفاده کنید (Let's Encrypt یا cPanel SSL)

## عیب‌یابی

### اگر سرور راه‌اندازی نمی‌شود:
```bash
# بررسی خطاها
pm2 logs saded --err

# بررسی پورت
lsof -i :3000

# تست دستی
node server.js
```

### اگر بیلد با خطا مواجه شد:
```bash
# پاک کردن cache
rm -rf .next
npm run build
```

### اگر دیتابیس متصل نمی‌شود:
```bash
# تست اتصال
node scripts/test-mysql-connection.js
```

