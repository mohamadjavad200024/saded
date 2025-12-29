# راهنمای کامل رفع مشکل Horizontal Overflow

## مشکل
سایت به سمت راست متمایل شده و محتوا از viewport خارج می‌شود، به خصوص در بخش admin.

## تغییرات اعمال شده

### 1. `app/globals.css`
- اضافه شدن `box-sizing: border-box` به همه elementها
- اضافه شدن `max-width: 100%` به همه elementها

### 2. `app/layout.tsx`
- اضافه شدن `overflow-x-hidden` به `<html>` و `<body>`

### 3. `app/admin/admin.css`
- CSS قوی با `!important` برای جلوگیری از overflow
- قوانین برای همه componentهای admin

### 4. `app/admin/layout.tsx`
- تغییر `w-screen` به `w-full`
- اضافه شدن `max-w-full` و `overflow-x-hidden`

---

## مراحل اجرا

### مرحله 1: آپلود فایل‌های تغییر یافته

فایل‌های زیر را آپلود کنید:
- `app/globals.css`
- `app/layout.tsx`
- `app/admin/admin.css`
- `app/admin/layout.tsx`

### مرحله 2: Rebuild پروژه (مهم!)

**⚠️ مهم:** بعد از تغییر CSS و layout، حتماً باید rebuild کنید:

```bash
# برگشت به مسیر پروژه
cd /home/shop1111/Brun

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# پاک کردن build قبلی
rm -rf .next

# Build دوباره
npm run build:linux
```

**نکته:** اگر `npm run build:linux` خطا داد، از این دستور استفاده کنید:
```bash
NEXT_PRIVATE_SKIP_TURBO=1 npx next build --webpack
```

### مرحله 3: Restart PM2

```bash
# Restart PM2
pm2 restart saded

# بررسی وضعیت
pm2 status

# بررسی لاگ‌ها
pm2 logs saded --lines 20
```

### مرحله 4: پاک کردن Cache مرورگر

**⚠️ بسیار مهم:** بعد از rebuild، حتماً cache مرورگر را پاک کنید:

1. **Chrome/Edge:**
   - `Ctrl + Shift + Delete` (Windows) یا `Cmd + Shift + Delete` (Mac)
   - انتخاب "Cached images and files"
   - انتخاب "All time"
   - کلیک روی "Clear data"

2. **Firefox:**
   - `Ctrl + Shift + Delete` (Windows) یا `Cmd + Shift + Delete` (Mac)
   - انتخاب "Cache"
   - انتخاب "Everything"
   - کلیک روی "Clear Now"

3. **یا استفاده از Hard Refresh:**
   - `Ctrl + F5` (Windows) یا `Cmd + Shift + R` (Mac)

### مرحله 5: تست سایت

1. باز کردن سایت: `http://77191336.shop`
2. رفتن به بخش admin: `http://77191336.shop/admin`
3. بررسی:
   - ✅ محتوا در viewport قرار دارد
   - ✅ scrollbar افقی وجود ندارد
   - ✅ محتوا به سمت راست متمایل نیست

---

## اگر مشکل باقی ماند

### بررسی 1: آیا فایل‌ها آپلود شده‌اند؟

```bash
# بررسی وجود فایل admin.css
ls -la /home/shop1111/Brun/app/admin/admin.css

# بررسی محتویات فایل
head -20 /home/shop1111/Brun/app/admin/admin.css
```

### بررسی 2: آیا rebuild انجام شده است؟

```bash
# بررسی وجود BUILD_ID
ls -la /home/shop1111/Brun/.next/BUILD_ID

# بررسی تاریخ build
ls -la /home/shop1111/Brun/.next/
```

### بررسی 3: بررسی Console مرورگر

1. باز کردن Developer Tools: `F12`
2. رفتن به تب "Console"
3. بررسی خطاهای CSS یا JavaScript

### بررسی 4: بررسی Network Tab

1. باز کردن Developer Tools: `F12`
2. رفتن به تب "Network"
3. بررسی اینکه فایل‌های CSS لود شده‌اند:
   - `globals.css`
   - `admin.css`

### بررسی 5: استفاده از Inspect Element

1. کلیک راست روی صفحه → "Inspect"
2. انتخاب element که overflow دارد
3. بررسی computed styles:
   - `width`
   - `max-width`
   - `overflow-x`

---

## راه‌حل‌های اضافی

### اگر مشکل از یک component خاص است:

1. پیدا کردن component مشکل‌دار با Inspect Element
2. اضافه کردن class `overflow-x-hidden` به آن component
3. یا اضافه کردن inline style: `style={{ maxWidth: '100%', overflowX: 'hidden' }}`

### اگر مشکل از table است:

جدول‌ها ممکن است نیاز به horizontal scroll داشته باشند. در این صورت:
- container جدول باید `overflow-x: auto` داشته باشد
- خود جدول می‌تواند `width: max-content` داشته باشد

---

## خلاصه دستورات

```bash
# 1. رفتن به مسیر پروژه
cd /home/shop1111/Brun

# 2. فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# 3. پاک کردن build قبلی
rm -rf .next

# 4. Build دوباره
npm run build:linux

# 5. Restart PM2
pm2 restart saded

# 6. بررسی وضعیت
pm2 status
pm2 logs saded --lines 20
```

---

## نکات مهم

1. **همیشه بعد از تغییر CSS/Layout باید rebuild کنید**
2. **همیشه cache مرورگر را پاک کنید**
3. **اگر مشکل باقی ماند، بررسی کنید که فایل‌ها آپلود شده‌اند**
4. **از Developer Tools برای debug استفاده کنید**

---

## اگر هنوز مشکل دارید

لطفاً این اطلاعات را ارسال کنید:
1. Screenshot از مشکل
2. Console errors (از Developer Tools)
3. خروجی `pm2 logs saded --lines 50`
4. خروجی `ls -la /home/shop1111/Brun/app/admin/admin.css`

