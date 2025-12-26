#!/bin/bash
# نصب autoprefixer و build

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

cd /home/shop1111/nodevenv/public_html/saded/20

# نصب autoprefixer
echo "نصب autoprefixer..."
npm install autoprefixer@10.4.23 --save-dev --force --legacy-peer-deps

# بررسی نصب
ls -la lib/node_modules/autoprefixer || echo "autoprefixer نصب نشد"

cd /home/shop1111/public_html/saded

# ایجاد symlink
rm -rf node_modules
ln -sf /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules node_modules

# بررسی autoprefixer
ls -la node_modules/autoprefixer || echo "autoprefixer از طریق symlink پیدا نشد"

# Build
export NEXT_PRIVATE_SKIP_TURBO=1
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

