# دستورات نهایی - رفع کامل مشکلات

## مشکل:
- `postcss.config.js` هنوز push نشده
- Path aliases کار نمی‌کنند

## دستورات کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull تغییرات جدید (postcss.config.js)
git pull origin main

# 2. بررسی فایل postcss.config.js
cat postcss.config.js

# 3. اگر هنوز @tailwindcss/postcss دارد، دستی تغییر دهید:
# فایل postcss.config.js باید این باشد:
# module.exports = {
#   plugins: {
#     tailwindcss: {},
#     autoprefixer: {},
#   },
# };

# 4. نصب autoprefixer (اگر نصب نشده)
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install autoprefixer --save-dev

# 5. پاک کردن cache
rm -rf .next

# 6. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز خطا داد - تغییر دستی postcss.config.js:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# ایجاد فایل postcss.config.js دستی
cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# نصب autoprefixer
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install autoprefixer --save-dev

# Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

