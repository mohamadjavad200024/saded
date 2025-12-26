# دستورات Commit و Push

## برای commit و push تغییرات:

در terminal محلی (PowerShell یا CMD) در مسیر پروژه اجرا کنید:

```bash
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
git add package.json
git commit -m "Fix: Update tailwindcss to v3.4.19 and add autoprefixer - compatible with postcss.config.js"
git push origin main
```

یا می‌توانید از Git GUI استفاده کنید.

## بعد از push، در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull تغییرات جدید
git pull origin main

# 2. کپی package.json به venv (مهم!)
cp package.json /home/shop1111/nodevenv/public_html/saded/20/package.json

# 3. حذف node_modules و package-lock.json در venv
cd /home/shop1111/nodevenv/public_html/saded/20
rm -rf lib/node_modules package-lock.json

# 4. نصب مجدد همه dependencies
npm install

# 5. بررسی نصب tailwindcss
ls -la lib/node_modules/tailwindcss && echo "✓ tailwindcss installed" || echo "✗ tailwindcss NOT installed"

# 6. اگر هنوز پیدا نشد، نصب اجباری
if [ ! -d "lib/node_modules/tailwindcss" ]; then
  npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force --legacy-peer-deps
fi

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

# 10. اگر build موفق بود، restart PM2
pm2 restart saded
pm2 logs saded --lines 20
```

