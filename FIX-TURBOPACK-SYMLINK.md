# رفع مشکل Turbopack با Symlink

## مشکل
```
Error [TurbopackInternalError]: Symlink node_modules is invalid, it points out of the filesystem root
```

## علت
Turbopack نمی‌تواند با symlink های node_modules کار کند. وقتی node_modules به virtual environment لینک شده باشد، Turbopack خطا می‌دهد.

## راه حل

### روش 1: استفاده از Webpack (توصیه می‌شود)

دستور build را با flag `--webpack` اجرا کنید:

```bash
NODE_OPTIONS='--max-old-space-size=2048' npm run build -- --webpack
```

یا از script موجود استفاده کنید:

```bash
npm run build:low-resource
```

### روش 2: تغییر build script (دائمی)

در `package.json`، script `build` را تغییر دهید:

```json
"build": "next build --webpack"
```

### روش 3: کپی کردن node_modules (اگر symlink مشکل دارد)

```bash
# حذف symlink
rm -rf node_modules

# کپی کردن از venv
cp -r /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# Build
npm run build
```

## دستورات کامل برای رفع مشکل

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با webpack
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npm run build -- --webpack

# یا
npm run build:low-resource

# راه‌اندازی
npm start
```

## نکته مهم

در `server.js` و `next.config.js` قبلاً Turbopack disable شده است، اما در build command باید flag `--webpack` را اضافه کنید.

