#!/bin/bash
# رفع مشکل node_modules و نصب dependencies

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

echo "1. بررسی و حذف symlink های نامعتبر..."
# حذف node_modules اگر symlink نامعتبر است
if [ -L node_modules ]; then
    TARGET=$(readlink -f node_modules 2>/dev/null)
    if [ $? -ne 0 ] || [ -z "$TARGET" ]; then
        echo "حذف symlink نامعتبر..."
        rm -f node_modules
    fi
fi

# حذف node_modules/node_modules اگر وجود دارد
if [ -e node_modules/node_modules ]; then
    echo "حذف node_modules/node_modules..."
    rm -rf node_modules/node_modules
fi

echo "2. ایجاد symlink صحیح به virtual environment..."
# ایجاد symlink به virtual environment
VENV_NODE_MODULES="/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules"
if [ ! -L node_modules ] && [ -d "$VENV_NODE_MODULES" ]; then
    echo "ایجاد symlink..."
    ln -sf "$VENV_NODE_MODULES" node_modules
fi

echo "3. نصب تمام dependencies..."
# نصب تمام dependencies از package.json
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install

echo "4. بررسی نصب..."
if [ -L node_modules ]; then
    TARGET=$(readlink -f node_modules)
    echo "node_modules -> $TARGET"
    ls -la "$TARGET/leaflet" 2>/dev/null && echo "✓ leaflet"
    ls -la "$TARGET/react-leaflet" 2>/dev/null && echo "✓ react-leaflet"
    ls -la "$TARGET/motion-utils" 2>/dev/null && echo "✓ motion-utils"
    ls -la "$TARGET/react-remove-scroll" 2>/dev/null && echo "✓ react-remove-scroll"
    ls -la "$TARGET/sqlstring" 2>/dev/null && echo "✓ sqlstring"
else
    echo "⚠ node_modules symlink نیست!"
fi

echo "انجام شد!"

