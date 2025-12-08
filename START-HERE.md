# 🚀 شروع سریع - پروژه آماده است!

## ✅ وضعیت پروژه

**پروژه با موفقیت از PostgreSQL به MySQL تبدیل شد!**

همه چیز آماده استفاده است.

## 📋 مراحل سریع شروع

### 1️⃣ نصب Dependencies

```bash
pnpm install
```

### 2️⃣ تنظیم فایل .env

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
```

### 3️⃣ راه‌اندازی دیتابیس

```bash
pnpm setup-mysql
```

### 4️⃣ تست اتصال

```bash
node scripts/test-db-connection.js
```

### 5️⃣ اجرای پروژه

```bash
pnpm dev
```

پروژه در `http://localhost:3000` در دسترس خواهد بود.

## 📚 مستندات

- **[راهنمای سریع](./QUICK-START-MYSQL.md)** - شروع سریع
- **[راهنمای کامل MySQL](./README-MYSQL.md)** - راهنمای تفصیلی
- **[چک‌لیست تبدیل](./MIGRATION-CHECKLIST.md)** - بررسی تغییرات
- **[خلاصه تبدیل](./MIGRATION-SUMMARY.md)** - آمار و خلاصه

## 🎯 برای هاست cPanel

اگر از هاست cPanel استفاده می‌کنید:

1. از **cPanel → MySQL Databases** یک دیتابیس ایجاد کنید
2. اطلاعات را در `.env.production` وارد کنید:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=username_saded
DB_USER=username_dbuser
DB_PASSWORD=your_password
```

3. سپس:
```bash
node scripts/setup-db-production.js
```

## ✅ بررسی نهایی

پس از راه‌اندازی، این endpoint ها را تست کنید:

- ✅ `http://localhost:3000/api/health/db` - بررسی اتصال
- ✅ `http://localhost:3000/api/products` - لیست محصولات
- ✅ `http://localhost:3000/api/categories` - لیست دسته‌بندی‌ها

## 🎉 همه چیز آماده است!

پروژه شما حالا از MySQL استفاده می‌کند و آماده استفاده است.

**موفق باشید! 🚀**

