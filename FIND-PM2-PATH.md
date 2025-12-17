# پیدا کردن مسیر دقیق PM2

## دستورات تشخیصی:

```bash
# 1. پیدا کردن مسیر PM2 از طریق process
ps aux | grep pm2 | grep -v grep
ps aux | grep pm2 | grep -v grep | awk '{print $11}'

# 2. بررسی تمام فایل‌های PM2
find ~ -name pm2 2>/dev/null | head -10
find /usr -name pm2 2>/dev/null | head -10
find /opt -name pm2 2>/dev/null | head -10

# 3. بررسی دایرکتوری PM2
ls -la ~/.pm2/
ls -la ~/.pm2/bin/ 2>/dev/null
ls -la ~/.pm2/node_modules/ 2>/dev/null

# 4. بررسی node_modules برای PM2
find ~/.pm2 -name pm2 2>/dev/null
find node_modules -name pm2 2>/dev/null | head -5

# 5. بررسی PATH در process PM2
cat /proc/$(pgrep -f "PM2.*God")/environ | tr '\0' '\n' | grep PATH

# 6. بررسی فایل‌های اجرایی در دایرکتوری‌های مختلف
ls -la /usr/local/bin/pm2 2>/dev/null
ls -la /usr/bin/pm2 2>/dev/null
ls -la ~/bin/pm2 2>/dev/null
ls -la ~/.local/bin/pm2 2>/dev/null

# 7. استفاده از whereis
whereis pm2

# 8. بررسی package.json برای scripts
cat package.json | grep -A 5 scripts
```

## راه حل‌های جایگزین:

### روش 1: استفاده از kill و start مجدد
```bash
# پیدا کردن PID PM2
pgrep -f "PM2.*God"

# kill کردن PM2
pkill -f "PM2.*God"

# سپس پیدا کردن مسیر و start مجدد
```

### روش 2: استفاده از node_modules
```bash
# اگر PM2 در node_modules نصب شده
./node_modules/.bin/pm2 restart saded
```

### روش 3: استفاده از npx
```bash
# استفاده از npx برای اجرای PM2
npx pm2 restart saded
```

### روش 4: استفاده از node مستقیم
```bash
# پیدا کردن مسیر node
ps aux | grep node | grep server.js | awk '{print $11}'

# استفاده از node برای restart
# (نیاز به پیدا کردن script restart)
```


