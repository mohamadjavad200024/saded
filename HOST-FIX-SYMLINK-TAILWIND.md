# رفع مشکل symlink و tailwindcss

## مشکل:
`tailwindcss` نصب می‌شود اما به خاطر symlink، Next.js نمی‌تواند آن را پیدا کند.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی symlink
ls -la node_modules | head -3

# 2. بررسی tailwindcss در virtual environment
ls -la /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules/tailwindcss 2>/dev/null && echo "✓ Found in venv" || echo "✗ Not in venv"

# 3. اگر در venv نیست، نصب مستقیم در virtual environment
cd /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install tailwindcss@^3 autoprefixer --save-dev
cd /home/shop1111/public_html/saded

# 4. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found" || echo "✗ Still not found"

# 5. اگر هنوز پیدا نشد، حذف و ایجاد مجدد symlink
rm -f node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# 6. بررسی مجدد
ls -la node_modules/tailwindcss 2>/dev/null && echo "✓ Found after symlink fix" || echo "✗ Still not found"

# 7. پاک کردن cache
rm -rf .next

# 8. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## اگر هنوز مشکل داشت:

ممکن است نیاز باشد که از cPanel Node.js Selector استفاده کنید تا dependencies را به درستی نصب کند.

