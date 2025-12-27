# راهنمای رفع خطای 503 در cPanel Node.js App

خطای 503 یعنی سرور در حال اجرا نیست یا مشکلی در راه‌اندازی وجود دارد.

## مراحل رفع مشکل:

### مرحله 1: بررسی Build

خطای 503 معمولاً به این دلیل است که پروژه build نشده است.

```bash
# فعال کردن virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# بررسی وجود .next folder
ls -la .next/BUILD_ID && echo "✓ Build exists" || echo "✗ Build NOT found - باید build کنید"

# اگر build وجود ندارد:
npm run build
```

**نکته:** Build ممکن است 5-10 دقیقه طول بکشد. صبر کنید تا کامل شود.

---

### مرحله 2: بررسی لاگ‌ها

```bash
cd /home/shop1111/public_html/saded

# بررسی لاگ‌های Passenger (cPanel)
tail -50 logs/passenger.log

# یا اگر لاگ دیگری دارید:
tail -50 logs/pm2-out.log
tail -50 logs/pm2-error.log

# بررسی لاگ‌های real-time
tail -f logs/passenger.log
```

**چیزهایی که باید در لاگ ببینید:**
- ✅ `Starting Next.js server...`
- ✅ `Ready on http://0.0.0.0:PORT`
- ❌ خطاهای `Cannot find module`
- ❌ خطاهای `Build not found`
- ❌ خطاهای `Port already in use`

---

### مرحله 3: بررسی Dependencies

```bash
cd /home/shop1111/public_html/saded

# بررسی نصب بودن Next.js
ls node_modules/next && echo "✓ Next.js installed" || echo "✗ Next.js NOT installed"

# اگر نصب نیست:
npm install

# بررسی سایر dependencies مهم
ls node_modules/react && echo "✓ React installed" || echo "✗ React NOT installed"
```

---

### مرحله 4: بررسی server.js

```bash
cd /home/shop1111/public_html/saded

# بررسی وجود server.js
ls -la server.js && echo "✓ server.js exists" || echo "✗ server.js NOT found"

# بررسی محتوای server.js
head -20 server.js
```

اگر `server.js` وجود ندارد، باید آن را ایجاد کنید.

---

### مرحله 5: تست دستی اجرای سرور

```bash
cd /home/shop1111/public_html/saded

# فعال کردن virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# تست اجرای مستقیم
NODE_ENV=production PORT=3001 HOSTNAME=0.0.0.0 node server.js
```

اگر خطا داد، همان خطا را در لاگ‌های cPanel هم می‌بینید.

---

### مرحله 6: بررسی Environment Variables در cPanel

1. به **Node.js App Manager** بروید
2. اپلیکیشن خود را پیدا کنید
3. روی **Edit** کلیک کنید
4. بخش **Environment Variables** را بررسی کنید:

**باید این متغیرها وجود داشته باشند:**
```
NODE_ENV=production
PORT=3001
HOSTNAME=0.0.0.0
NODE_OPTIONS=--max-old-space-size=4096
```

5. **Save** کنید
6. **Restart App** را بزنید

---

### مرحله 7: بررسی Application Root

مطمئن شوید که **Application Root** درست است:

1. در **Node.js App Manager**
2. **Application Root** باید باشد: `public_html/saded`
3. یا مسیر کامل: `/home/shop1111/public_html/saded`

---

### مرحله 8: بررسی Startup File

مطمئن شوید که:
- **Application Startup File:** `server.js`
- **Application Entry Point:** `server.js`

---

## دستورات کامل برای رفع مشکل:

```bash
# 1. فعال کردن virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# 2. رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# 3. بررسی وضعیت فعلی
echo "=== Checking current status ==="
ls -la .next/BUILD_ID 2>/dev/null && echo "✓ Build exists" || echo "✗ Build NOT found"
ls -la server.js && echo "✓ server.js exists" || echo "✗ server.js NOT found"
ls -la node_modules/next && echo "✓ Next.js installed" || echo "✗ Next.js NOT installed"

# 4. نصب dependencies (اگر نیاز است)
if [ ! -d "node_modules/next" ]; then
  echo "Installing dependencies..."
  npm install
fi

# 5. Build پروژه (اگر نیاز است)
if [ ! -f ".next/BUILD_ID" ]; then
  echo "Building project..."
  npm run build
fi

# 6. بررسی لاگ‌ها
echo "=== Checking logs ==="
tail -30 logs/passenger.log 2>/dev/null || echo "No passenger.log found"
```

---

## خطاهای رایج و راه حل:

### خطا: "Cannot find module 'next'"
```bash
npm install
```

### خطا: "Build not found" یا ".next directory not found"
```bash
npm run build
```

### خطا: "Port already in use"
- در Environment Variables، `PORT` را تغییر دهید
- یا اپلیکیشن‌های دیگر را stop کنید

### خطا: "Memory limit exceeded"
```bash
# در Environment Variables اضافه کنید:
NODE_OPTIONS=--max-old-space-size=4096
```

### خطا: "EACCES: permission denied"
```bash
# بررسی permissions
ls -la /home/shop1111/public_html/saded
# اگر نیاز است:
chmod -R 755 /home/shop1111/public_html/saded
```

---

## بعد از رفع مشکل:

1. در cPanel → **Node.js App Manager** → **Restart App**
2. 30 ثانیه صبر کنید
3. سایت را refresh کنید
4. اگر هنوز 503 می‌دهد، لاگ‌ها را دوباره بررسی کنید

---

## اگر هنوز مشکل دارید:

لاگ‌های زیر را بررسی کنید و خطا را برای من بفرستید:

```bash
cd /home/shop1111/public_html/saded
tail -100 logs/passenger.log
tail -100 logs/pm2-error.log 2>/dev/null
```

یا از cPanel:
- **Node.js App Manager** → **View Logs**

