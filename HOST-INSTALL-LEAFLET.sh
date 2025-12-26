#!/bin/bash
# اسکریپت نصب leaflet در CloudLinux

source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

echo "بررسی node_modules..."
ls -la node_modules 2>/dev/null || echo "node_modules وجود ندارد"

echo "بررسی symlink..."
if [ -L node_modules ]; then
    echo "node_modules یک symlink است"
    echo "مسیر واقعی: $(readlink -f node_modules)"
else
    echo "node_modules symlink نیست"
fi

echo "نصب leaflet و react-leaflet..."
# استفاده از npm از virtual environment
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install leaflet react-leaflet @types/leaflet --save

echo "بررسی نصب..."
if [ -L node_modules ]; then
    TARGET=$(readlink -f node_modules)
    ls -la "$TARGET/leaflet" 2>/dev/null && echo "✓ leaflet نصب شد"
    ls -la "$TARGET/react-leaflet" 2>/dev/null && echo "✓ react-leaflet نصب شد"
else
    ls -la node_modules/leaflet 2>/dev/null && echo "✓ leaflet نصب شد"
    ls -la node_modules/react-leaflet 2>/dev/null && echo "✓ react-leaflet نصب شد"
fi

echo "انجام شد!"

