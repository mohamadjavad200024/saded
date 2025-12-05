# 🚀 راهنمای گام‌به‌گام استقرار - الان چکار کنم؟

## ✅ مرحله 1: آماده‌سازی فایل `.env.production`

1. فایل `env.production.template` را باز کنید
2. یک فایل جدید به نام `.env.production` ایجاد کنید
3. مقادیر را با اطلاعات هاست خود پر کنید:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saded
DB_USER=shop1111_saded  # نام کاربری cPanel + نام دیتابیس
DB_PASSWORD=your-password-here

# Application
NODE_ENV=production
NEXT_PUBLIC_URL=https://yourdomain.com

# Zarinpal Payment Gateway
ZARINPAL_MERCHANT_ID=your-merchant-id

# NextAuth
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-random-string-here
JWT_SECRET=generate-random-string-here
```

**💡 نکته:** برای تولید `NEXTAUTH_SECRET` و `JWT_SECRET` می‌توانید از این دستور استفاده کنید:
```bash
openssl rand -base64 32
```

---

## ✅ مرحله 2: ایجاد دیتابیس PostgreSQL در cPanel

1. به cPanel وارد شوید
2. به بخش **"Databases"** → **"PostgreSQL Databases"** بروید
3. دیتابیس جدیدی با نام `saded` ایجاد کنید
4. کاربر دیتابیس ایجاد کنید و رمز عبور تنظیم کنید
5. کاربر را به دیتابیس اضافه کنید و تمام دسترسی‌ها (ALL PRIVILEGES) را بدهید
6. اطلاعات اتصال را یادداشت کنید:
   - نام دیتابیس: `shop1111_saded`
   - نام کاربری: `shop1111_saded_user`
   - رمز عبور: (آنچه تنظیم کردید)
   - Host: `localhost`

---

## ✅ مرحله 3: آپلود فایل‌ها به هاست

### روش A: استفاده از Git (توصیه می‌شود) ⭐

اگر قبلاً پروژه را به GitHub push کرده‌اید:

1. در cPanel Terminal:
```bash
cd ~/repositories/saded
git pull origin main
```

### روش B: آپلود دستی

از File Manager در cPanel، این فایل‌ها را آپلود کنید:

**📦 فایل‌های ضروری:**
- ✅ `.next/` (کل پوشه - فایل‌های build شده)
- ✅ `public/` (کل پوشه)
- ✅ `package.json`
- ✅ `package-lock.json` (اگر وجود دارد)
- ✅ `next.config.ts`
- ✅ `tsconfig.json`
- ✅ `.env.production` (بعد از آپلود، نام آن را به `.env` تغییر دهید)
- ✅ `scripts/` (کل پوشه - برای setup دیتابیس)
- ✅ `lib/` (کل پوشه)
- ✅ `types/` (کل پوشه)
- ✅ `store/` (کل پوشه)
- ✅ `app/` (کل پوشه)
- ✅ `components/` (کل پوشه)
- ✅ `hooks/` (کل پوشه)

**❌ آپلود نکنید:**
- `node_modules/` (در هاست نصب می‌شود)
- `.git/`
- `.next/cache/` (اختیاری)

---

## ✅ مرحله 4: تنظیم Node.js App در cPanel

1. به cPanel بروید
2. به بخش **"Software"** → **"Setup Node.js App"** بروید
3. اگر قبلاً App ایجاد نکرده‌اید:
   - روی **"Create Application"** کلیک کنید
   - Node.js version: **20.x** (یا آخرین نسخه)
   - Application mode: **Production**
   - Application root: `repositories/saded`
   - Application URL: دامنه خود را انتخاب کنید
   - Application startup file: `server.js` یا `package.json` (بسته به تنظیمات هاست)
4. در بخش **"Environment Variables"**، متغیرهای زیر را اضافه کنید:

```
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saded
DB_USER=shop1111_saded_user
DB_PASSWORD=your-password
NEXT_PUBLIC_URL=https://yourdomain.com
ZARINPAL_MERCHANT_ID=your-merchant-id
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret
JWT_SECRET=your-jwt-secret
```

5. روی **"Save"** کلیک کنید

---

## ✅ مرحله 5: نصب وابستگی‌ها در Terminal

در cPanel Terminal:

```bash
# رفتن به پوشه پروژه
cd ~/repositories/saded

# نصب وابستگی‌ها (با استفاده از npm در virtual environment)
/home/shop1111/nodevenv/repositories/saded/20/bin/npm install --legacy-peer-deps --production
```

**⚠️ توجه:** اگر خطا داد، بدون `--production` امتحان کنید:
```bash
/home/shop1111/nodevenv/repositories/saded/20/bin/npm install --legacy-peer-deps
```

---

## ✅ مرحله 6: راه‌اندازی دیتابیس

در Terminal:

```bash
cd ~/repositories/saded

# اجرای اسکریپت setup دیتابیس
node scripts/setup-db-production.js
```

این اسکریپت:
- دیتابیس `saded` را ایجاد می‌کند (اگر وجود نداشته باشد)
- جداول مورد نیاز را ایجاد می‌کند

---

## ✅ مرحله 7: Restart کردن Node.js App

1. به **"Setup Node.js App"** در cPanel بروید
2. روی App خود کلیک کنید
3. روی دکمه **"Restart"** کلیک کنید

یا در Terminal:
```bash
# اگر از PM2 استفاده می‌کنید
pm2 restart saded

# یا از طریق cPanel Node.js App manager
```

---

## ✅ مرحله 8: تست کردن سایت

1. به آدرس دامنه خود بروید
2. بررسی کنید که:
   - ✅ سایت لود می‌شود
   - ✅ صفحه اصلی نمایش داده می‌شود
   - ✅ اتصال به دیتابیس کار می‌کند
   - ✅ لاگ‌ها خطایی نشان نمی‌دهند

---

## 🔍 عیب‌یابی

### اگر سایت کار نمی‌کند:

1. **بررسی لاگ‌ها:**
   - در cPanel → Setup Node.js App → Logs
   - یا در Terminal: `tail -f ~/logs/saded.log`

2. **بررسی اتصال دیتابیس:**
   ```bash
   node scripts/health-check.js
   ```

3. **بررسی متغیرهای محیطی:**
   ```bash
   node scripts/check-deployment.js
   ```

4. **بررسی پورت:**
   - در Setup Node.js App، پورت اختصاص داده شده را بررسی کنید

---

## 📝 چک‌لیست نهایی

قبل از اتمام، این موارد را بررسی کنید:

- [ ] فایل `.env` (یا `.env.production`) با اطلاعات درست تنظیم شده
- [ ] دیتابیس PostgreSQL ایجاد شده
- [ ] جداول دیتابیس ایجاد شده‌اند
- [ ] فایل‌های پروژه آپلود شده‌اند
- [ ] وابستگی‌ها نصب شده‌اند
- [ ] Node.js App راه‌اندازی شده
- [ ] سایت در دسترس است
- [ ] اتصال به دیتابیس کار می‌کند

---

## 🎉 تبریک!

اگر همه چیز کار کرد، پروژه شما با موفقیت استقرار یافته است! 🚀

برای به‌روزرسانی‌های بعدی:
1. تغییرات را در GitHub push کنید
2. در Terminal: `git pull origin main`
3. در Terminal: `npm install --legacy-peer-deps`
4. در Terminal: `npm run build`
5. Node.js App را restart کنید

