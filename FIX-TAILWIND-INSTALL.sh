#!/bin/bash
# نصب tailwindcss در virtual environment و آپدیت next.config.js

echo "=== نصب tailwindcss در virtual environment ==="

# فعال کردن virtual environment
source /home/shop1111/nodevenv/repositories/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/repositories/saded

echo ""
echo "=== نصب tailwindcss در venv ==="
/home/shop1111/nodevenv/repositories/saded/20/bin/npm install tailwindcss@^3.4.19 autoprefixer@^10.4.23 --save-dev

echo ""
echo "=== بررسی نصب ==="
if [ -d "/home/shop1111/nodevenv/repositories/saded/20/lib/node_modules/tailwindcss" ]; then
    echo "✓ tailwindcss در venv نصب شد"
else
    echo "✗ tailwindcss نصب نشد"
    exit 1
fi

echo ""
echo "=== آپدیت next.config.js ==="

# Backup
cp next.config.js next.config.js.backup

# آپدیت next.config.js - تغییر خط 66
sed -i "s|const venvPath = process.env.VIRTUAL_ENV || '/home/shop1111/nodevenv/repositories/saded/20';|const venvPath = '/home/shop1111/nodevenv/repositories/saded/20';|" next.config.js

echo "✓ next.config.js آپدیت شد"

echo ""
echo "=== بررسی next.config.js ==="
grep -A 2 "venvPath" next.config.js

echo ""
echo "=== پاک کردن .next ==="
rm -rf .next

echo ""
echo "=== Build ==="
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

npx next build --webpack

echo ""
echo "=== بررسی Build ==="
if [ -f ".next/BUILD_ID" ]; then
    echo "✓ Build موفق بود!"
    cat .next/BUILD_ID
else
    echo "✗ Build ناموفق بود"
    exit 1
fi

