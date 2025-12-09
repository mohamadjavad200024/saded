# 🚀 راهنمای دریافت پروژه در هاست

## 📋 دستورات دریافت پروژه

### روش 1: Clone کردن (اگر پروژه را برای اولین بار دریافت می‌کنید)

```bash
# رفتن به دایرکتوری public_html یا www
cd ~/public_html
# یا
cd ~/www
# یا
cd /home/username/public_html

# Clone کردن پروژه
git clone https://github.com/mohamadjavad200024/saded.git

# رفتن به دایرکتوری پروژه
cd saded
```

### روش 2: Pull کردن (اگر پروژه قبلاً clone شده است)

```bash
# رفتن به دایرکتوری پروژه
cd ~/public_html/saded
# یا مسیر واقعی پروژه شما

# دریافت آخرین تغییرات (force pull)
git fetch origin
git reset --hard origin/main

# یا به صورت یک خط:
git pull origin main --force
```

### روش 3: اگر repository قبلاً وجود دارد و می‌خواهید کاملاً جایگزین شود

```bash
# رفتن به دایرکتوری پروژه
cd ~/public_html/saded

# حذف تمام فایل‌های قدیمی (مراقب باشید!)
rm -rf *

# دریافت مجدد از repository
git fetch origin
git reset --hard origin/main
```

## ⚙️ مراحل بعدی پس از دریافت

### 1. نصب Dependencies

```bash
# نصب با npm
npm install

# یا اگر pnpm دارید
pnpm install
```

### 2. تنظیم فایل .env

```bash
# ایجاد فایل .env
nano .env
# یا
vi .env
```

محتوای فایل `.env`:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shop1111_saded02
DB_USER=shop1111_saded002
DB_PASSWORD=goul77191336

# Application
NODE_ENV=production
NEXT_PUBLIC_URL=https://yourdomain.com

# Zarinpal (اختیاری)
# ZARINPAL_MERCHANT_ID=your-merchant-id
```

**نکته:** اطلاعات دیتابیس را از cPanel → MySQL Databases کپی کنید.

### 3. راه‌اندازی دیتابیس

```bash
# راه‌اندازی جداول MySQL
npm run setup-mysql

# یا
node scripts/setup-mysql.js
```

### 4. Build پروژه

```bash
# Build برای production
npm run build
```

### 5. اجرای پروژه

#### با PM2 (توصیه می‌شود):

```bash
# نصب PM2 (اگر نصب نیست)
npm install -g pm2

# اجرا با PM2
pm2 start ecosystem.config.js

# یا
pm2 start npm --name "saded" -- start
```

#### با npm start:

```bash
npm start
```

## 🔧 تنظیمات PM2

اگر از PM2 استفاده می‌کنید، فایل `ecosystem.config.js` را بررسی کنید:

```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
pm2 logs saded

# راه‌اندازی مجدد
pm2 restart saded

# توقف
pm2 stop saded
```

## ✅ بررسی نهایی

### تست اتصال دیتابیس:

```bash
node scripts/test-db-connection.js
```

### بررسی سلامت سیستم:

```bash
npm run health-check
```

### تست API:

```bash
# بررسی اتصال دیتابیس
curl http://localhost:3000/api/health/db

# بررسی لیست محصولات
curl http://localhost:3000/api/products
```

## 📝 نکات مهم

1. **مسیر پروژه:** مطمئن شوید که در مسیر درست هستید
2. **فایل .env:** حتماً باید ایجاد شود و اطلاعات دیتابیس را داشته باشد
3. **Node.js:** باید Node.js و npm نصب باشند
4. **MySQL:** باید MySQL در هاست فعال باشد
5. **Port:** اگر از PM2 استفاده می‌کنید، پورت را در `ecosystem.config.js` بررسی کنید

## 🐛 رفع مشکلات

### خطای "Permission denied"
```bash
chmod -R 755 .
```

### خطای "Command not found: npm"
```bash
# نصب Node.js (بسته به هاست)
# یا از پشتیبانی هاست کمک بگیرید
```

### خطای اتصال به دیتابیس
- اطلاعات دیتابیس را از cPanel بررسی کنید
- مطمئن شوید MySQL در حال اجرا است

## 🎉 پس از راه‌اندازی

پروژه شما باید در آدرس زیر در دسترس باشد:
- `https://yourdomain.com` (اگر در public_html است)
- یا آدرس اختصاصی که هاست به شما داده است

**موفق باشید! 🚀**

