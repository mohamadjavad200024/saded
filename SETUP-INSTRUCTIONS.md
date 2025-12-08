# 📋 دستورالعمل راه‌اندازی

## ✅ وضعیت فعلی

- ✅ Dependencies نصب شدند
- ✅ پروژه در حال اجرا است

## ⚠️ مراحل باقی‌مانده

### 1. ایجاد فایل .env

فایل `.env` را در ریشه پروژه ایجاد کنید و محتوای زیر را در آن قرار دهید:

```env
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=saded
DB_USER=root
DB_PASSWORD=your_mysql_password

# Application
NODE_ENV=development
NEXT_PUBLIC_URL=http://localhost:3000
```

**نکته:** `DB_PASSWORD` را با رمز MySQL خود جایگزین کنید.

### 2. راه‌اندازی دیتابیس MySQL

اگر MySQL نصب نیست:
- **Windows:** XAMPP یا MySQL Server را نصب کنید
- **Mac:** `brew install mysql`
- **Linux:** `sudo apt-get install mysql-server`

### 3. ایجاد دیتابیس

```bash
# اتصال به MySQL
mysql -u root -p

# ایجاد دیتابیس
CREATE DATABASE IF NOT EXISTS saded CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 4. راه‌اندازی جداول

```bash
npm run setup-mysql
```

یا:

```bash
node scripts/setup-mysql.js
```

### 5. تست اتصال

```bash
node scripts/test-db-connection.js
```

## 🚀 دسترسی به پروژه

پس از راه‌اندازی کامل، پروژه در آدرس زیر در دسترس است:

**http://localhost:3000**

## 📝 نکات مهم

1. **فایل .env:** حتماً باید ایجاد شود و رمز MySQL را در آن وارد کنید
2. **MySQL:** باید نصب و در حال اجرا باشد
3. **دیتابیس:** باید قبل از استفاده ایجاد شود

## 🐛 رفع مشکلات

### خطای "DB_PASSWORD is not set"
- فایل `.env` را ایجاد کنید
- `DB_PASSWORD` را در آن تنظیم کنید

### خطای "Connection refused"
- MySQL را راه‌اندازی کنید
- اطلاعات اتصال را در `.env` بررسی کنید

### خطای "Database does not exist"
- دیتابیس را ایجاد کنید: `CREATE DATABASE saded;`
- یا از `npm run setup-mysql` استفاده کنید

## ✅ بررسی نهایی

پس از راه‌اندازی، این endpoint ها را تست کنید:

- `http://localhost:3000/api/health/db` - بررسی اتصال
- `http://localhost:3000/api/products` - لیست محصولات
- `http://localhost:3000/api/categories` - لیست دسته‌بندی‌ها

**موفق باشید! 🎉**

