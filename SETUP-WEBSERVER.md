# 🌐 راهنمای تنظیم وب سرور برای Next.js

## ⚠️ مشکل: صفحه Index of / نمایش داده می‌شود

این یعنی وب سرور (LiteSpeed) به Next.js متصل نیست.

---

## 🔧 راه‌حل‌ها

### راه‌حل 1: استفاده از cPanel Node.js App Manager (توصیه می‌شود)

1. از **cPanel → Node.js App Manager** بروید
2. **Create Application** را کلیک کنید
3. تنظیمات:
   - **Node.js Version:** 20.x
   - **Application Mode:** Production
   - **Application Root:** `/home/shop1111/public_html/saded`
   - **Application URL:** `/` یا `/saded`
   - **Application Startup File:** `server.js`
   - **Application Port:** `3001`
4. روی **Create** کلیک کنید
5. سپس **Run NPM Install** و **Start App** را کلیک کنید

---

### راه‌حل 2: استفاده از .htaccess (برای subdirectory)

اگر پروژه در `/saded` است:

1. فایل `.htaccess` را در `public_html` ایجاد کنید:

```apache
RewriteEngine On
RewriteBase /saded/

# Proxy to Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

2. یا اگر در root است:

```apache
RewriteEngine On

# Proxy to Next.js
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3001/$1 [P,L]
```

---

### راه‌حل 3: تغییر پورت به 80 یا استفاده از subdomain

اگر می‌خواهید مستقیماً از پورت 80 استفاده کنید:

1. در `ecosystem.config.js` پورت را به 80 تغییر دهید (نیاز به root دارد)
2. یا از subdomain استفاده کنید

---

## ✅ بررسی

### 1. بررسی وضعیت PM2:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
```

### 2. بررسی لاگ‌ها:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded
```

### 3. تست اتصال محلی:
```bash
curl http://localhost:3001
```

اگر این کار کرد، Next.js در حال اجرا است و مشکل از reverse proxy است.

---

## 💡 توصیه

**بهترین راه: استفاده از cPanel Node.js App Manager**

این روش:
- ✅ به صورت خودکار reverse proxy را تنظیم می‌کند
- ✅ مدیریت آسان‌تر
- ✅ راه‌اندازی خودکار پس از restart

---

## 📝 مراحل با Node.js App Manager

1. **cPanel → Node.js App Manager**
2. **Create Application**
3. تنظیمات:
   - Application Root: `/home/shop1111/public_html/saded`
   - Application URL: `/` (یا `/saded` اگر در subdirectory است)
   - Application Startup File: `server.js`
   - Application Port: `3001`
4. **Create**
5. **Run NPM Install** (اگر نیاز باشد)
6. **Start App**

---

**موفق باشید! 🚀**

