# بررسی دسترسی از طریق Domain

## مشکل:
سایت باید از طریق `http://77191336.shop/` قابل دسترسی باشد، نه `localhost:3001`.

## بررسی:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2 (در virtual environment)
pm2 status

# 2. تست از طریق domain
curl -v http://77191336.shop/ 2>&1 | head -30

# 3. بررسی logs بعد از درخواست از domain
pm2 logs saded --lines 50 --nostream | tail -50

# 4. بررسی error logs
pm2 logs saded --lines 50 --err --nostream | tail -50

# 5. بررسی اینکه آیا reverse proxy (Apache/Nginx) تنظیم شده
# بررسی فایل .htaccess یا تنظیمات Apache
ls -la .htaccess 2>/dev/null && echo "✓ .htaccess exists" || echo "✗ .htaccess NOT found"
cat .htaccess 2>/dev/null | head -20

# 6. بررسی اینکه آیا سرور روی پورت 3001 در حال اجرا است
# (از طریق domain باید به localhost:3001 proxy شود)
```

## اگر reverse proxy تنظیم نشده:

باید `.htaccess` یا تنظیمات Apache را بررسی کنید تا درخواست‌ها به `localhost:3001` proxy شوند.

