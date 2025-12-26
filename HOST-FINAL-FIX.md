# رفع نهایی مشکلات - دستورات کامل

## مشکلات:
1. tailwindcss نصب نمی‌شود
2. Path aliases کار نمی‌کنند

## راه حل کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/nodevenv/public_html/saded/20

# 1. نصب دستی tailwindcss با npm pack
cd lib/node_modules

# دانلود و نصب tailwindcss
npm pack tailwindcss@3.4.19
tar -xzf tailwindcss-3.4.19.tgz
mv package tailwindcss
rm tailwindcss-3.4.19.tgz

# دانلود و نصب autoprefixer
npm pack autoprefixer@10.4.23
tar -xzf autoprefixer-10.4.23.tgz
mv package autoprefixer
rm autoprefixer-10.4.23.tgz

# بررسی
ls -la tailwindcss autoprefixer && echo "✓ Installed" || echo "✗ Failed"

# برگشت به venv root
cd /home/shop1111/nodevenv/public_html/saded/20

# 2. بررسی نصب
ls -la lib/node_modules/tailwindcss && echo "✓ tailwindcss installed" || echo "✗ NOT installed"
ls -la lib/node_modules/autoprefixer && echo "✓ autoprefixer installed" || echo "✗ NOT installed"

# 3. برگشت به project
cd /home/shop1111/public_html/saded

# 4. Stash تغییرات محلی package.json
git stash

# 5. Pull تغییرات جدید
git pull origin main

# 6. بررسی symlink
[ ! -L "node_modules" ] && rm -rf node_modules && ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 7. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

# 8. اگر build موفق بود، restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

## اگر npm pack کار نکرد:

```bash
# استفاده از cPanel NPM Install
# 1. به cPanel بروید
# 2. Node.js App Manager را باز کنید  
# 3. روی "Run NPM Install" کلیک کنید
# 4. بعد از نصب، دستورات بالا را برای build اجرا کنید
```

