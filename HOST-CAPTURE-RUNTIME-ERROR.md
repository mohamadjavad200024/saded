# Capture Runtime Error

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. پاک کردن logs قدیمی (اختیاری)
# pm2 flush

# 2. ارسال درخواست و فوراً بررسی logs
curl http://localhost:3001/ > /dev/null 2>&1 &
sleep 1
pm2 logs saded --lines 50 --nostream | tail -50

# 3. بررسی error logs بعد از درخواست
pm2 logs saded --lines 50 --err --nostream | tail -50

# 4. بررسی فایل log خروجی
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -A 10 -B 5 "Error\|error\|ERROR\|15:1"

# 5. بررسی فایل log خطا
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log | grep -A 10 -B 5 "Error\|error\|ERROR\|15:1"

# 6. تست با monitoring
pm2 logs saded --lines 0
# در ترمینال دیگر:
curl http://localhost:3001/
# سپس Ctrl+C در ترمینال اول
```

