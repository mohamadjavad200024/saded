# بررسی سرور و Proxy Configuration

## مشکل احتمالی:
- SSL تنظیم نشده
- Proxy (Apache/Nginx) به درستی پیکربندی نشده
- سرور Node.js در حال listen نیست

## دستورات بررسی:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2
pm2 status saded
pm2 info saded

# 2. بررسی اینکه سرور روی پورت 3001 listen می‌کند
echo "=== Checking port 3001 ==="
netstat -tlnp 2>/dev/null | grep 3001 || ss -tlnp 2>/dev/null | grep 3001

# 3. بررسی process
echo "=== Checking Node.js process ==="
ps aux | grep "node server.js" | grep -v grep

# 4. تست مستقیم به localhost:3001 (بدون proxy)
echo "=== Testing direct connection to localhost:3001 ==="
curl -v http://localhost:3001/ 2>&1 | head -40

# 5. تست به 127.0.0.1:3001
echo "=== Testing 127.0.0.1:3001 ==="
curl -v http://127.0.0.1:3001/ 2>&1 | head -40

# 6. بررسی logs برای connection events
echo "=== Checking for connection events in logs ==="
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "DEBUG|connection|listening|Request"

# 7. بررسی Apache/Nginx configuration (اگر دسترسی دارید)
echo "=== Checking Apache config (if accessible) ==="
# معمولاً در cPanel این فایل‌ها هستند:
# /etc/apache2/conf.d/userdata/std/2/shop1111/saded.conf
# یا
# /home/shop1111/public_html/.htaccess
# یا
# /usr/local/apache/conf/userdata/std/2/shop1111/saded.conf

# 8. بررسی .htaccess در public_html
echo "=== Checking .htaccess ==="
cat /home/shop1111/public_html/.htaccess 2>/dev/null | grep -i "proxy\|rewrite\|301\|302" || echo "No .htaccess or no proxy rules found"

# 9. بررسی cPanel Node.js App configuration
echo "=== Checking if cPanel Node.js App is configured ==="
# در cPanel باید بررسی کنید:
# - Node.js App در cPanel ایجاد شده باشد
# - Application URL صحیح باشد
# - Application Root: /home/shop1111/public_html/saded
# - Application Startup File: server.js
# - Application URL: http://77191336.shop:3001 یا http://77191336.shop

# 10. تست با telnet (اگر نصب باشد)
echo "=== Testing port connectivity with telnet ==="
timeout 2 bash -c "</dev/tcp/localhost/3001" && echo "Port 3001 is open" || echo "Port 3001 is closed or unreachable"

# 11. بررسی firewall (اگر دسترسی دارید)
echo "=== Checking firewall rules (if accessible) ==="
# معمولاً در cPanel این دسترسی ندارید، اما می‌توانید تست کنید

# 12. بررسی logs بعد از تست
echo "=== Full recent logs ==="
tail -100 /home/shop1111/public_html/saded/logs/pm2-out-0.log
```

## نکات مهم:

1. **اگر `curl localhost:3001` کار می‌کند:**
   - سرور Node.js درست کار می‌کند
   - مشکل از proxy/routing است
   - باید cPanel Node.js App را بررسی کنید

2. **اگر `curl localhost:3001` کار نمی‌کند:**
   - سرور Node.js مشکل دارد
   - باید logs را بررسی کنید
   - ممکن است port درست listen نشده باشد

3. **برای SSL:**
   - در cPanel: SSL/TLS Status → Manage SSL sites
   - یا Let's Encrypt SSL → Install
   - بعد از نصب SSL، باید proxy configuration را بررسی کنید

4. **cPanel Node.js App Configuration:**
   - Application URL باید: `http://77191336.shop` یا `http://77191336.shop:3001`
   - Application Root: `/home/shop1111/public_html/saded`
   - Application Startup File: `server.js`
   - Application Mode: `Production`

