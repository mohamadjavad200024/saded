# 📤 راهنمای آپلود فولدرهای Next.js به هاست

## مشکل
خطای `Failed to load chunk /_next/static/chunks/bfaaa57470bc0270.js` به این دلیل است که فولدر `.next/static` به هاست آپلود نشده است.

## راه حل

### مرحله 1: Build روی کامپیوتر محلی

```bash
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
npm run build
```

### مرحله 2: آپلود فولدرهای مورد نیاز به هاست

بعد از build موفق، باید **3 فولدر** را به هاست آپلود کنید:

#### ✅ فولدر 1: `.next/server`
**مسیر روی هاست:** `~/public_html/saded/.next/server`

این فولدر شامل کدهای server-side است و برای API routes و SSR ضروری است.

#### ✅ فولدر 2: `.next/static`
**مسیر روی هاست:** `~/public_html/saded/.next/static`

این فولدر شامل:
- JavaScript chunks (`chunks/`)
- CSS files
- Media files (fonts, images)
- Build manifests

**⚠️ این فولدر برای رفع خطای 404 chunk loading ضروری است!**

#### ✅ فولدر 3: `.next` (فایل‌های root)
**مسیر روی هاست:** `~/public_html/saded/.next/`

فایل‌های root در `.next/`:
- `BUILD_ID`
- `routes-manifest.json`
- `prerender-manifest.json`
- `build-manifest.json`
- و سایر فایل‌های manifest

### مرحله 3: بررسی ساختار روی هاست

بعد از آپلود، ساختار باید به این صورت باشد:

```
~/public_html/saded/
├── .next/
│   ├── BUILD_ID
│   ├── routes-manifest.json
│   ├── build-manifest.json
│   ├── prerender-manifest.json
│   ├── server/
│   │   ├── app/
│   │   ├── chunks/
│   │   └── ...
│   └── static/
│       ├── chunks/
│       ├── media/
│       └── ...
├── app/
├── lib/
├── server.js
└── ...
```

### مرحله 4: Restart PM2

```bash
cd ~/public_html/saded
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded --update-env
```

### مرحله 5: تست

بعد از آپلود و restart، مرورگر را refresh کنید (Ctrl+Shift+R برای hard refresh).

خطاهای `inpage.js` مربوط به extension های مرورگر (مثل MetaMask) هستند و مشکل اصلی نیستند.

## نکات مهم

1. ✅ فولدر `.next/static` **باید** آپلود شود - بدون آن chunk loading کار نمی‌کند
2. ✅ فولدر `.next/server` **باید** آپلود شود - بدون آن API routes کار نمی‌کنند
3. ✅ فایل‌های root در `.next/` **باید** آپلود شوند
4. ⚠️ بعد از آپلود، حتماً PM2 را restart کنید
5. ⚠️ برای تست، از hard refresh استفاده کنید (Ctrl+Shift+R)

## اگر هنوز خطا دارید

1. بررسی کنید که فولدر `.next/static/chunks/bfaaa57470bc0270.js` روی هاست وجود دارد
2. بررسی کنید که Next.js می‌تواند static files را serve کند
3. لاگ‌های PM2 را بررسی کنید:
   ```bash
   /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50 --err
   ```

