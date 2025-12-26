# دستورالعمل دریافت و اجرای پروژه روی هاست

## مرحله 1: دریافت تغییرات از Git

```bash
# رفتن به پوشه پروژه
cd /path/to/your/project

# دریافت آخرین تغییرات
git pull origin master
```

یا اگر می‌خواهید همه چیز را از اول بگیرید:

```bash
# کلون کردن پروژه (اگر هنوز کلون نکرده‌اید)
git clone https://github.com/mohamadjavad200024/saded.git
cd saded

# یا اگر قبلاً کلون کرده‌اید، ریست و دریافت مجدد
git fetch origin
git reset --hard origin/master
```

## مرحله 2: نصب وابستگی‌ها

```bash
# نصب پکیج‌ها
npm install
```

## مرحله 3: تنظیم فایل‌های محیطی

```bash
# کپی کردن فایل env (اگر وجود دارد)
cp env.production.template .env

# ویرایش فایل .env و تنظیم متغیرهای محیطی
nano .env
# یا
vi .env
```

## مرحله 4: Build کردن پروژه

```bash
# Build پروژه
npm run build
```

یا اگر منابع محدود دارید:

```bash
npm run build:low-resource
```

## مرحله 5: اجرای پروژه

### روش 1: اجرای مستقیم

```bash
npm start
```

یا

```bash
node server.js
```

### روش 2: استفاده از PM2 (توصیه می‌شود برای production)

```bash
# نصب PM2 (اگر نصب نشده)
npm install -g pm2

# اجرا با PM2
pm2 start ecosystem.config.js

# یا
pm2 start server.js --name saded

# مشاهده لاگ‌ها
pm2 logs saded

# مشاهده وضعیت
pm2 status

# ریستارت
pm2 restart saded

# توقف
pm2 stop saded
```

## دستورات کامل یکجا

```bash
# دریافت تغییرات
cd /path/to/saded
git pull origin master

# نصب وابستگی‌ها
npm install

# Build
npm run build

# اجرا با PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## بررسی وضعیت

```bash
# بررسی وضعیت Git
git status

# بررسی پورت (معمولاً 3000)
netstat -tulpn | grep 3000
# یا
lsof -i :3000

# بررسی لاگ‌های PM2
pm2 logs saded --lines 50
```

## عیب‌یابی

اگر مشکلی پیش آمد:

```bash
# پاک کردن node_modules و نصب مجدد
rm -rf node_modules package-lock.json
npm install

# پاک کردن .next و build مجدد
rm -rf .next
npm run build

# بررسی خطاها
npm run build 2>&1 | tee build.log
```

## نکات مهم

1. مطمئن شوید Node.js و npm نصب هستند
2. پورت 3000 (یا پورت تعریف شده در .env) باید آزاد باشد
3. فایل .env باید به درستی تنظیم شده باشد
4. برای production از PM2 استفاده کنید
5. لاگ‌ها را بررسی کنید در صورت بروز مشکل
