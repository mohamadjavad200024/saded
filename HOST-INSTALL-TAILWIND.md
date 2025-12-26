# نصب tailwindcss و رفع مشکلات

## دستورات کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. نصب tailwindcss v3
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install tailwindcss@^3 --save-dev

# 2. بررسی نصب
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ tailwindcss found" || echo "✗ tailwindcss not found"

# 3. بررسی autoprefixer
ls -la node_modules/autoprefixer 2>/dev/null && echo "✓ autoprefixer found" || echo "✗ autoprefixer not found"

# 4. اگر پیدا نشدند، نصب مجدد
if [ ! -d "node_modules/tailwindcss" ] || [ ! -d "node_modules/autoprefixer" ]; then
  /home/shop1111/nodevenv/public_html/saded/20/bin/npm install tailwindcss@^3 autoprefixer --save-dev
fi

# 5. بررسی postcss.config.js
cat postcss.config.js

# 6. پاک کردن cache
rm -rf .next

# 7. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز خطا داد - بررسی symlink:

```bash
# بررسی symlink
ls -la node_modules | head -3

# بررسی tailwindcss در virtual environment
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null || echo "Not in venv"

# اگر در venv نیست، نصب مستقیم
cd /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install tailwindcss@^3 autoprefixer --save-dev
cd /home/shop1111/public_html/saded
```

