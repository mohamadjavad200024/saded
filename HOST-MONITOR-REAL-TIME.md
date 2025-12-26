# Monitor Real-time Logs

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. شروع monitoring real-time
pm2 logs saded --lines 0
# (این دستور را نگه دارید و در ترمینال دیگر یا بعد از Ctrl+C ادامه دهید)

# 2. در ترمینال دیگر یا بعد از Ctrl+C:
curl http://77191336.shop/

# 3. بررسی logs جدید (بعد از درخواست)
pm2 logs saded --lines 100 --nostream | grep -A 10 -B 5 "19:1\|Request\|Response\|Error\|error\|ERROR"

# 4. بررسی فایل log خروجی (آخرین خطوط)
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log

# 5. بررسی فایل log خطا (آخرین خطوط)
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log

# 6. تست مجدد و فوراً بررسی logs
curl http://77191336.shop/ > /dev/null 2>&1 && sleep 2 && tail -30 /home/shop1111/public_html/saded/logs/pm2-out-0.log
```

