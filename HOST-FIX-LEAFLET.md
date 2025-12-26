# رفع مشکل نصب Leaflet در CloudLinux

## مشکل:
در CloudLinux، `node_modules` باید در virtual environment باشد و npm install نمی‌تواند مستقیماً نصب کند.

## راه حل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# بررسی وجود node_modules symlink
ls -la node_modules

# اگر node_modules وجود ندارد یا symlink نیست، باید از cPanel Node.js Selector استفاده کنید
# یا نصب دستی:

# نصب leaflet و react-leaflet در virtual environment
npm install leaflet react-leaflet @types/leaflet

# بررسی نصب
ls node_modules/leaflet
ls node_modules/react-leaflet

# سپس build
npm run build:low-resource
```

## یا استفاده از cPanel Node.js Selector:

1. وارد cPanel شوید
2. به بخش "Node.js Selector" بروید
3. Application را انتخاب کنید
4. روی "NPM Install" کلیک کنید
5. یا از terminal با دستور زیر:

```bash
# نصب از طریق virtual environment
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب dependencies
npm install --prefix /home/shop1111/nodevenv/public_html/saded/20/lib/node_modules

# یا نصب مستقیم
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install
```

## راه حل سریع:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب leaflet و react-leaflet
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install leaflet react-leaflet @types/leaflet

# Build
npm run build:low-resource
```

