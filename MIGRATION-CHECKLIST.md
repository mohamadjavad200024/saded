# ✅ چک‌لیست تبدیل PostgreSQL به MySQL

این فایل چک‌لیست کامل تبدیل پروژه از PostgreSQL به MySQL است.

## 📋 تغییرات انجام شده

### ✅ فایل‌های دیتابیس
- [x] `lib/db/postgres.ts` → حذف شد
- [x] `lib/db/mysql.ts` → ایجاد شد
- [x] `lib/db/index.ts` → به‌روزرسانی شد

### ✅ Package.json
- [x] `pg` → حذف شد
- [x] `@types/pg` → حذف شد
- [x] `mysql2` → اضافه شد
- [x] `@types/mysql2` → اضافه شد
- [x] Scripts → به‌روزرسانی شدند

### ✅ فایل‌های API
- [x] `app/api/products/route.ts`
- [x] `app/api/products/[id]/route.ts`
- [x] `app/api/categories/route.ts`
- [x] `app/api/categories/[id]/route.ts`
- [x] `app/api/orders/route.ts`
- [x] `app/api/orders/create/route.ts`
- [x] `app/api/orders/[id]/route.ts`
- [x] `app/api/orders/[id]/status/route.ts`
- [x] `app/api/orders/[id]/payment-status/route.ts`
- [x] `app/api/users/route.ts`
- [x] `app/api/users/[id]/route.ts`
- [x] `app/api/cart/route.ts`
- [x] `app/api/chat/route.ts`
- [x] `app/api/chat/message/[id]/route.ts`
- [x] `app/api/chat/status/route.ts`
- [x] `app/api/chat/unread-count/route.ts`
- [x] `app/api/admin/presence/route.ts`
- [x] `app/api/health/db/route.ts`

### ✅ اسکریپت‌ها
- [x] `scripts/setup-mysql.js` → ایجاد شد
- [x] `scripts/setup-db-production.js` → به‌روزرسانی شد
- [x] `scripts/health-check.js` → به‌روزرسانی شد
- [x] `scripts/test-db-connection.js` → به‌روزرسانی شد
- [x] `scripts/update-env-password.js` → به‌روزرسانی شد
- [x] تمام اسکریپت‌های PostgreSQL → حذف شدند

### ✅ فایل‌های پیکربندی
- [x] `ecosystem.config.js` → پورت 3306
- [x] `env.production.template` → به‌روزرسانی شد
- [x] `package.json` → scripts به‌روزرسانی شدند

### ✅ مستندات
- [x] `README.md` → به‌روزرسانی شد
- [x] `README-MYSQL.md` → ایجاد شد
- [x] `QUICK-START-MYSQL.md` → ایجاد شد
- [x] `components/home/SYSTEM_DOCUMENTATION.md` → به‌روزرسانی شد

## 🔄 تغییرات SQL انجام شده

### Syntax Changes
- [x] `JSONB` → `JSON`
- [x] `$1, $2, ...` → `?`
- [x] `ON CONFLICT` → `ON DUPLICATE KEY UPDATE`
- [x] `NOW()` → `CURRENT_TIMESTAMP`
- [x] Double quotes → Backticks
- [x] حذف `::jsonb` casts
- [x] Error codes: PostgreSQL → MySQL
- [x] `IF NOT EXISTS` در ALTER TABLE → بررسی دستی

### Table Definitions
- [x] Products table → MySQL syntax
- [x] Categories table → MySQL syntax
- [x] Orders table → MySQL syntax
- [x] Users table → MySQL syntax
- [x] Carts table → MySQL syntax
- [x] Chat tables → MySQL syntax
- [x] Admin presence table → MySQL syntax

### Indexes
- [x] تمام indexes → MySQL syntax
- [x] حذف PostgreSQL-specific indexes (WHERE clauses)

## 🧪 تست‌های لازم

### قبل از استفاده
- [ ] نصب dependencies: `pnpm install`
- [ ] تنظیم فایل `.env`
- [ ] اجرای `pnpm setup-mysql`
- [ ] تست اتصال: `node scripts/test-db-connection.js`
- [ ] تست health check: `pnpm health-check`

### تست API
- [ ] `GET /api/health/db` - بررسی اتصال
- [ ] `GET /api/products` - لیست محصولات
- [ ] `GET /api/categories` - لیست دسته‌بندی‌ها
- [ ] `POST /api/products` - ایجاد محصول
- [ ] `POST /api/orders/create` - ایجاد سفارش
- [ ] `GET /api/chat` - چت

## 📝 نکات مهم

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=3306          # تغییر از 5432
DB_NAME=saded
DB_USER=root         # تغییر از postgres
DB_PASSWORD=your_password
```

### برای هاست cPanel
- پورت: `3306` (نه 5432)
- Host: معمولاً `localhost`
- Database name: `username_saded` (format cPanel)
- User: `username_dbuser` (format cPanel)

### Migration از PostgreSQL
اگر داده‌های موجود در PostgreSQL دارید:
1. Export داده‌ها از PostgreSQL
2. Convert format (JSONB → JSON)
3. Import به MySQL

## ✅ وضعیت نهایی

- ✅ تمام فایل‌های PostgreSQL حذف شدند
- ✅ تمام فایل‌های MySQL ایجاد شدند
- ✅ تمام کوئری‌ها تبدیل شدند
- ✅ تمام مستندات به‌روزرسانی شدند
- ✅ هیچ reference به PostgreSQL باقی نمانده

**پروژه آماده استفاده با MySQL است! 🎉**

