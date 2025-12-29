# راهنمای رفع مشکل Build و Turbopack

## مشکل
1. `BUILD_ID exists: false` - Build ناقص است
2. خطای Turbopack: `Symlink node_modules is invalid` - Turbopack هنوز فعال است
3. Application در dev mode اجرا می‌شود به جای production mode

## راه‌حل

### مرحله 1: بررسی Build

```bash
# بررسی وجود BUILD_ID
ls -la /home/shop1111/Brun/.next/BUILD_ID

# اگر BUILD_ID وجود ندارد، build ناقص است
```

### مرحله 2: پاک کردن Build قبلی

```bash
# پاک کردن کامل .next
rm -rf /home/shop1111/Brun/.next
```

### مرحله 3: Build دوباره با محدودیت منابع

```bash
# رفتن به مسیر پروژه
cd /home/shop1111/Brun

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# Build با محدودیت RAM (برای جلوگیری از خطای EAGAIN)
NODE_OPTIONS="--max-old-space-size=2048" npm run build:linux
```

### مرحله 4: بررسی Build

```bash
# بررسی وجود BUILD_ID
ls -la /home/shop1111/Brun/.next/BUILD_ID

# بررسی محتویات .next
ls -la /home/shop1111/Brun/.next/ | head -20
```

### مرحله 5: Restart PM2

```bash
# Stop PM2
pm2 stop saded

# Delete PM2 process
pm2 delete saded

# Start دوباره
pm2 start ecosystem.config.js --update-env

# بررسی وضعیت
pm2 status

# بررسی لاگ‌ها
pm2 logs saded --lines 20
```

---

## اگر Build در هاست مشکل دارد

### گزینه 1: Build محلی و آپلود

```bash
# در سیستم محلی (Windows)
npm run build

# سپس آپلود .next folder به هاست
# مسیر: /home/shop1111/Brun/.next
```

### گزینه 2: Build با تعداد worker کمتر

```bash
# Build با محدودیت بیشتر
NODE_OPTIONS="--max-old-space-size=1536" npm run build:linux
```

---

## بررسی Turbopack

### مطمئن شوید که Turbopack کاملاً غیرفعال است:

```bash
# بررسی environment variables
echo $NEXT_PRIVATE_SKIP_TURBO
echo $NEXT_PRIVATE_WEBPACK
echo $TURBOPACK

# باید خروجی این باشد:
# 1
# 1
# 0
```

---

## دستورات کامل

```bash
# 1. رفتن به مسیر پروژه
cd /home/shop1111/Brun

# 2. فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# 3. پاک کردن build قبلی
rm -rf .next

# 4. Build دوباره
NODE_OPTIONS="--max-old-space-size=2048" npm run build:linux

# 5. بررسی Build
ls -la .next/BUILD_ID

# 6. Restart PM2
pm2 delete saded
pm2 start ecosystem.config.js --update-env

# 7. بررسی وضعیت
pm2 status
pm2 logs saded --lines 20
```

---

## اگر هنوز مشکل دارید

### بررسی لاگ‌ها:

```bash
# بررسی لاگ‌های PM2
pm2 logs saded --lines 50

# بررسی خطاها
pm2 logs saded --err --lines 50
```

### بررسی Build:

```bash
# بررسی BUILD_ID
cat .next/BUILD_ID

# بررسی محتویات .next/server
ls -la .next/server/ | head -20
```

---

## نکات مهم

1. **همیشه بعد از build، BUILD_ID را بررسی کنید**
2. **اگر BUILD_ID وجود ندارد، build ناقص است**
3. **Turbopack باید کاملاً غیرفعال باشد**
4. **اگر build در هاست مشکل دارد، در سیستم محلی build کنید**

