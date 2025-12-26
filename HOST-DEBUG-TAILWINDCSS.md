# Debug و رفع مشکل tailwindcss

## مشکل:
npm install می‌گوید "up to date" اما tailwindcss نصب نمی‌شود.

## راه حل - بررسی و نصب دستی:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# 1. بررسی package.json در venv
cat package.json | grep -A 2 "tailwindcss"

# 2. بررسی npm cache
npm cache clean --force

# 3. حذف package-lock.json
rm -f package-lock.json

# 4. نصب مستقیم با npm pack (روش دستی)
cd lib/node_modules

# دانلود tailwindcss
npm pack tailwindcss@3.4.19
tar -xzf tailwindcss-3.4.19.tgz
mv package tailwindcss
rm tailwindcss-3.4.19.tgz

# دانلود autoprefixer
npm pack autoprefixer@10.4.23
tar -xzf autoprefixer-10.4.23.tgz
mv package autoprefixer
rm autoprefixer-10.4.23.tgz

# بررسی
ls -la tailwindcss autoprefixer

# برگشت به venv root
cd /home/shop1111/nodevenv/public_html/saded/20

# 5. بررسی نصب
ls -la lib/node_modules/tailwindcss && echo "✓ tailwindcss installed" || echo "✗ NOT installed"
ls -la lib/node_modules/autoprefixer && echo "✓ autoprefixer installed" || echo "✗ NOT installed"

# 6. برگشت به project
cd /home/shop1111/public_html/saded

# 7. بررسی symlink
[ ! -L "node_modules" ] && rm -rf node_modules && ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 8. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر npm pack کار نکرد - استفاده از cPanel:

1. به cPanel بروید
2. Node.js App Manager را باز کنید
3. روی "Run NPM Install" کلیک کنید
4. بعد از نصب، دستورات بالا را برای build اجرا کنید

