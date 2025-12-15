# راه حل Restart PM2

## وضعیت:
✅ PM2 در حال اجرا است (PM2 v6.0.14)
✅ Socket files موجود است (pub.sock, rpc.sock)
❌ فایل اجرایی pm2 پیدا نمی‌شود

## راه حل‌ها:

### روش 1: استفاده از socket PM2 (توصیه می‌شود)

PM2 از طریق socket ارتباط برقرار می‌کند. می‌توانیم از طریق node و socket با PM2 ارتباط برقرار کنیم:

```bash
# رفتن به دایرکتوری پروژه
cd /home/shop1111/public_html/saded

# بررسی node_modules
ls -la node_modules/.bin/pm2

# اگر pm2 در node_modules وجود دارد:
./node_modules/.bin/pm2 restart saded
```

### روش 2: استفاده از kill و start مجدد

```bash
# پیدا کردن PID PM2
pgrep -f "PM2.*God"

# kill کردن PM2
pkill -f "PM2.*God"

# سپس باید PM2 را دوباره start کنیم
# اما برای این کار نیاز به مسیر pm2 داریم
```

### روش 3: استفاده از npx

```bash
cd /home/shop1111/public_html/saded
npx pm2 restart saded
```

### روش 4: استفاده از node مستقیم

```bash
cd /home/shop1111/public_html/saded

# پیدا کردن node_modules
ls -la node_modules/.bin/ | grep pm2

# یا استفاده از npx
npx pm2 restart saded
```

### روش 5: Restart از طریق kill signal

```bash
# پیدا کردن PID PM2
PM2_PID=$(pgrep -f "PM2.*God")

# ارسال signal برای reload
kill -HUP $PM2_PID

# یا restart کامل
kill -SIGINT $PM2_PID
# سپس باید دوباره start شود
```

## بررسی دایرکتوری پروژه:

```bash
# رفتن به دایرکتوری پروژه
cd /home/shop1111/public_html/saded

# بررسی node_modules
ls -la node_modules/.bin/pm2 2>/dev/null
ls -la node_modules/.bin/ | grep pm2

# بررسی package.json
cat package.json | grep -A 10 scripts

# بررسی اگر npx در دسترس است
which npx
npx --version
```

