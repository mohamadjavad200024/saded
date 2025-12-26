# تست Domain و بررسی Logs

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2
pm2 status

# 2. تست از طریق domain
curl -v http://77191336.shop/ 2>&1 | head -40

# 3. فوراً بعد از تست، بررسی logs
pm2 logs saded --lines 100 --nostream | tail -100

# 4. بررسی error logs
pm2 logs saded --lines 100 --err --nostream | tail -100

# 5. بررسی فایل log خروجی (بعد از درخواست از domain)
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -A 20 -B 5 "Error\|error\|ERROR\|Unhandled\|Exception\|15:1"

# 6. بررسی فایل log خطا
tail -100 /home/shop1111/public_html/saded/logs/pm2-error-0.log | grep -A 20 -B 5 "Error\|error\|ERROR\|Unhandled\|Exception\|15:1"

# 7. بررسی .htaccess (اگر وجود دارد)
ls -la .htaccess 2>/dev/null && cat .htaccess || echo ".htaccess not found"
```

## اگر خطا در logs نیست:

```bash
# بررسی real-time logs
pm2 logs saded --lines 0
# سپس از مرورگر یا curl به http://77191336.shop/ درخواست بدهید
# و logs را مشاهده کنید
```

