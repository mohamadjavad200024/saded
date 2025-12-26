# بررسی خطاهای فعلی Runtime

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی logs جدید (بعد از 18:40)
pm2 logs saded --lines 50 --nostream | tail -50

# 2. بررسی فایل log خطا (آخرین خطوط)
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log | grep -A 10 "18:4"

# 3. تست مستقیم سرور و مشاهده خطا
curl -v http://localhost:3001/ 2>&1

# 4. بعد از تست، بررسی logs جدید
pm2 logs saded --lines 20

# 5. بررسی وضعیت PM2
pm2 status
pm2 describe saded

# 6. بررسی اینکه آیا سرور واقعاً در حال اجرا است
netstat -tlnp | grep 3001 || ss -tlnp | grep 3001

# 7. بررسی متغیرهای محیطی
pm2 env 0 | grep -E "DB_|NODE_ENV|PORT|HOSTNAME"
```

## اگر خطا مربوط به runtime است:

```bash
# بررسی خطاهای runtime در console
# بعد از بازدید از سایت، این دستور را اجرا کنید:
pm2 logs saded --lines 30 --nostream
```

