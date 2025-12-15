# آپلود فایل‌های بیلد به صورت فشرده

## روش آسان‌تر: فشرده کردن و آپلود

### مرحله 1: فشرده کردن در محیط محلی

در محیط محلی (ویندوز PowerShell):

```powershell
# فشرده کردن پوشه .next
Compress-Archive -Path .next -DestinationPath next-build.zip -Force
```

یا در Git Bash:

```bash
# فشرده کردن پوشه .next
zip -r next-build.zip .next/
```

### مرحله 2: آپلود فایل فشرده

1. فایل `next-build.zip` را از محیط محلی به هاست آپلود کنید
2. در cPanel File Manager، فایل را به `public_html/saded/` آپلود کنید

### مرحله 3: Extract در هاست

```bash
cd ~/public_html/saded

# حذف پوشه .next قدیمی (اگر وجود دارد)
rm -rf .next

# Extract فایل فشرده
unzip -q next-build.zip

# حذف فایل فشرده
rm next-build.zip

# بررسی
ls -la .next/routes-manifest.json
ls -la .next/BUILD_ID

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

## بررسی موفقیت:

```bash
# بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20

# بررسی وضعیت
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

اگر لاگ‌ها خطایی نشان ندادند و PM2 status "online" بود، سایت باید کار کند.

