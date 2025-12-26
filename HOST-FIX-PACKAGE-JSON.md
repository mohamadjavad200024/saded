# رفع مشکل - کپی package.json به virtual environment

## مشکل شناسایی شده:
npm install به package.json در project directory نگاه می‌کند اما packages را در virtual environment نصب می‌کند. چون package.json در virtual environment نیست، npm نمی‌داند که باید tailwindcss را نصب کند.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. کپی package.json به virtual environment
cp package.json /home/shop1111/nodevenv/public_html/saded/20/

# 2. رفتن به virtual environment
cd /home/shop1111/nodevenv/public_html/saded/20

# 3. نصب dependencies
npm install

# 4. برگشت به project directory
cd /home/shop1111/public_html/saded

# 5. بررسی نصب
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 6. اگر پیدا شد، symlink را دوباره ایجاد کنید
rm -f node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 7. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found via symlink" || echo "✗ Still not found"

# 8. پاک کردن cache
rm -rf .next

# 9. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## یا استفاده از --prefix:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب با --prefix
npm install --prefix /home/shop1111/nodevenv/public_html/saded/20 tailwindcss@^3 autoprefixer --save-dev
```

