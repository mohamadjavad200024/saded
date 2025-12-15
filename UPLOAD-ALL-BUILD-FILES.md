# راهنمای کامل آپلود فایل‌های بیلد

## مشکل:
فایل `routes-manifest.json` و سایر فایل‌های ضروری بیلد وجود ندارند.

## راه حل: آپلود تمام فایل‌های بیلد از محیط محلی

### فایل‌های ضروری که باید آپلود شوند:

#### 1. فایل‌های JSON در ریشه `.next/`:
- `BUILD_ID` ✅ (قبلاً ایجاد شد)
- `routes-manifest.json` ❌ (نیاز به آپلود)
- `app-path-routes-manifest.json` ❌
- `build-manifest.json` ❌
- `export-marker.json` ❌
- `fallback-build-manifest.json` ❌
- `images-manifest.json` ❌
- `prerender-manifest.json` ❌
- `required-server-files.json` ❌
- `next-minimal-server.js.nft.json` ❌
- `next-server.js.nft.json` ❌
- `package.json` ❌

#### 2. پوشه `static/` (کل پوشه):
- `static/chunks/` (کل پوشه)
- `static/c2M42uMZWduC1fETQfbZ0/` (کل پوشه)
- `static/media/` (کل پوشه)

#### 3. پوشه `server/` (کل پوشه):
- `server/app/` (کل پوشه)
- `server/chunks/` (کل پوشه)
- `server/edge/` (کل پوشه)
- `server/middleware/` (کل پوشه)
- `server/pages/` (کل پوشه)
- تمام فایل‌های JSON در `server/`

## روش آپلود:

### روش 1: استفاده از File Manager در cPanel (توصیه می‌شود)

1. وارد cPanel شوید
2. File Manager را باز کنید
3. به مسیر `public_html/saded/.next/` بروید
4. **کل پوشه `.next` را از محیط محلی آپلود کنید** (بهترین روش)

### روش 2: استفاده از FTP/SFTP

از FileZilla استفاده کنید و کل پوشه `.next` را آپلود کنید.

### روش 3: استفاده از SCP (در Git Bash یا WSL)

```bash
# از محیط محلی
scp -r .next shop1111@linux25.centraldnserver.com:~/public_html/saded/
```

## بعد از آپلود:

```bash
cd ~/public_html/saded

# بررسی وجود فایل‌ها
ls -la .next/routes-manifest.json
ls -la .next/static/
ls -la .next/server/

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 20
```

## نکات مهم:

1. ✅ **بهترین روش**: آپلود کل پوشه `.next` از محیط محلی
2. ✅ اگر فایل‌ها بزرگ هستند، می‌توانید فشرده کنید و بعد extract کنید
3. ✅ بعد از آپلود، حتماً PM2 را restart کنید
4. ✅ اگر هنوز خطا داشتید، لاگ‌ها را بررسی کنید

