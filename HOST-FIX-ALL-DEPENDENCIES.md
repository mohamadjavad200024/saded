# رفع کامل مشکل dependencies و symlink

## مشکل اصلی:
- `node_modules/node_modules` symlink نامعتبر است
- بسیاری از dependencies نصب نشده‌اند
- مشکل QueryClient در @tanstack/react-query

## راه حل کامل:

### گزینه 1: استفاده از cPanel Node.js Selector (توصیه می‌شود)

1. وارد cPanel شوید
2. به "Setup Node.js App" یا "Node.js Selector" بروید
3. Application را انتخاب کنید
4. روی "NPM Install" کلیک کنید
5. صبر کنید تا تمام dependencies نصب شوند

### گزینه 2: رفع دستی از terminal

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. حذف کامل node_modules و symlink های نامعتبر
rm -rf node_modules
rm -rf node_modules/node_modules 2>/dev/null

# 2. ایجاد symlink صحیح
VENV_NODE_MODULES="/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules"
ln -sf "$VENV_NODE_MODULES" node_modules

# 3. نصب تمام dependencies از package.json
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install

# 4. بررسی نصب
ls -la node_modules | head -20
ls -la node_modules/leaflet 2>/dev/null && echo "✓ leaflet"
ls -la node_modules/react-leaflet 2>/dev/null && echo "✓ react-leaflet"
ls -la node_modules/motion-utils 2>/dev/null && echo "✓ motion-utils"
ls -la node_modules/react-remove-scroll 2>/dev/null && echo "✓ react-remove-scroll"
ls -la node_modules/sqlstring 2>/dev/null && echo "✓ sqlstring"
ls -la node_modules/named-placeholders 2>/dev/null && echo "✓ named-placeholders"
ls -la node_modules/seq-queue 2>/dev/null && echo "✓ seq-queue"
ls -la node_modules/use-sync-external-store 2>/dev/null && echo "✓ use-sync-external-store"
ls -la node_modules/react-hook-form 2>/dev/null && echo "✓ react-hook-form"
ls -la node_modules/scheduler 2>/dev/null && echo "✓ scheduler"

# 5. Build
npm run build:low-resource
```

### گزینه 3: نصب دستی dependencies مفقود

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# نصب dependencies مفقود
/home/shop1111/nodevenv/public_html/saded/20/bin/npm install \
  leaflet react-leaflet @types/leaflet \
  motion-utils \
  react-remove-scroll \
  sqlstring \
  named-placeholders \
  seq-queue \
  use-sync-external-store \
  scheduler

# Build
npm run build:low-resource
```

## نکات مهم:

1. **cPanel Node.js Selector** بهترین راه است چون به صورت خودکار symlink را ایجاد می‌کند
2. اگر از terminal استفاده می‌کنید، مطمئن شوید که symlink به مسیر صحیح اشاره می‌کند
3. بعد از نصب، حتماً `npm run build:low-resource` را اجرا کنید

