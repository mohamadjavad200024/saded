# راهنمای Deployment هوشمند

این راهنما نحوه استفاده از deployment scripts برای آپلود فقط فایل‌های تغییر یافته را توضیح می‌دهد.

## 📋 فهرست مطالب

1. [Deployment Scripts](#deployment-scripts)
2. [استفاده از Incremental Deployment](#استفاده-از-incremental-deployment)
3. [استفاده از Smart Deployment](#استفاده-از-smart-deployment)
4. [بهینه‌سازی‌های انجام شده](#بهینه‌سازی‌های-انجام-شده)

## 🚀 Deployment Scripts

### 1. Incremental Deployment (تحلیل تغییرات)

این script فایل‌های تغییر یافته را تحلیل می‌کند و لیست فایل‌های مربوط در `.next` را نمایش می‌دهد.

```bash
npm run deploy:analyze
```

**خروجی:**
- لیست فایل‌های source تغییر یافته
- لیست فایل‌های مربوط در `.next`
- دستورات rsync برای آپلود

### 2. Smart Deployment (آپلود خودکار)

این script به صورت خودکار فایل‌های تغییر یافته را آپلود می‌کند.

```bash
npm run deploy:smart
```

**قبل از استفاده:**
```bash
export DEPLOY_USER=shop1111
export DEPLOY_HOST=linux25.centraldnserver.com
export DEPLOY_DIR=~/public_html/saded
```

## 📦 استفاده از Incremental Deployment

### مرحله 1: Build پروژه

```bash
npm run build
```

### مرحله 2: تحلیل تغییرات

```bash
npm run deploy:analyze
```

این دستور:
- فایل‌های تغییر یافته از آخرین commit را پیدا می‌کند
- فایل‌های مربوط در `.next` را شناسایی می‌کند
- دستورات rsync را نمایش می‌دهد

### مرحله 3: آپلود فایل‌ها

از دستورات rsync نمایش داده شده استفاده کنید:

```bash
rsync -avz .next/server/app/api/ user@host:~/public_html/saded/.next/server/app/api/
```

یا از SFTP/FTP client استفاده کنید.

## 🔧 استفاده از Smart Deployment

### تنظیمات اولیه

```bash
# در ~/.bashrc یا ~/.zshrc اضافه کنید
export DEPLOY_USER=shop1111
export DEPLOY_HOST=linux25.centraldnserver.com
export DEPLOY_DIR=~/public_html/saded
```

### استفاده

```bash
# 1. Build پروژه
npm run build

# 2. Deploy
npm run deploy:smart
```

این script:
- آخرین commit را با remote مقایسه می‌کند
- فقط فایل‌های تغییر یافته را آپلود می‌کند
- فایل‌های مهم (BUILD_ID, manifests) را همیشه آپلود می‌کند

## ✅ بهینه‌سازی‌های انجام شده

### 1. Error Handling

- ✅ استفاده از `safeParseJSON`, `safeParseNumber`, `safeParseDate` برای parse کردن داده‌ها
- ✅ اضافه کردن logging برای تمام خطاها
- ✅ بهبود error messages

### 2. SQL Queries

- ✅ تبدیل تمام `$1, $2, ...` به `?` (MySQL syntax)
- ✅ تبدیل تمام `"columnName"` به `columnName`
- ✅ بهینه‌سازی N+1 queries (استفاده از IN clause)

### 3. Data Parsing

- ✅ ایجاد helper functions در `lib/parsers.ts`
- ✅ استفاده از `parseProduct` و `parseOrder` در تمام routes
- ✅ Safe JSON parsing با fallback values

### 4. Performance

- ✅ Connection pooling (20 connections)
- ✅ Caching برای products و categories
- ✅ Rate limiting برای API routes

### 5. Security

- ✅ استفاده از prepared statements (SQL injection prevention)
- ✅ Input validation
- ✅ Error messages بدون اطلاعات حساس در production

## 📝 نکات مهم

1. **همیشه قبل از deploy، build کنید:**
   ```bash
   npm run build
   ```

2. **فایل‌های مهم همیشه آپلود می‌شوند:**
   - `.next/BUILD_ID`
   - `.next/package.json`
   - `.next/routes-manifest.json`
   - `.next/build-manifest.json`

3. **بعد از آپلود، PM2 را restart کنید:**
   ```bash
   pm2 restart saded
   ```

4. **برای آپلود کامل (اگر مشکلی پیش آمد):**
   ```bash
   rsync -avz --exclude='.next/cache' .next/ user@host:~/public_html/saded/.next/
   ```

## 🔍 Troubleshooting

### مشکل: Script فایل‌های تغییر یافته را پیدا نمی‌کند

**راه حل:**
```bash
# بررسی کنید که Git درست کار می‌کند
git status
git log --oneline -5

# یا از --force استفاده کنید
npm run deploy:smart -- --force
```

### مشکل: فایل‌ها آپلود می‌شوند اما تغییرات اعمال نمی‌شوند

**راه حل:**
```bash
# PM2 را restart کنید
pm2 restart saded

# یا کل .next را دوباره آپلود کنید
rsync -avz --exclude='.next/cache' .next/ user@host:~/public_html/saded/.next/
```

## 📚 منابع بیشتر

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [rsync Documentation](https://linux.die.net/man/1/rsync)

