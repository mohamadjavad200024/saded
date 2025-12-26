# رفع مشکل tailwindcss - دستورات کامل

## مشکل:
- `package.json` دارای `tailwindcss: "^4"` است اما `postcss.config.js` از v3 استفاده می‌کند
- `autoprefixer` در devDependencies نیست
- npm install می‌گوید "up to date" اما tailwindcss نصب نمی‌شود

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull تغییرات جدید (package.json اصلاح شده)
git pull origin main

# 2. حذف node_modules و package-lock.json در venv
cd /home/shop1111/nodevenv/public_html/saded/20
rm -rf lib/node_modules package-lock.json

# 3. نصب مجدد همه dependencies
npm install

# 4. بررسی نصب tailwindcss
ls -la lib/node_modules/tailwindcss && echo "✓ tailwindcss installed" || echo "✗ tailwindcss NOT installed"

# 5. برگشت به project directory
cd /home/shop1111/public_html/saded

# 6. بررسی symlink
if [ ! -L "node_modules" ]; then
  rm -rf node_modules
  ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules
fi

# 7. Build
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

# 8. اگر build موفق بود، restart PM2
pm2 restart saded
pm2 logs saded --lines 50
```

## اگر npm install هنوز tailwindcss را نصب نکرد:

```bash
cd /home/shop1111/nodevenv/public_html/saded/20

# نصب مستقیم با force
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev --force --legacy-peer-deps

# بررسی
ls -la lib/node_modules/tailwindcss && echo "✓ Found" || echo "✗ Still missing"
```

