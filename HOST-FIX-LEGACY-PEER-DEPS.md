# رفع مشکل - نصب با --legacy-peer-deps

## مشکل:
npm install می‌گوید "up to date" اما tailwindcss نصب نمی‌شود. احتمالاً به خاطر peer dependency conflict است.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# 1. نصب با --legacy-peer-deps
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps

# 2. بررسی نصب
ls -la lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 3. اگر پیدا نشد، نصب با --no-save
if [ ! -d "lib/node_modules/tailwindcss" ]; then
  npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --no-save --legacy-peer-deps
fi

# 4. بررسی مجدد
ls -la lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 5. اگر هنوز پیدا نشد، بررسی dependency conflict
npm ls tailwindcss 2>&1 | head -20

# 6. برگشت به project directory
cd /home/shop1111/public_html/saded

# 7. ایجاد symlink
rm -f node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 8. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز کار نکرد:

```bash
# نصب مستقیم بدون dependency resolution
cd /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --no-save --legacy-peer-deps
cd /home/shop1111/public_html/saded
```

