# راه حل Deploy - پیدا کردن مسیر PM2

## وضعیت فعلی:
✅ PM2 در حال اجرا است (PM2 v6.0.14)
✅ Node.js در حال اجرا است
❌ npm و pm2 در PATH نیستند

## پیدا کردن مسیر PM2:

```bash
# روش 1: پیدا کردن مسیر PM2 از طریق process
ps aux | grep pm2 | grep -v grep | awk '{print $11}'

# روش 2: پیدا کردن مسیر PM2 از طریق PM2 خودش
~/.pm2/bin/pm2 list
~/.pm2/bin/pm2 restart saded

# روش 3: بررسی مسیر PM2
ls -la ~/.pm2/
ls -la ~/.pm2/bin/

# روش 4: استفاده از مسیر کامل PM2
/home/shop1111/.pm2/bin/pm2 restart saded
```

## پیدا کردن npm و node:

```bash
# بررسی lsnode (که در حال اجرا است)
which lsnode
whereis lsnode

# بررسی مسیر node از طریق process
ps aux | grep node | grep -v grep | awk '{print $11}'

# بررسی node_modules
ls -la node_modules/.bin/ | grep npm
ls -la node_modules/.bin/ | grep node
```

## دستورات Deploy:

### روش 1: استفاده از PM2 مستقیم (توصیه می‌شود)

```bash
# رفتن به دایرکتوری پروژه
cd /home/shop1111/public_html/saded

# دریافت تغییرات (انجام شده ✅)
# git pull origin main

# Restart با PM2 (از طریق مسیر کامل)
~/.pm2/bin/pm2 restart saded

# یا اگر PM2 در PATH است:
pm2 restart saded
```

### روش 2: استفاده از npm از طریق node_modules

```bash
cd /home/shop1111/public_html/saded

# استفاده از npm محلی
./node_modules/.bin/npm install
./node_modules/.bin/npm run build

# سپس restart
~/.pm2/bin/pm2 restart saded
```

### روش 3: استفاده از npx

```bash
cd /home/shop1111/public_html/saded

# استفاده از npx (اگر در دسترس است)
npx npm install
npx npm run build

# سپس restart
~/.pm2/bin/pm2 restart saded
```

## بررسی وضعیت:

```bash
# بررسی وضعیت PM2
~/.pm2/bin/pm2 list
~/.pm2/bin/pm2 status

# بررسی لاگ‌ها
~/.pm2/bin/pm2 logs saded --lines 50

# یا بررسی لاگ‌های فایل
tail -50 logs/pm2-out-0.log
tail -50 logs/pm2-error-0.log
```

