# راهنمای تنظیم SSL و تست سرور

## مرحله 1: تست سرور (بدون SSL)

**اول باید مطمئن شویم سرور Node.js کار می‌کند:**

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2
pm2 status saded

# 2. بررسی پورت 3001
netstat -tlnp 2>/dev/null | grep 3001 || ss -tlnp 2>/dev/null | grep 3001

# 3. تست مستقیم به localhost:3001
curl -v http://localhost:3001/ 2>&1 | head -40

# 4. بررسی logs
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "DEBUG|connection|listening|Request"
```

**اگر `curl localhost:3001` کار کرد:** سرور درست است، مشکل از proxy/routing است.
**اگر کار نکرد:** باید سرور را بررسی کنیم.

---

## مرحله 2: تنظیم SSL در cPanel

### گزینه 1: استفاده از Let's Encrypt (رایگان و توصیه می‌شود)

1. در cPanel: **SSL/TLS Status** → **Manage SSL sites**
2. دامنه `77191336.shop` را انتخاب کنید
3. روی **Run AutoSSL** کلیک کنید (اگر موجود باشد)
4. یا **Let's Encrypt SSL** → **Install** → دامنه را انتخاب کنید

### گزینه 2: نصب دستی SSL

1. **SSL/TLS Manager** → **Private Keys (KEY)**
   - **Generate a New Private Key**
   - Key Name: `77191336.shop`
   - Key Size: `2048` (پیش‌فرض)
   - Generate

2. **Certificate Signing Requests (CSR)**
   - **Generate a New Certificate Signing Request**
   - Domain: `77191336.shop`
   - City: شهر شما
   - State: استان شما
   - Country: `IR` (ایران)
   - Email: ایمیل شما
   - Generate

3. **Certificates (CRT)**
   - می‌توانید از Let's Encrypt استفاده کنید یا یک certificate خریداری کنید
   - برای Let's Encrypt: **Let's Encrypt SSL** → **Install**

4. **Install and Manage SSL for your site (HTTPS)**
   - دامنه `77191336.shop` را انتخاب کنید
   - Certificate را انتخاب کنید
   - Private Key را انتخاب کنید
   - **Install Certificate**

---

## مرحله 3: پیکربندی cPanel Node.js App

بعد از نصب SSL:

1. **Node.js Selector** در cPanel
2. Application را پیدا کنید (یا ایجاد کنید)
3. تنظیمات:
   - **Application Root:** `/home/shop1111/public_html/saded`
   - **Application URL:** `https://77191336.shop` (یا `http://77191336.shop`)
   - **Application Startup File:** `server.js`
   - **Application Mode:** `Production`
   - **Node.js Version:** `20` (یا نسخه‌ای که نصب دارید)

4. **Restart App** را بزنید

---

## مرحله 4: بررسی Proxy Configuration

cPanel معمولاً به صورت خودکار proxy را تنظیم می‌کند، اما می‌توانید بررسی کنید:

```bash
# بررسی .htaccess
cat /home/shop1111/public_html/.htaccess 2>/dev/null

# بررسی Apache config (اگر دسترسی دارید)
# معمولاً در:
# /etc/apache2/conf.d/userdata/std/2/shop1111/saded.conf
# یا
# /usr/local/apache/conf/userdata/std/2/shop1111/saded.conf
```

---

## مرحله 5: تست نهایی

```bash
# 1. تست HTTP (اگر هنوز redirect نشده)
curl -v http://77191336.shop/ 2>&1 | head -40

# 2. تست HTTPS
curl -v https://77191336.shop/ 2>&1 | head -40

# 3. بررسی logs
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "Request|Response|Error"
```

---

## نکات مهم:

1. **بعد از نصب SSL:** ممکن است نیاز باشد PM2 را restart کنید:
   ```bash
   pm2 restart saded
   ```

2. **اگر HTTPS کار نمی‌کند:**
   - بررسی کنید که certificate به درستی نصب شده
   - بررسی کنید که cPanel Node.js App به درستی پیکربندی شده
   - بررسی کنید که port 3001 باز است

3. **اگر هنوز Internal Server Error می‌دهد:**
   - باید logs را بررسی کنیم
   - ممکن است مشکل از کد باشد نه SSL

---

## اولویت:

**اول:** تست سرور با `curl localhost:3001` (بدون SSL)
**بعد:** اگر کار کرد، SSL را تنظیم کنید
**در آخر:** تست از طریق domain با HTTPS

