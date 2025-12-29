# بررسی وضعیت PM2

## مشکل
`pm2: command not found` - این یعنی virtual environment فعال نیست.

## راه‌حل

### مرحله 1: فعال‌سازی Virtual Environment

```bash
# رفتن به مسیر پروژه
cd /home/shop1111/Brun

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# حالا PM2 باید در دسترس باشد
pm2 --version
```

### مرحله 2: بررسی وضعیت PM2

```bash
# بررسی وضعیت
pm2 status

# بررسی لاگ‌ها
pm2 logs saded --lines 50

# یا فقط خطاها
pm2 logs saded --err --lines 50
```

### مرحله 3: اگر PM2 هنوز در دسترس نیست

```bash
# بررسی اینکه آیا PM2 در virtual environment نصب است
which pm2

# بررسی path PM2
ls -la /home/shop1111/nodevenv/Brun/20/bin/pm2

# اگر PM2 وجود ندارد، نصب کنید
npm install -g pm2

# یا در virtual environment
pip install pm2  # اگر از pip استفاده می‌کنید
```

### مرحله 4: بررسی Process

```bash
# بررسی اینکه آیا PM2 process در حال اجرا است
ps aux | grep pm2

# بررسی node processes
ps aux | grep node
```

### مرحله 5: بررسی Log Files

اگر PM2 در دسترس نیست، می‌توانید مستقیماً log files را بررسی کنید:

```bash
# بررسی log files
cat /home/shop1111/Brun/logs/pm2-error.log | tail -50
cat /home/shop1111/Brun/logs/pm2-out.log | tail -50
cat /home/shop1111/Brun/logs/pm2-combined.log | tail -50
```

### مرحله 6: بررسی Application

```bash
# بررسی اینکه آیا application در حال اجرا است
ps aux | grep "server.js"

# بررسی port
netstat -tuln | grep 3001
# یا
ss -tuln | grep 3001
```

---

## دستورات کامل

```bash
# 1. رفتن به مسیر پروژه
cd /home/shop1111/Brun

# 2. فعال‌سازی virtual environment
source /home/shop1111/nodevenv/Brun/20/bin/activate

# 3. بررسی PM2
pm2 --version
pm2 status

# 4. بررسی لاگ‌ها
pm2 logs saded --lines 50

# 5. اگر PM2 در دسترس نیست، بررسی log files
cat logs/pm2-error.log | tail -50
cat logs/pm2-out.log | tail -50
```

---

## اگر PM2 نصب نیست

```bash
# نصب PM2 در virtual environment
npm install -g pm2

# یا استفاده از npx
npx pm2 status
npx pm2 logs saded --lines 50
```

---

## بررسی مستقیم Application

اگر PM2 کار نمی‌کند، می‌توانید مستقیماً application را اجرا کنید:

```bash
# فعال‌سازی virtual environment
cd /home/shop1111/Brun
source /home/shop1111/nodevenv/Brun/20/bin/activate

# اجرای مستقیم server
node server.js

# بررسی خطاها در console
```

