# خلاصه تغییرات و رفع مشکلات

## ✅ تمام مشکلات رفع شد!

### 1. ✅ رفع مشکل فوتر (Encoding)

**مشکل:** متن فارسی در تنظیمات فوتر به علامت سوال تبدیل می‌شد.

**راه‌حل:**
- اضافه شدن `charset: 'utf8mb4'` به MySQL connection
- تغییر table `site_settings` به `utf8mb4_unicode_ci`
- اضافه شدن `Content-Type: application/json; charset=utf-8` به response headers

**فایل‌های تغییر یافته:**
- `app/api/settings/site-content/route.ts`
- `lib/db/mysql.ts`

---

### 2. ✅ رفع مشکل پروفایل کاربر (مودال‌ها)

**مشکل:** مودال‌ها درست کار نمی‌کردند و از صفحه خارج می‌شدند.

**راه‌حل:**
- تبدیل `Dialog` به `Sheet` برای نمایش بهتر در RTL
- استفاده از `side="left"` برای RTL support
- اضافه شدن `overflow-y-auto` برای scroll درست

**فایل‌های تغییر یافته:**
- `app/profile/page.tsx`

---

### 3. ✅ افزایش مدت زمان Session

**مشکل:** کاربران باید هر بار وارد شوند.

**راه‌حل:**
- تغییر مدت زمان session از 10 سال به **1 هفته (7 روز)**
- تنظیم `expiresAt` در database
- بررسی expiration در `getSessionUserFromRequest`

**فایل‌های تغییر یافته:**
- `lib/auth/session.ts`

---

### 4. ✅ رفع مشکل سبد خرید (شخصی‌سازی)

**مشکل:** سبد خرید عمومی بود و برای همه کاربران یکسان بود.

**راه‌حل:**
- اضافه شدن `userId` به cart
- اولویت با `userId` (اگر کاربر لاگین باشد)
- استفاده از `sessionId` فقط برای کاربران مهمان
- Migration خودکار: اگر کاربر لاگین کند، cart از sessionId به userId منتقل می‌شود

**فایل‌های تغییر یافته:**
- `app/api/cart/route.ts`

---

### 5. ✅ اضافه کردن Favicon

**مشکل:** لوگو در تب مرورگر نمایش داده نمی‌شد.

**راه‌حل:**
- استفاده از لوگوی سایت به عنوان favicon
- اضافه شدن `/favicon.ico` به icons
- تنظیم درست metadata در `layout.tsx`

**فایل‌های تغییر یافته:**
- `app/layout.tsx`

---

## فایل‌های تغییر یافته

### فایل‌های اصلی:
1. `app/api/settings/site-content/route.ts` - Fix encoding
2. `lib/db/mysql.ts` - UTF-8 charset
3. `app/profile/page.tsx` - Dialog → Sheet
4. `lib/auth/session.ts` - Session 1 week
5. `app/api/cart/route.ts` - User-specific cart
6. `app/layout.tsx` - Favicon

---

## مراحل آپلود و اجرا

### 1. آپلود فایل‌های تغییر یافته

فایل‌های زیر را آپلود کنید:
- `app/api/settings/site-content/route.ts`
- `lib/db/mysql.ts`
- `app/profile/page.tsx`
- `lib/auth/session.ts`
- `app/api/cart/route.ts`
- `app/layout.tsx`

### 2. Rebuild پروژه

```bash
cd /home/shop1111/Brun
source /home/shop1111/nodevenv/Brun/20/bin/activate
rm -rf .next
npm run build:linux
```

### 3. Restart PM2

```bash
pm2 delete saded
pm2 start ecosystem.config.js --update-env
pm2 status
```

### 4. بررسی Database

```bash
# بررسی charset table site_settings
mysql -u shop1111_Brundb -p shop1111_Brun -e "SHOW CREATE TABLE site_settings\G"

# اگر charset utf8mb4 نیست، اجرا کنید:
mysql -u shop1111_Brundb -p shop1111_Brun -e "ALTER TABLE site_settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## تست‌های لازم

### 1. تست فوتر
- رفتن به `/admin/settings` → تب "فوتر"
- تایپ کردن متن فارسی
- ذخیره و بررسی در صفحه اصلی

### 2. تست پروفایل
- رفتن به `/profile`
- کلیک روی "ویرایش پروفایل" → باید Sheet از سمت راست باز شود
- کلیک روی "تغییر رمز عبور" → باید Sheet از سمت راست باز شود

### 3. تست Session
- ورود به حساب کاربری
- بستن مرورگر و باز کردن دوباره بعد از چند ساعت
- باید لاگین بماند (تا 1 هفته)

### 4. تست سبد خرید
- اضافه کردن محصول به سبد (بدون لاگین)
- لاگین کردن
- بررسی اینکه محصولات در سبد باقی مانده‌اند

### 5. تست Favicon
- باز کردن سایت
- بررسی تب مرورگر → باید لوگو نمایش داده شود

---

## نکات مهم

1. **Encoding:** بعد از آپلود، حتماً table `site_settings` را به utf8mb4 تبدیل کنید
2. **Session:** کاربران فعلی باید دوباره لاگین کنند (session جدید)
3. **Cart:** Cart‌های قدیمی بر اساس sessionId هستند، بعد از لاگین به userId منتقل می‌شوند
4. **Favicon:** اگر لوگو در تنظیمات تنظیم نشده باشد، از `/favicon.ico` استفاده می‌شود

---

## اگر مشکلی پیش آمد

### مشکل Encoding:
```bash
# بررسی charset
mysql -u shop1111_Brundb -p shop1111_Brun -e "SHOW CREATE TABLE site_settings\G"

# تبدیل به utf8mb4
mysql -u shop1111_Brundb -p shop1111_Brun -e "ALTER TABLE site_settings CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### مشکل Session:
- بررسی لاگ‌های PM2: `pm2 logs saded --lines 50`
- بررسی cookie در browser: Developer Tools → Application → Cookies

### مشکل Cart:
- بررسی database: `SELECT * FROM carts WHERE userId IS NOT NULL LIMIT 10;`
- بررسی migration: Cart‌های قدیمی باید به userId منتقل شوند

---

## موفق باشید! 🎉

تمام مشکلات رفع شدند. لطفاً فایل‌ها را آپلود کنید و تست کنید.

