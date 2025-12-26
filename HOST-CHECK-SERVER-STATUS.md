# بررسی وضعیت سرور

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2
pm2 status
pm2 describe saded

# 2. بررسی اینکه آیا سرور واقعاً در حال اجرا است
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

# 3. بررسی logs جدید (بعد از restart)
pm2 logs saded --lines 20 --nostream

# 4. تست مجدد
sleep 2
curl -v http://localhost:3001/ 2>&1

# 5. اگر connection refused است، بررسی error logs
pm2 logs saded --lines 30 --err --nostream | tail -20

# 6. بررسی اینکه آیا process در حال اجرا است
ps aux | grep "node.*server.js" | grep -v grep

# 7. اگر سرور crash کرده، بررسی آخرین خطا
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log | tail -20
```

## اگر سرور crash می‌کند:

```bash
# بررسی دلیل crash
pm2 logs saded --lines 100 --nostream | grep -A 10 "Error\|error\|ERROR\|crash\|exit"
```

