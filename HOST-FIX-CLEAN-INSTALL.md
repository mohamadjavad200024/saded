# رفع مشکل - پاک کردن cache و نصب مجدد

## مشکل:
npm فکر می‌کند که tailwindcss نصب شده اما در واقع نیست. باید cache و node_modules را پاک کنیم.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# 1. پاک کردن npm cache
npm cache clean --force

# 2. پاک کردن node_modules در venv
rm -rf lib/node_modules

# 3. پاک کردن package-lock.json (اگر وجود دارد)
rm -f package-lock.json

# 4. نصب مجدد تمام dependencies
npm install

# 5. بررسی نصب tailwindcss
ls -la lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 6. اگر پیدا نشد، نصب مستقیم
if [ ! -d "lib/node_modules/tailwindcss" ]; then
  npm install tailwindcss@^3 autoprefixer --save-dev --no-save
fi

# 7. برگشت به project directory
cd /home/shop1111/public_html/saded

# 8. ایجاد symlink
rm -f node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 9. بررسی
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found via symlink" || echo "✗ Still not found"

# 10. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

