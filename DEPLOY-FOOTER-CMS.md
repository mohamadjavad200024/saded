# دستورات دریافت تغییرات سیستم مدیریت محتوای Footer در هاست

## تغییرات انجام شده:
- ✅ تکمیل سیستم مدیریت محتوای Footer
- ✅ افزودن اعتبارسنجی کامل (Frontend + Backend)
- ✅ بهبود UI/UX با placeholderها و راهنماها
- ✅ ایجاد API endpoint برای مدیریت محتوا

## دستورات دریافت تغییرات در ترمینال هاست:

### 1. اتصال به سرور (SSH)
```bash
ssh username@your-server-ip
```

### 2. رفتن به دایرکتوری پروژه
```bash
cd /path/to/your/project
# مثال: cd /var/www/saded
```

### 3. دریافت آخرین تغییرات از Git
```bash
git pull origin main
```

### 4. نصب وابستگی‌های جدید (در صورت نیاز)
```bash
npm install
# یا
yarn install
```

### 5. Build پروژه (Next.js)
```bash
npm run build
# یا
yarn build
```

### 6. Restart سرویس (بسته به نوع deployment)

#### اگر از PM2 استفاده می‌کنید (نام app: saded):
```bash
pm2 restart saded
# یا
pm2 restart ecosystem.config.js
# یا
pm2 restart all
```

#### اگر از systemd استفاده می‌کنید:
```bash
sudo systemctl restart your-service-name
```

#### اگر از Docker استفاده می‌کنید:
```bash
docker-compose restart
# یا
docker-compose up -d --build
```

#### اگر مستقیماً Next.js را اجرا می‌کنید:
```bash
# متوقف کردن پروسه فعلی (Ctrl+C)
# سپس اجرای مجدد:
npm run start
# یا
yarn start
```

## دستورات یکجا (Copy & Paste):

```bash
# رفتن به دایرکتوری پروژه (بر اساس ecosystem.config.js)
cd /home/shop1111/public_html/saded

# دریافت تغییرات
git pull origin main

# نصب وابستگی‌ها (در صورت نیاز)
npm install

# Build پروژه
npm run build

# Restart با PM2 (نام app: saded)
pm2 restart saded

# یا استفاده از ecosystem.config.js
pm2 restart ecosystem.config.js
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

- ⚠️ قبل از pull، از دیتابیس backup بگیرید
- ⚠️ اگر تغییرات schema دیتابیس دارید، migration را اجرا کنید
- ⚠️ در production، حتماً از `npm run build` استفاده کنید
- ⚠️ بعد از deploy، لاگ‌ها را بررسی کنید

## در صورت بروز مشکل:

```bash
# بررسی لاگ‌های PM2
pm2 logs

# بررسی وضعیت PM2
pm2 status

# بررسی لاگ‌های Next.js
tail -f .next/server.log
```

