# 🚀 راهنمای استقرار پروژه از طریق IP

از آنجایی که نمی‌توانید با SSH وارد شوید، می‌توانید از روش‌های دیگر استفاده کنید.

**اطلاعات VPS:**
- **IP:** 185.173.104.249
- **OS:** Ubuntu 20
- **Username:** root
- **Password:** g4sSB3650G

---

## 📤 روش 1: آپلود فایل‌ها با FileZilla (توصیه می‌شود)

### مرحله 1: دانلود و نصب FileZilla

1. به این آدرس بروید: https://filezilla-project.org/
2. FileZilla Client را دانلود کنید
3. نصب کنید

### مرحله 2: اتصال به VPS

1. FileZilla را باز کنید
2. در قسمت بالا:
   - **Host:** `sftp://185.173.104.249`
   - **Username:** `root`
   - **Password:** `g4sSB3650G`
   - **Port:** `22`
3. روی **Quickconnect** کلیک کنید

### مرحله 3: آپلود فایل‌ها

بعد از اتصال موفق:

1. در سمت چپ (Local site): به پوشه پروژه بروید: `D:\saded - Copy (4)`
2. در سمت راست (Remote site): به پوشه دلخواه بروید (مثلاً `/root/saded`)

**فایل‌هایی که باید آپلود شوند:**

✅ **باید آپلود شوند:**
- پوشه `.next/` (خیلی مهم!)
- پوشه `app/`
- پوشه `components/` (اگر وجود دارد)
- پوشه `lib/` (اگر وجود دارد)
- پوشه `public/`
- فایل `server.js`
- فایل `package.json`
- فایل `package-lock.json`
- فایل `next.config.js`
- فایل `tsconfig.json` (اگر وجود دارد)
- فایل `tailwind.config.js` (اگر وجود دارد)
- فایل `ecosystem.config.js`
- سایر فایل‌های پروژه

❌ **نباید آپلود شوند:**
- پوشه `node_modules/` (در VPS نصب می‌شود)
- فایل `.env.local`
- پوشه `.git/`

**💡 نکته:** برای نمایش فایل‌های مخفی (مثل `.next`):
- در FileZilla: Server > Force show hidden files

---

## 📤 روش 2: آپلود فایل‌ها با WinSCP

### مرحله 1: دانلود WinSCP

1. به این آدرس بروید: https://winscp.net/
2. WinSCP را دانلود کنید
3. نصب کنید

### مرحله 2: اتصال

1. WinSCP را باز کنید
2. **New Session** را بزنید
3. تنظیمات:
   - **File protocol:** SFTP
   - **Host name:** `185.173.104.249`
   - **Port number:** `22`
   - **User name:** `root`
   - **Password:** `g4sSB3650G`
4. **Login** را بزنید

### مرحله 3: آپلود

1. سمت چپ: پوشه پروژه (`D:\saded - Copy (4)`)
2. سمت راست: پوشه VPS (مثلاً `/root/saded`)
3. فایل‌ها را drag & drop کنید

---

## 📤 روش 3: استفاده از SCP از PowerShell

اگر می‌توانید از PowerShell استفاده کنید:

```powershell
# رفتن به پوشه پروژه
cd "D:\saded - Copy (4)"

# آپلود تمام فایل‌ها (به جز node_modules)
scp -r -o StrictHostKeyChecking=no * root@185.173.104.249:/root/saded/
```

**⚠️ توجه:** این روش ممکن است فایل‌های غیرضروری هم آپلود کند.

---

## 🔧 بعد از آپلود فایل‌ها

بعد از آپلود فایل‌ها، باید دستورات را در VPS اجرا کنید. از آنجایی که نمی‌توانید با SSH وارد شوید، می‌توانید:

### روش A: استفاده از کنسول وب VPS

1. به پنل VPS بروید
2. کنسول وب را باز کنید
3. دستورات زیر را اجرا کنید

### روش B: استفاده از پنل مدیریت VPS

اگر پنل مدیریتی دارید (مثل Webmin، cPanel، یا Plesk)، می‌توانید از آن استفاده کنید.

---

## 📋 دستورات لازم برای استقرار

بعد از آپلود فایل‌ها، این دستورات را در VPS اجرا کنید:

### 1. بررسی فایل‌ها

```bash
cd /root/saded
ls -la
```

### 2. نصب Node.js (اگر نصب نیست)

```bash
# به‌روزرسانی سیستم
sudo apt update

# نصب Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# بررسی نصب
node --version
npm --version
```

### 3. نصب PM2

```bash
sudo npm install -g pm2
pm2 --version
```

### 4. نصب Dependencies

```bash
cd /root/saded
npm install --production
```

### 5. ایجاد فایل .env.production

```bash
nano .env.production
```

محتوا:
```env
NODE_ENV=production
HOSTNAME=0.0.0.0
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_SSL=false
NEXT_PUBLIC_URL=http://185.173.104.249:3000
```

ذخیره: `Ctrl + O`, `Enter`, `Ctrl + X`

### 6. به‌روزرسانی ecosystem.config.js

```bash
nano ecosystem.config.js
```

مطمئن شوید که:
- `cwd: '/root/saded'`
- `interpreter: 'node'`
- `env` شامل تمام متغیرهای محیطی است

### 7. ایجاد پوشه logs

```bash
mkdir -p logs
```

### 8. راه‌اندازی با PM2

```bash
cd /root/saded
pm2 start ecosystem.config.js
pm2 status
pm2 save
pm2 startup
```

### 9. بررسی وضعیت

```bash
pm2 logs saded
netstat -tulpn | grep 3000
```

---

## 🌐 دسترسی به سایت

بعد از راه‌اندازی، می‌توانید از این آدرس به سایت دسترسی داشته باشید:

```
http://185.173.104.249:3000
```

---

## 🔥 تنظیم فایروال (اگر نیاز باشد)

```bash
# بررسی وضعیت فایروال
sudo ufw status

# باز کردن پورت 3000
sudo ufw allow 3000/tcp

# اگر می‌خواهید از پورت 80 استفاده کنید
sudo ufw allow 80/tcp
```

---

## 🌐 تنظیم Nginx (برای استفاده از پورت 80)

اگر می‌خواهید از پورت 80 استفاده کنید:

```bash
# نصب Nginx
sudo apt install -y nginx

# ایجاد Configuration
sudo nano /etc/nginx/sites-available/saded
```

محتوا:
```nginx
server {
    listen 80;
    server_name 185.173.104.249;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# فعال‌سازی
sudo ln -s /etc/nginx/sites-available/saded /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

حالا می‌توانید از این آدرس استفاده کنید:
```
http://185.173.104.249
```

---

## 📝 چک‌لیست

- [ ] FileZilla یا WinSCP نصب شد
- [ ] به VPS متصل شدم
- [ ] فایل‌ها را آپلود کردم (مخصوصاً پوشه `.next`)
- [ ] از کنسول وب VPS وارد شدم
- [ ] Node.js نصب شد
- [ ] PM2 نصب شد
- [ ] Dependencies نصب شدند
- [ ] فایل `.env.production` ایجاد شد
- [ ] Application با PM2 راه‌اندازی شد
- [ ] سایت در مرورگر باز می‌شود

---

## 🆘 اگر مشکل دارید

1. بررسی کنید که فایل‌ها کامل آپلود شده‌اند
2. بررسی کنید که پوشه `.next` موجود است
3. Logs را بررسی کنید: `pm2 logs saded`
4. با پشتیبانی Hostiran تماس بگیرید

---

**موفق باشید!** 🚀

اگر در هر مرحله مشکل داشتید، بگویید تا کمک کنم.

