# نصب اجباری tailwindcss - دستورات کامل

## مشکل:
npm install می‌گوید "added 167 packages" اما tailwindcss نصب نمی‌شود.

## راه حل - نصب اجباری:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# 1. بررسی package.json
cat package.json | grep -A 5 "devDependencies"

# 2. نصب مستقیم با force و --legacy-peer-deps
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force --legacy-peer-deps

# 3. بررسی نصب
ls -la lib/node_modules/tailwindcss && echo "✓ Found" || echo "✗ Still missing"

# 4. اگر هنوز پیدا نشد، بررسی package-lock.json
if [ -f "package-lock.json" ]; then
  echo "package-lock.json exists"
  grep -i tailwindcss package-lock.json | head -5
fi

# 5. اگر هنوز پیدا نشد، حذف package-lock.json و نصب مجدد
if [ ! -d "lib/node_modules/tailwindcss" ]; then
  echo "Removing package-lock.json and reinstalling..."
  rm -f package-lock.json
  npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --legacy-peer-deps
fi

# 6. بررسی مجدد
ls -la lib/node_modules/tailwindcss && echo "✓ tailwindcss installed" || echo "✗ tailwindcss NOT installed"
ls -la lib/node_modules/autoprefixer && echo "✓ autoprefixer installed" || echo "✗ autoprefixer NOT installed"

# 7. برگشت به project directory
cd /home/shop1111/public_html/saded

# 8. بررسی symlink
if [ ! -L "node_modules" ]; then
  rm -rf node_modules
  ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules
fi

# 9. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز کار نکرد - نصب دستی:

```bash
cd /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules

# دانلود مستقیم tailwindcss
npm pack tailwindcss@3.4.19
tar -xzf tailwindcss-3.4.19.tgz
mv package tailwindcss
rm tailwindcss-3.4.19.tgz

# دانلود مستقیم autoprefixer
npm pack autoprefixer@10.4.23
tar -xzf autoprefixer-10.4.23.tgz
mv package autoprefixer
rm autoprefixer-10.4.23.tgz

# بررسی
ls -la tailwindcss autoprefixer
```

