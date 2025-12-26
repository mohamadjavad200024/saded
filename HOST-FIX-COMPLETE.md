# رفع کامل مشکل node_modules و dependencies

## مشکل:
- `node_modules/node_modules` symlink نامعتبر است
- بسیاری از dependencies نصب نشده‌اند
- CloudLinux نیاز به symlink صحیح دارد

## راه حل کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. حذف symlink های نامعتبر
if [ -L node_modules ]; then
    rm -f node_modules
fi
if [ -e node_modules/node_modules ]; then
    rm -rf node_modules/node_modules
fi

# 2. ایجاد symlink صحیح
VENV_NODE_MODULES="/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules"
ln -sf "$VENV_NODE_MODULES" node_modules

# 3. نصب تمام dependencies
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install

# 4. بررسی
ls -la node_modules
ls -la node_modules/leaflet
ls -la node_modules/react-leaflet

# 5. Build
npm run build:low-resource
```

## یا استفاده از cPanel Node.js Selector:

1. وارد cPanel شوید
2. به "Setup Node.js App" بروید
3. Application را انتخاب کنید
4. روی "NPM Install" کلیک کنید (این کار تمام dependencies را از package.json نصب می‌کند)

## بعد از نصب:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build
npm run build:low-resource
```

