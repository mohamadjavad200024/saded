# راهنمای ایجاد Node.js App در cPanel

## مرحله 1: رفتن به Node.js Selector

1. وارد cPanel شوید
2. در بخش **Software** → **Setup Node.js App** را پیدا کنید
3. روی **Create Application** کلیک کنید

---

## مرحله 2: پر کردن فرم ایجاد اپلیکیشن

### **Node.js Version**
- نسخه Node.js را انتخاب کنید (توصیه: **20.x** یا **18.x**)

### **Application Mode**
- **Production** را انتخاب کنید

### **Application Root**
مسیر ریپازیتوری که کلون کردید را وارد کنید:
```
public_html/saded
```
یا اگر در مسیر دیگری کلون کردید، همان مسیر را وارد کنید.

### **Application URL**
- اگر می‌خواهید روی دامنه اصلی اجرا شود: `yourdomain.com`
- یا می‌توانید یک subdomain ایجاد کنید: `app.yourdomain.com`
- یا از یک مسیر استفاده کنید: `yourdomain.com/saded`

### **Application Startup File**
```
server.js
```

### **Application Entry Point**
```
server.js
```

### **Passenger Log File** (اختیاری)
```
logs/passenger.log
```

---

## مرحله 3: Environment Variables (متغیرهای محیطی)

بعد از ایجاد اپلیکیشن، در صفحه تنظیمات اپلیکیشن، بخش **Environment Variables** را پیدا کنید و این متغیرها را اضافه کنید:

```
NODE_ENV=production
PORT=3001
HOSTNAME=0.0.0.0
NODE_OPTIONS=--max-old-space-size=4096
```

**اگر دیتابیس دارید:**
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shop1111_saded
DB_USER=shop1111_saded_user
DB_PASSWORD=your_password
DB_SSL=false
```

---

## مرحله 4: نصب Dependencies و Build

بعد از ایجاد اپلیکیشن، باید dependencies را نصب کنید و پروژه را build کنید.

### روش 1: از طریق Terminal در cPanel

1. به **Terminal** در cPanel بروید
2. این دستورات را اجرا کنید:

```bash
# فعال کردن virtual environment (cPanel به صورت خودکار ایجاد می‌کند)
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# نصب dependencies
npm install

# Build پروژه
npm run build
```

### روش 2: از طریق SSH

اگر دسترسی SSH دارید:

```bash
ssh shop1111@your-server.com
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded
npm install
npm run build
```

---

## مرحله 5: Restart اپلیکیشن

بعد از نصب و build:

1. به صفحه **Node.js App Manager** برگردید
2. اپلیکیشن خود را پیدا کنید
3. روی **Restart App** کلیک کنید

---

## مرحله 6: بررسی وضعیت

### بررسی لاگ‌ها

در صفحه Node.js App Manager:
- روی **View Logs** کلیک کنید
- یا از Terminal:

```bash
tail -f /home/shop1111/public_html/saded/logs/passenger.log
```

### تست اپلیکیشن

در مرورگر:
- به URL که در **Application URL** وارد کردید بروید
- باید سایت شما نمایش داده شود

---

## نکات مهم:

### 1. مسیرها
- مطمئن شوید که **Application Root** همان مسیری است که ریپازیتوری را کلون کردید
- معمولاً: `/home/shop1111/public_html/saded`

### 2. پورت
- cPanel به صورت خودکار یک پورت اختصاص می‌دهد
- این پورت در متغیر `PORT` یا `APP_PORT` قرار می‌گیرد
- اگر می‌خواهید پورت خاصی استفاده کنید، در Environment Variables تنظیم کنید

### 3. Build
- حتماً بعد از `npm install`، `npm run build` را اجرا کنید
- بدون build، Next.js کار نمی‌کند

### 4. Virtual Environment
- cPanel به صورت خودکار یک virtual environment برای Node.js ایجاد می‌کند
- مسیر معمول: `/home/shop1111/nodevenv/public_html/saded/20/`
- حتماً قبل از اجرای npm commands، virtual environment را فعال کنید

### 5. خطاهای رایج

**خطا: "Cannot find module 'next'"**
```bash
npm install
```

**خطا: "Build not found"**
```bash
npm run build
```

**خطا: "Port already in use"**
- در Environment Variables، `PORT` را تغییر دهید
- یا اپلیکیشن‌های دیگر را stop کنید

**خطا: "Memory limit exceeded"**
- در Environment Variables، `NODE_OPTIONS` را اضافه کنید:
```
NODE_OPTIONS=--max-old-space-size=4096
```

---

## دستورات مفید:

### بررسی وضعیت اپلیکیشن
```bash
cd /home/shop1111/public_html/saded
pm2 status
# یا
ps aux | grep node
```

### Restart دستی
```bash
cd /home/shop1111/public_html/saded
pm2 restart saded
# یا از cPanel: Restart App
```

### مشاهده لاگ‌های real-time
```bash
tail -f /home/shop1111/public_html/saded/logs/passenger.log
```

### بررسی پورت
```bash
netstat -tulpn | grep node
```

---

## بعد از راه‌اندازی موفق:

1. ✅ اپلیکیشن در cPanel ایجاد شد
2. ✅ Dependencies نصب شد
3. ✅ پروژه build شد
4. ✅ اپلیکیشن restart شد
5. ✅ سایت در مرورگر باز می‌شود

اگر مشکلی پیش آمد، لاگ‌ها را بررسی کنید و خطا را به من بگویید.

