# راهنمای تنظیم Phusion Passenger برای Next.js

## مقدمه

اگر هاست شما از **Phusion Passenger** استفاده می‌کند، باید application را در بخش **Application Manager** ثبت کنید.

---

## مرحله 1: آماده‌سازی پروژه

### 1.1 بررسی فایل `package.json`

مطمئن شوید که در `package.json` script `start` وجود دارد:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

### 1.2 بررسی فایل `server.js`

مطمئن شوید که `server.js` در root directory پروژه وجود دارد.

---

## مرحله 2: ثبت Application در Passenger

### 2.1 ورود به Application Manager

1. وارد cPanel شوید
2. به بخش **Application Manager** (یا **Passenger**) بروید
3. روی **Register Your Application** کلیک کنید

### 2.2 تنظیمات Application

**Application Name:**
```
saded
```
یا هر نام دلخواه دیگری

**Deployment Domain:**
```
77191336.shop
```
دامنه اصلی خود را انتخاب کنید

**Application Path:**
```
Brun
```
**نکته مهم:** این مسیر باید **نسبت به home directory** باشد.
- اگر پروژه در `/home/shop1111/Brun` است
- باید فقط `Brun` را وارد کنید (نه `/home/shop1111/Brun`)

**Deployment Environment:**
```
Production
```
برای production از **Production** استفاده کنید

### 2.3 ذخیره Application

بعد از وارد کردن تمام اطلاعات، روی **Register** یا **Create** کلیک کنید.

---

## مرحله 3: تنظیم Environment Variables

بعد از ثبت application، باید environment variables را تنظیم کنید:

### 3.1 در Application Manager

1. Application را باز کنید
2. به بخش **Environment Variables** بروید
3. متغیرهای زیر را اضافه کنید:

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
NEXT_PRIVATE_SKIP_TURBO=1
NEXT_PRIVATE_WEBPACK=1
```

### 3.2 یا از طریق فایل `.env.production`

می‌توانید environment variables را در فایل `.env.production` قرار دهید:

```bash
cd /home/shop1111/Brun
nano .env.production
```

محتوای فایل:
```env
NODE_ENV=production
HOSTNAME=0.0.0.0
DB_HOST=localhost
DB_PORT=3306
DB_NAME=shop1111_Brun
DB_USER=shop1111_Brundb
DB_PASSWORD=goul77191336
DB_SSL=false
NEXT_PUBLIC_URL=http://77191336.shop
NEXT_PRIVATE_SKIP_TURBO=1
NEXT_PRIVATE_WEBPACK=1
```

---

## مرحله 4: نصب Dependencies

### 4.1 از طریق Terminal

```bash
source /home/shop1111/nodevenv/Brun/20/bin/activate
cd /home/shop1111/Brun
npm install
```

### 4.2 یا از طریق Application Manager

اگر Application Manager دکمه **Install Dependencies** دارد، از آن استفاده کنید.

---

## مرحله 5: Build پروژه

### 5.1 از طریق Terminal

```bash
source /home/shop1111/nodevenv/Brun/20/bin/activate
cd /home/shop1111/Brun
npm run build
```

### 5.2 بررسی Build

```bash
ls -la .next/BUILD_ID
```

اگر فایل `BUILD_ID` وجود دارد، build موفق بوده است.

---

## مرحله 6: Restart Application

### 6.1 از طریق Application Manager

1. Application را باز کنید
2. روی **Restart** کلیک کنید
3. منتظر بمانید تا application شروع شود

### 6.2 از طریق Terminal

```bash
touch /home/shop1111/Brun/tmp/restart.txt
```

این فایل را ایجاد کنید تا Passenger application را restart کند.

---

## مرحله 7: تست سایت

سایت را در مرورگر باز کنید:
```
http://77191336.shop
```

اگر سایت باز شد، استقرار موفق بوده است! 🎉

---

## عیب‌یابی

### مشکل 1: Application شروع نمی‌شود

**بررسی لاگ‌ها:**
```bash
cd /home/shop1111/Brun
tail -f logs/passenger.log
```

یا در Application Manager، بخش **Logs** را بررسی کنید.

### مشکل 2: خطای "Cannot find module"

**راه‌حل:**
```bash
cd /home/shop1111/Brun
npm install
```

### مشکل 3: خطای "Port already in use"

**راه‌حل:**
- Application را در Node.js App Manager **Stop** کنید
- یا PM2 را متوقف کنید:
```bash
pm2 stop saded
pm2 delete saded
```

### مشکل 4: هنوز "Index of /" نمایش داده می‌شود

**راه‌حل:**
1. Application را در Passenger **Restart** کنید
2. چند دقیقه صبر کنید
3. Cache مرورگر را پاک کنید
4. دوباره تست کنید

---

## نکات مهم

1. **Passenger و Node.js App Manager:** اگر از Passenger استفاده می‌کنید، **نباید** از Node.js App Manager استفاده کنید. فقط یکی را انتخاب کنید.

2. **PM2 و Passenger:** اگر از Passenger استفاده می‌کنید، **نباید** از PM2 استفاده کنید. Passenger خودش application را مدیریت می‌کند.

3. **فایل `.htaccess`:** اگر از Passenger استفاده می‌کنید، معمولاً نیازی به فایل `.htaccess` نیست. Passenger خودش همه چیز را مدیریت می‌کند.

4. **مسیر Application Path:** در Passenger، مسیر باید **نسبت به home directory** باشد، نه مسیر کامل.

---

## مقایسه Passenger و Node.js App Manager

| ویژگی | Passenger | Node.js App Manager |
|-------|-----------|---------------------|
| مدیریت Process | خودکار | خودکار |
| Restart | با `touch tmp/restart.txt` | از طریق UI |
| Environment Variables | از طریق UI یا `.env` | از طریق UI |
| Port | خودکار | قابل تنظیم |
| Logs | در Application Manager | در Application Manager |

---

## خلاصه دستورات

```bash
# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/Brun

# نصب dependencies
npm install

# Build پروژه
npm run build

# Restart Passenger application
touch tmp/restart.txt

# بررسی لاگ‌ها
tail -f logs/passenger.log
```

---

## اگر هنوز کار نمی‌کند

1. با پشتیبانی هاست تماس بگیرید
2. از آنها بخواهید که:
   - بررسی کنند که Passenger فعال است
   - بررسی کنند که Node.js version درست است
   - بررسی کنند که application درست ثبت شده است

