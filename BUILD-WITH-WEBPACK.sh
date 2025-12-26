#!/bin/bash
# Build با Webpack (برای حل مشکل Turbopack با symlink)

# فعال‌سازی virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate

# رفتن به مسیر پروژه
cd /home/shop1111/public_html/saded

# Disable Turbopack با environment variable
export NEXT_PRIVATE_SKIP_TURBO=1

# Build با webpack
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

echo "Build completed!"

