# حل مشکل خطای 503 - Out of Memory در Build

## مشکل:
- بیلد در هاست به دلیل کمبود حافظه (Out of memory) شکست می‌خورد
- PM2 نمی‌تواند پروژه را اجرا کند چون بیلد وجود ندارد
- این باعث خطای 503 می‌شود

## راه حل 1: بیلد محلی و آپلود (توصیه می‌شود)

### مرحله 1: بیلد در محیط محلی
```bash
# در محیط محلی (ویندوز/مک)
npm run build
```

### مرحله 2: آپلود فایل‌های بیلد شده
فایل‌های زیر را از `.next` محلی به هاست آپلود کنید:
- `.next/BUILD_ID`
- `.next/static/` (کل پوشه)
- `.next/server/` (کل پوشه)

### مرحله 3: در هاست
```bash
cd ~/public_html/saded

# دریافت تغییرات کد
git pull origin main

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

## راه حل 2: کاهش مصرف حافظه در بیلد

### تنظیمات Node.js برای حافظه کمتر:
```bash
cd ~/public_html/saded

# تنظیم حافظه کمتر برای Node.js
export NODE_OPTIONS="--max-old-space-size=512"

# بیلد با حافظه محدود
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm run build

# اگر باز هم خطا داد، حافظه را بیشتر کاهش دهید
export NODE_OPTIONS="--max-old-space-size=256"
npm run build
```

## راه حل 3: بیلد بدون Turbopack (آهسته‌تر اما کم‌حافظه‌تر)

```bash
cd ~/public_html/saded

# غیرفعال کردن Turbopack
export NEXT_PRIVATE_SKIP_TURBO=1

# بیلد
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm run build
```

## راه حل 4: تمیز کردن و بیلد مجدد

```bash
cd ~/public_html/saded

# حذف پوشه .next و node_modules/.cache
rm -rf .next
rm -rf node_modules/.cache

# نصب مجدد وابستگی‌ها
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm install

# بیلد با تنظیمات بهینه
export NODE_OPTIONS="--max-old-space-size=512"
npm run build

# Restart PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

## بررسی وضعیت:

```bash
# بررسی وضعیت PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50
```

## نکات مهم:

1. **بهترین راه**: بیلد در محیط محلی و آپلود فایل‌های `.next`
2. اگر بیلد در هاست ضروری است، از `NODE_OPTIONS` برای محدود کردن حافظه استفاده کنید
3. همیشه بعد از بیلد موفق، PM2 را restart کنید
4. اگر مشکل ادامه داشت، با پشتیبانی هاست تماس بگیرید تا محدودیت حافظه را افزایش دهند

