# راهنمای رفع مشکل Horizontal Overflow (تمایل به راست)

## مشکل

سایت در مرورگر به سمت راست متمایل شده و محتوا از viewport خارج می‌شود. این مشکل در بخش admin بیشتر مشهود است.

---

## علت مشکل

### 1. استفاده از `w-screen` به جای `w-full`
- `w-screen` برابر با `100vw` است که شامل scrollbar نمی‌شود
- در RTL (راست به چپ)، این می‌تواند باعث overflow شود
- `w-full` برابر با `100%` است که شامل scrollbar می‌شود

### 2. عدم تنظیم `overflow-x: hidden`
- در برخی container ها، `overflow-x` تنظیم نشده بود
- محتوا می‌توانست از container خارج شود

### 3. عدم تنظیم `max-width: 100%`
- برخی element ها `max-width` نداشتند
- این باعث می‌شد که width بیش از viewport شود

### 4. مشکلات RTL
- در RTL، محتوا باید به درستی align شود
- برخی element ها ممکن است به سمت راست overflow کنند

---

## تغییرات اعمال شده

### 1. تغییر `w-screen` به `w-full` در Admin Layout

**قبل:**
```tsx
<div className="h-screen w-screen flex overflow-hidden">
```

**بعد:**
```tsx
<div className="h-screen w-full max-w-full flex overflow-hidden">
```

### 2. بهبود `globals.css`

**اضافه شده:**
```css
* {
  max-width: 100%;
  box-sizing: border-box;
}

[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

### 3. ایجاد فایل `admin.css`

فایل جدید برای رفع مشکلات overflow در admin panel.

### 4. بهبود `useEffect` در Admin Layout

اضافه شدن تنظیمات `overflow-x: hidden` و `max-width: 100%` به body و html.

---

## فایل‌های تغییر یافته

1. `app/admin/layout.tsx` - تغییر `w-screen` به `w-full` و بهبود overflow
2. `app/globals.css` - اضافه شدن قوانین کلی برای جلوگیری از overflow
3. `app/admin/admin.css` - فایل جدید برای admin-specific styles

---

## تست و بررسی

### 1. آپلود فایل‌های تغییر یافته

فایل‌های زیر را آپلود کنید:
- `app/admin/layout.tsx`
- `app/globals.css`
- `app/admin/admin.css`

### 2. Restart PM2

```bash
# برگشت به مسیر پروژه
cd /home/shop1111/Brun

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# Restart PM2
pm2 restart saded

# بررسی وضعیت
pm2 status
```

### 3. تست سایت

1. سایت را در مرورگر باز کنید: `http://77191336.shop`
2. به بخش admin بروید: `http://77191336.shop/admin`
3. بررسی کنید که:
   - محتوا در viewport قرار دارد
   - scrollbar افقی وجود ندارد
   - محتوا به سمت راست متمایل نیست

### 4. تست در مرورگرهای مختلف

- Chrome
- Firefox
- Edge
- Safari (اگر در دسترس است)

---

## اگر هنوز مشکل وجود دارد

### بررسی در Developer Tools

1. باز کردن Developer Tools (F12)
2. بررسی Console برای خطاها
3. بررسی Elements برای element هایی با width بیش از حد

### بررسی CSS

```bash
# بررسی فایل‌های CSS
cat app/globals.css | grep -E "(overflow|max-width|w-screen)"
cat app/admin/admin.css
```

### بررسی در مرورگر

1. Right-click روی صفحه → Inspect
2. بررسی Computed styles برای `width` و `max-width`
3. بررسی element هایی که width بیش از viewport دارند

---

## نکات مهم

1. **همیشه از `w-full` استفاده کنید** به جای `w-screen` در container ها
2. **`max-width: 100%` را تنظیم کنید** برای همه element ها
3. **`overflow-x: hidden` را تنظیم کنید** برای container های اصلی
4. **در RTL، مطمئن شوید** که direction درست تنظیم شده است

---

## دستورات کامل (کپی-پیست)

```bash
# برگشت به مسیر پروژه
cd /home/shop1111/Brun

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# Restart PM2
pm2 restart saded

# بررسی وضعیت
pm2 status

# بررسی لاگ‌ها
pm2 logs saded --lines 20
```

---

**موفق باشید!** 🚀

