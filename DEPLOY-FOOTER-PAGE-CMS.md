# دستورات Deploy سیستم مدیریت محتوای صفحات و Footer

## تغییرات انجام شده:
- ✅ افزودن تب Footer به بخش مدیریت محتوای صفحات
- ✅ ویرایش تمام بخش‌های Footer در یک رابط کاربری مینیمال
- ✅ استفاده از `PageContentEditor` به جای `UnifiedContentEditor`
- ✅ ساختار مینیمال و کاربرپسند با بخش‌های قابل باز/بسته شدن

## دستورات دریافت تغییرات در ترمینال هاست:

```bash
# 1. رفتن به دایرکتوری پروژه
cd ~/public_html/saded

# 2. دریافت آخرین تغییرات از Git
git pull origin main

# 3. نصب وابستگی‌ها (در صورت نیاز)
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
npm install

# 4. Build پروژه
npm run build

# 5. Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# 6. بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# 7. بررسی لاگ‌ها (اختیاری)
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20
```

## بخش‌های قابل ویرایش در تب Footer:

1. **درباره ساد** - عنوان، توضیحات، لینک‌های شبکه‌های اجتماعی (Instagram, Facebook, Twitter)
2. **دسترسی سریع** - عنوان و لیست لینک‌ها (با امکان افزودن/حذف)
3. **پشتیبانی** - عنوان و لیست لینک‌ها (با امکان افزودن/حذف)
4. **تماس با ما** - عنوان، تلفن، ایمیل
5. **Copyright** - متن کپی‌رایت

## نحوه استفاده:

1. رفتن به `/admin/settings`
2. بخش "مدیریت محتوای صفحات"
3. انتخاب تب "Footer"
4. باز کردن بخش‌های مورد نظر و ویرایش محتوا
5. کلیک روی "ذخیره تغییرات"

## بررسی تغییرات:

پس از deploy، می‌توانید تغییرات را بررسی کنید:

1. **بررسی API:**
   ```bash
   curl http://your-domain.com/api/settings/site-content
   ```

2. **بررسی UI:**
   - رفتن به `/admin/settings`
   - بررسی تب Footer
   - بررسی نمایش در Footer سایت

## نکات مهم:

- تمام تغییرات در دیتابیس ذخیره می‌شوند
- تغییرات بلافاصله در سایت نمایش داده می‌شوند
- رابط کاربری مینیمال و کاربرپسند است
- بخش‌ها به صورت قابل باز/بسته شدن (Collapsible) هستند


