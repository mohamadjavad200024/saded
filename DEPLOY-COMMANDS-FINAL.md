# دستورات نهایی Deploy سیستم مدیریت محتوای Footer

## دستورات سریع (Copy & Paste):

```bash
cd ~/public_html/saded

# دریافت تغییرات
git pull origin main

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

## استفاده از اسکریپت (توصیه می‌شود):

```bash
# دادن دسترسی اجرا
chmod +x deploy-footer-cms.sh

# اجرای اسکریپت
./deploy-footer-cms.sh
```

## بررسی وضعیت و لاگ‌ها:

```bash
# تنظیم PATH
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH

# بررسی وضعیت
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# نمایش لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50

# نمایش لاگ‌های خطا
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --err --lines 50

# نمایش اطلاعات کامل
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 show saded
```

## در صورت بروز مشکل:

```bash
# بررسی لاگ‌های فایل
tail -50 ~/public_html/saded/logs/pm2-out-0.log
tail -50 ~/public_html/saded/logs/pm2-error-0.log

# بررسی process
ps aux | grep node | grep saded

# Restart کامل
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# یا stop و start مجدد
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 stop saded
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 start saded
```

## بررسی تغییرات:

پس از deploy، می‌توانید تغییرات را بررسی کنید:

1. **بررسی API:**
   ```bash
   curl http://your-domain.com/api/settings/site-content
   ```

2. **بررسی صفحه ادمین:**
   - رفتن به: `http://your-domain.com/admin/settings`
   - بخش "محتوای Footer" باید نمایش داده شود

3. **بررسی Footer سایت:**
   - رفتن به صفحه اصلی سایت
   - Footer باید محتوای جدید را نمایش دهد

## نکات مهم:

- ✅ دستورات شما کاملاً صحیح است
- ✅ استفاده از `--update-env` برای به‌روزرسانی متغیرهای محیطی خوب است
- ✅ `sleep 3` برای اطمینان از restart کامل مفید است
- ⚠️ در صورت نیاز به build، می‌توانید `npm run build` را قبل از restart اضافه کنید

