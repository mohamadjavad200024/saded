# دستورات Deploy سیستم مدیریت محتوای صفحات

## تغییرات انجام شده:
- ✅ ایجاد سیستم مدیریت محتوای جامع برای همه صفحات
- ✅ API endpoint: `/api/settings/page-content`
- ✅ کامپوننت UI: `PageContentEditor` با Tab برای ویرایش همه صفحات
- ✅ به‌روزرسانی صفحات: about, faq, shipping, returns, warranty, contact

## دستورات دریافت تغییرات در ترمینال هاست:

```bash
# 1. رفتن به دایرکتوری پروژه
cd ~/public_html/saded

# 2. دریافت آخرین تغییرات از Git
git pull origin main

# 3. Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# 4. بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# 5. بررسی لاگ‌ها (اختیاری)
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20
```

## صفحات قابل ویرایش:

1. **درباره ما** (`/about`) - ویرایش متن
2. **سوالات متداول** (`/faq`) - مدیریت سوال و جواب
3. **ارسال و تحویل** (`/shipping`) - ویرایش متن
4. **بازگشت کالا** (`/returns`) - ویرایش متن
5. **گارانتی** (`/warranty`) - ویرایش متن
6. **تماس با ما** (`/contact`) - ویرایش اطلاعات تماس

## نحوه استفاده:

1. رفتن به `/admin/settings`
2. بخش "مدیریت محتوای صفحات"
3. انتخاب تب صفحه مورد نظر
4. ویرایش محتوا
5. کلیک روی "ذخیره تغییرات"

## بررسی تغییرات:

پس از deploy، می‌توانید تغییرات را بررسی کنید:

1. **بررسی API:**
   ```bash
   curl http://your-domain.com/api/settings/page-content?page=about
   ```

2. **بررسی صفحه ادمین:**
   - رفتن به: `http://your-domain.com/admin/settings`
   - بخش "مدیریت محتوای صفحات" باید نمایش داده شود

3. **بررسی صفحات سایت:**
   - `/about` - باید محتوای جدید را نمایش دهد
   - `/faq` - باید سوالات و پاسخ‌های جدید را نمایش دهد
   - `/contact` - باید اطلاعات تماس جدید را نمایش دهد

## فایل‌های تغییر یافته:

- `app/api/settings/page-content/route.ts` (جدید)
- `components/admin/page-content-editor.tsx` (جدید)
- `app/admin/settings/page.tsx` (به‌روزرسانی)
- `app/faq/page.tsx` (به‌روزرسانی)
- `app/shipping/page.tsx` (به‌روزرسانی)
- `app/returns/page.tsx` (به‌روزرسانی)
- `app/warranty/page.tsx` (به‌روزرسانی)
- `app/contact/page.tsx` (به‌روزرسانی)

## نکات مهم:

- ⚠️ فایل‌های build شده در `.next/` commit شده‌اند
- ⚠️ نیازی به `npm install` یا `npm run build` نیست
- ⚠️ فقط `git pull` و `pm2 restart` کافی است
- ✅ همه صفحات اکنون از دیتابیس محتوا را دریافت می‌کنند

