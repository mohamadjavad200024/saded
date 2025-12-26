# بررسی خطاهای Runtime

## مشکل:
سرور راه‌اندازی شده اما "Internal Server Error" نمایش می‌دهد.

## دستورات برای بررسی:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی logs کامل PM2
pm2 logs saded --lines 50 --err

# 2. بررسی فایل log خطا
tail -50 /home/shop1111/public_html/saded/logs/pm2-error.log

# 3. بررسی فایل log خروجی
tail -50 /home/shop1111/public_html/saded/logs/pm2-out.log

# 4. تست مستقیم سرور
curl -v http://localhost:3001/

# 5. بررسی وضعیت PM2
pm2 status
pm2 describe saded

# 6. بررسی متغیرهای محیطی
pm2 env 0

# 7. بررسی اتصال به دیتابیس (اگر خطا مربوط به DB است)
# بررسی فایل .env یا متغیرهای محیطی در ecosystem.config.js
```

## اگر خطا مربوط به module resolution است:

```bash
# بررسی node_modules
ls -la node_modules/ | head -20

# بررسی symlink
ls -la node_modules | grep "^l"

# بررسی next
ls -la node_modules/next 2>/dev/null || echo "next not found"
```

## اگر خطا مربوط به database است:

```bash
# تست اتصال به MySQL
mysql -u shop1111_saded_user -p'goul77191336' -h localhost shop1111_saded -e "SELECT 1;" && echo "✓ DB connected" || echo "✗ DB connection failed"
```

