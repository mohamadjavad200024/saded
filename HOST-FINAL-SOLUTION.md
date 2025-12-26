# راه حل نهایی - بررسی و رفع مشکلات

## مشکل 1: @tailwindcss/postcss پیدا نمی‌شود

این مشکل به خاطر symlink است. باید بررسی کنیم که آیا واقعاً نصب شده:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# بررسی نصب
ls -la node_modules/@tailwindcss/postcss 2>/dev/null || echo "Not found in symlink"
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/@tailwindcss/postcss 2>/dev/null || echo "Not found in venv"

# اگر پیدا نشد، نصب مجدد
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install @tailwindcss/postcss tailwindcss --save-dev

# بررسی مجدد
ls -la node_modules/@tailwindcss 2>/dev/null
```

## مشکل 2: Path resolution برای @/components

```bash
# بررسی وجود فایل‌ها
ls -la components/layout/header.tsx
ls -la components/layout/footer.tsx

# بررسی tsconfig.json
cat tsconfig.json | grep -A 2 paths
```

## راه حل کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب مجدد تمام devDependencies
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install --include=dev

# 2. بررسی symlink
ls -la node_modules | head -3

# 3. Pull تغییرات (next.config.js به‌روز شده)
git pull origin main

# 4. پاک کردن cache
rm -rf .next

# 5. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز مشکل داشت:

ممکن است نیاز باشد که postcss.config.mjs را تغییر دهیم یا از روش دیگری استفاده کنیم.

