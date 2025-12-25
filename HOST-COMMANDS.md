# دستورات دپلوی روی سرور (شما در حال حاضر روی سرور هستید)

## دستورات سریع (کپی و پیست کنید):

```bash
# 1. اطمینان از فعال بودن محیط مجازی و بودن در مسیر پروژه
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 2. Pull کردن تغییرات از Git
git pull origin main
# یا اگر branch شما master است:
# git pull origin master

# 3. نصب Dependencies (اگر package.json تغییر کرده)
npm install --production

# 4. بیلد پروژه
npm run build

# 5. راه‌اندازی مجدد PM2
pm2 restart ecosystem.config.js
# یا اگر با نام:
# pm2 restart saded
# یا اگر PM2 راه‌اندازی نشده:
# pm2 start ecosystem.config.js
```

## دستورات تک‌تک:

### بررسی وضعیت فعلی
```bash
# بررسی وضعیت Git
git status

# بررسی وضعیت PM2
pm2 status

# بررسی لاگ‌های PM2
pm2 logs saded --lines 50
```

### Pull تغییرات
```bash
git pull origin main
```

### نصب Dependencies
```bash
npm install --production
```

### بیلد پروژه
```bash
npm run build
```

### مدیریت PM2
```bash
# راه‌اندازی مجدد
pm2 restart saded

# یا راه‌اندازی با فایل config
pm2 restart ecosystem.config.js

# توقف
pm2 stop saded

# شروع
pm2 start ecosystem.config.js

# حذف
pm2 delete saded

# مشاهده لاگ‌ها
pm2 logs saded

# مشاهده لاگ‌های خطا
pm2 logs saded --err

# بررسی استفاده از منابع
pm2 monit
```

### بررسی خطاها
```bash
# بررسی پورت
netstat -tulpn | grep :3000

# بررسی استفاده از حافظه
free -h

# بررسی لاگ‌های سیستم
tail -f /var/log/nodejs.log
```

## اگر مشکلی پیش آمد:

### اگر Git Pull خطا داد:
```bash
# بررسی remote
git remote -v

# اگر remote تنظیم نشده:
git remote add origin <YOUR_REPO_URL>

# Force pull (احتیاط!)
git fetch origin
git reset --hard origin/main
```

### اگر Build خطا داد:
```bash
# پاک کردن cache
rm -rf .next
npm run build
```

### اگر PM2 کار نمی‌کند:
```bash
# بررسی نصب PM2
which pm2

# نصب PM2 (اگر نصب نشده)
npm install -g pm2

# راه‌اندازی دستی برای تست
node server.js
```

### اگر پورت در دسترس نیست:
```bash
# بررسی فایروال
sudo ufw status

# بررسی process روی پورت
lsof -i :3000
```

