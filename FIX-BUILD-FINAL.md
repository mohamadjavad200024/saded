# راه حل نهایی برای مشکل Build

## مشکلات:
1. `tailwindcss` پیدا نمی‌شود (حتی بعد از نصب)
2. Path alias `@/components/layout/header` و `footer` resolve نمی‌شوند

## راه حل:

### مرحله 1: بررسی نصب tailwindcss

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# بررسی نصب tailwindcss
ls -la lib/node_modules/tailwindcss

# اگر نصب نشده:
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force
```

### مرحله 2: بررسی symlink

```bash
cd /home/shop1111/public_html/saded

# بررسی symlink
ls -la node_modules | head -3

# اگر symlink نیست:
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# بررسی tailwindcss از طریق symlink
ls -la node_modules/tailwindcss
```

### مرحله 3: Pull تغییرات (next.config.js به‌روز شده)

```bash
cd /home/shop1111/public_html/saded
git pull origin main
```

### مرحله 4: Build

```bash
export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز خطا داد:

### گزینه 1: نصب مستقیم tailwindcss در پروژه (بدون symlink)

```bash
cd /home/shop1111/public_html/saded
rm -rf node_modules
cp -r /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# Build
export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

### گزینه 2: استفاده از NODE_PATH

```bash
export NODE_PATH=/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules
export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## تغییرات انجام شده:

1. ✅ `next.config.js` - اضافه شدن modules resolution paths
2. ✅ `next.config.js` - بهبود path alias resolution

