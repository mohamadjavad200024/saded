# پروژه آماده استقرار در cPanel ✅

پروژه شما برای استقرار در cPanel آماده شده است.

---

## 📁 فایل‌های ایجاد/اصلاح شده

### فایل‌های جدید:
- ✅ `CPANEL_SETUP.md` - راهنمای کامل step-by-step
- ✅ `QUICK_START.md` - راهنمای سریع
- ✅ `.cpanelignore` - فایل‌های غیرضروری برای آپلود

### فایل‌های اصلاح شده:
- ✅ `package.json` - build script برای cPanel بهینه شده
- ✅ `next.config.js` - مسیرهای hardcode شده حذف شد
- ✅ `server.js` - پشتیبانی از `.env.production` و `APP_PORT`
- ✅ `scripts/check-deployment.js` - اصلاح بررسی فایل‌ها
- ✅ `env.production.template` - به‌روزرسانی برای MySQL و cPanel

---

## 🚀 مراحل بعدی (شما باید انجام دهید)

### مرحله 1: Build در سیستم محلی
```bash
npm run build
```

### مرحله 2: آپلود فایل‌ها به هاست
فایل‌های زیر را آپلود کنید:
- ✅ پوشه `.next/` (خیلی مهم!)
- ✅ تمام فایل‌های دیگر (به جز مواردی که در `.cpanelignore` هستند)

### مرحله 3: نصب Dependencies در هاست
```bash
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate
cd /home/shop1111/repositories/saded
npm install
```

### مرحله 4: تنظیم cPanel Node.js App Manager

**Application Root:** `/home/shop1111/repositories/saded`
**Startup File:** `server.js`
**Mode:** `Production`

**Environment Variables:**
```
NODE_ENV=production
HOSTNAME=0.0.0.0
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shop1111_Brun
DB_USER=shop1111_Brundb
DB_PASSWORD=goul77191336
DB_SSL=false
NEXT_PUBLIC_URL=http://77191336.shop
```

### مرحله 5: Start Application
در Node.js App Manager:
1. روی **Run NPM Install** کلیک کنید
2. روی **Start App** کلیک کنید

---

## 📚 مستندات

- **راهنمای کامل:** `CPANEL_SETUP.md`
- **راهنمای سریع:** `QUICK_START.md`
- **راهنمای قبلی:** `DEPLOYMENT.md`

---

## ⚠️ نکات مهم

1. **همیشه در سیستم محلی build کنید** - build در هاست ممکن است مشکل داشته باشد
2. **پوشه `.next` را کامل آپلود کنید** - این پوشه بسیار مهم است
3. **متغیرهای محیطی را در cPanel تنظیم کنید** - نه در فایل `.env`
4. **Application Root را درست تنظیم کنید** - باید دقیقاً مسیر پروژه باشد

---

## 🆘 اگر مشکل دارید

1. فایل `CPANEL_SETUP.md` را بخوانید
2. بخش عیب‌یابی را بررسی کنید
3. با پشتیبانی هاست تماس بگیرید

---

**موفق باشید!** 🎉

