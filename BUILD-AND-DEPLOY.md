# راهنمای بیلد و Deploy با Git

این راهنما توضیح می‌دهد چگونه بعد از بیلد کردن پروژه Next.js، تغییرات را به Git commit و push کنید و سپس در هاست pull کنید.

## 📋 مراحل کار

### 1️⃣ بیلد و Push در محیط محلی

#### در ویندوز:
```bash
commit-next.bat
```

#### در Linux/Mac:
```bash
chmod +x commit-next.sh
./commit-next.sh
```

این اسکریپت:
- ✅ پروژه را بیلد می‌کند (`npm run build`)
- ✅ فایل‌های `.next` را به Git اضافه می‌کند
- ✅ تغییرات را commit می‌کند
- ✅ به صورت خودکار به Git push می‌کند

### 2️⃣ Pull در هاست

بعد از push موفق در محیط محلی، در هاست اجرا کنید:

```bash
cd ~/public_html/saded
chmod +x HOST-PULL-BUILD.sh
./HOST-PULL-BUILD.sh
```

یا به صورت دستی:

```bash
cd ~/public_html/saded
git pull origin main  # یا نام branch شما
```

### 3️⃣ Restart PM2 (در صورت نیاز)

اگر PM2 به صورت خودکار restart نشد:

```bash
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

## 🔧 تنظیمات Git

### اضافه کردن فایل‌های .next به Git

فایل‌های `.next` باید در Git track شوند. مطمئن شوید که `.gitignore` به این صورت تنظیم شده:

```
# next.js
# Ignore cache, dev, and diagnostic files but allow essential build files
/.next/cache/
/.next/dev/
/.next/diagnostics/
/.next/trace
/.next/trace-build
/.next/turbopack/
```

**نکته:** فولدرهای `.next/server/` و `.next/static/` و فایل `BUILD_ID` باید در Git باشند.

## ⚠️ نکات مهم

1. **همیشه قبل از push بررسی کنید:** مطمئن شوید که بیلد موفق بوده است
2. **Branch را بررسی کنید:** اسکریپت به صورت خودکار branch فعلی را تشخیص می‌دهد
3. **در هاست:** بعد از pull، PM2 به صورت خودکار restart می‌شود
4. **مشکلات:** اگر pull در هاست مشکل داشت، از `GIT-PULL-SAFE.sh` استفاده کنید

## 🚨 حل مشکلات

### مشکل: Push failed
```bash
# بررسی remote
git remote -v

# بررسی branch
git branch --show-current

# Push دستی
git push origin <branch-name>
```

### مشکل: Pull failed در هاست
```bash
# استفاده از اسکریپت ایمن
./GIT-PULL-SAFE.sh

# یا reset
git reset --hard origin/main
```

### مشکل: فایل‌های .next در Git نیستند
```bash
# اضافه کردن دستی
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git commit -m "Add .next build files"
git push origin main
```

## 📝 مثال کامل

```bash
# 1. در محیط محلی
./commit-next.sh

# 2. در هاست (SSH)
cd ~/public_html/saded
./HOST-PULL-BUILD.sh

# 3. بررسی
pm2 status
pm2 logs saded --lines 50
```


