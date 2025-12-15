# راه حل سریع خطای 503 - ایجاد فایل BUILD_ID

## مشکل:
فایل `.next/BUILD_ID` وجود ندارد و PM2 نمی‌تواند پروژه را اجرا کند.

## راه حل سریع:

### روش 1: ایجاد فایل BUILD_ID دستی

```bash
cd ~/public_html/saded

# ایجاد پوشه .next اگر وجود ندارد
mkdir -p .next

# ایجاد فایل BUILD_ID با محتوای بیلد محلی
echo "c2M42uMZWduC1fETQfbZ0" > .next/BUILD_ID

# بررسی
cat .next/BUILD_ID

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

### روش 2: استفاده از اسکریپت

```bash
cd ~/public_html/saded
chmod +x CREATE-BUILD-ID.sh
./CREATE-BUILD-ID.sh
```

### روش 3: آپلود فایل BUILD_ID از محیط محلی

1. فایل `.next/BUILD_ID` را از محیط محلی بخوانید
2. محتوای آن را کپی کنید
3. در هاست ایجاد کنید:
   ```bash
   echo "محتوای_فایل" > .next/BUILD_ID
   ```

## بعد از ایجاد BUILD_ID:

```bash
# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20
```

## نکته مهم:

اگر بعد از ایجاد BUILD_ID باز هم خطا داشتید، باید فایل‌های `static` و `server` را هم از بیلد محلی آپلود کنید.

