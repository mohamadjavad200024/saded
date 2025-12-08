# راهنمای سریع راه‌اندازی MySQL

## 🚀 شروع سریع

### 1. نصب Dependencies

```bash
pnpm install
```

### 2. تنظیم فایل .env

فایل `.env` را در ریشه پروژه ایجاد کنید:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=saded
DB_USER=root
DB_PASSWORD=your_password_here

# Application
NODE_ENV=development
NEXT_PUBLIC_URL=http://localhost:3000

# Zarinpal (اختیاری)
ZARINPAL_MERCHANT_ID=your_merchant_id
```

### 3. راه‌اندازی دیتابیس

```bash
pnpm setup-mysql
```

این دستور:
- ✅ دیتابیس را ایجاد می‌کند
- ✅ جداول را ایجاد می‌کند
- ✅ Index ها را ایجاد می‌کند

### 4. تست اتصال

```bash
node scripts/test-db-connection.js
```

یا:

```bash
pnpm health-check
```

### 5. اجرای پروژه

```bash
pnpm dev
```

پروژه در آدرس `http://localhost:3000` در دسترس خواهد بود.

## 📋 برای هاست cPanel

### تنظیمات دیتابیس در cPanel

1. از **cPanel → MySQL Databases** بروید
2. یک دیتابیس جدید ایجاد کنید (مثلاً `username_saded`)
3. یک کاربر MySQL ایجاد کنید
4. کاربر را به دیتابیس اضافه کنید و دسترسی کامل بدهید
5. اطلاعات را در `.env.production` وارد کنید:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=username_saded
DB_USER=username_dbuser
DB_PASSWORD=your_password
DB_SSL=false
```

### راه‌اندازی در Production

```bash
# 1. نصب dependencies
pnpm install --production

# 2. Build پروژه
pnpm build

# 3. راه‌اندازی دیتابیس
node scripts/setup-db-production.js

# 4. اجرای سرور
pnpm start
```

## 🐛 رفع مشکلات

### خطای اتصال به دیتابیس

1. بررسی کنید MySQL در حال اجرا است
2. بررسی کنید اطلاعات در `.env` صحیح است
3. بررسی کنید کاربر دسترسی به دیتابیس دارد

### خطای "Database does not exist"

```bash
pnpm setup-mysql
```

### خطای "Access denied"

- رمز عبور را در `.env` بررسی کنید
- از cPanel → MySQL Databases → Modify User برای تغییر رمز استفاده کنید

## 📚 مستندات بیشتر

- [راهنمای کامل MySQL](./README-MYSQL.md)
- [README اصلی](./README.md)

## ✅ بررسی نهایی

پس از راه‌اندازی، این endpoint ها را تست کنید:

- `http://localhost:3000/api/health/db` - بررسی اتصال دیتابیس
- `http://localhost:3000/api/products` - لیست محصولات
- `http://localhost:3000/api/categories` - لیست دسته‌بندی‌ها

همه چیز باید کار کند! 🎉

