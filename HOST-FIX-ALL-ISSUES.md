# رفع کامل تمام مشکلات Build

## مشکلات شناسایی شده:
1. `@tailwindcss/postcss` پیدا نمی‌شود (در devDependencies است)
2. `@/components/layout/header` و `footer` پیدا نمی‌شوند (مشکل path resolution)

## راه حل کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی symlink
ls -la node_modules | head -5

# 2. نصب @tailwindcss/postcss به صورت مستقیم در virtual environment
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install @tailwindcss/postcss --save-dev

# 3. بررسی نصب
ls -la node_modules/@tailwindcss 2>/dev/null || echo "Not found"

# 4. پاک کردن cache
rm -rf .next

# 5. Build با Webpack
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز خطا داد:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب تمام devDependencies
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install --include=dev

# پاک کردن cache
rm -rf .next

# Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## بررسی مسیر فایل‌ها:

```bash
# بررسی وجود فایل‌ها
ls -la components/layout/header.tsx
ls -la components/layout/footer.tsx

# بررسی tsconfig.json
cat tsconfig.json | grep paths
```

