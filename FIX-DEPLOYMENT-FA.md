# راهنمای رفع مشکلات Deployment

## 🔍 تحلیل مشکلات

### مشکل 1: Git Pull خطا می‌دهد
```
error: The following untracked working tree files would be overwritten by merge:
        server.js
```
**علت:** فایل `server.js` روی سرور وجود دارد اما در git track نشده و git می‌خواهد آن را overwrite کند.

### مشکل 2: فقط 3 پکیج نصب شده
```
up to date, audited 3 packages in 2s
```
**علت:** `package.json` روی سرور با repository متفاوت است و فقط 3 پکیج دارد (باید 70+ پکیج باشد).

### مشکل 3: Script "build" پیدا نمی‌شود
```
npm error Missing script: "build"
```
**علت:** چون `package.json` اشتباه است، scripts هم وجود ندارند.

### مشکل 4: ماژول 'next' پیدا نمی‌شود
```
Error: Cannot find module 'next'
```
**علت:** Next.js نصب نشده چون dependencies نصب نشده‌اند.

## ✅ راه حل کامل

### روش 1: استفاده از اسکریپت خودکار (توصیه می‌شود)

```bash
# کپی کردن اسکریپت به سرور (از repository)
cd /home/shop1111/public_html/saded
chmod +x fix-deployment-complete.sh
./fix-deployment-complete.sh
```

### روش 2: رفع دستی (گام به گام)

```bash
# ⚠️ مهم: همیشه ابتدا virtual environment را فعال کنید!
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 2. حل مشکل git - backup کردن server.js و reset کردن
cp server.js server.js.backup 2>/dev/null || true
git fetch origin main
git reset --hard origin/main

# 3. پاک‌سازی dependencies قدیمی
rm -rf node_modules package-lock.json

# 4. نصب dependencies در virtual environment
cd /home/shop1111/nodevenv/public_html/saded/20
cp /home/shop1111/public_html/saded/package.json .
rm -rf lib/node_modules package-lock.json
npm install

# 5. ایجاد symlink
cd /home/shop1111/public_html/saded
VENV_NODE_MODULES="/home/shop1111/nodevenv/public_html/saded/20/lib/node_modules"
ln -sf "$VENV_NODE_MODULES" node_modules

# 6. بررسی نصب Next.js
ls node_modules/next || {
    echo "Next.js نصب نشد، در حال نصب..."
    cd /home/shop1111/nodevenv/public_html/saded/20
    npm install next@16.0.3 --save
    cd /home/shop1111/public_html/saded
}

# 7. Build پروژه
rm -rf .next
NODE_OPTIONS='--max-old-space-size=2048' npm run build

# 8. راه‌اندازی سرور
npm start
# یا
pm2 start ecosystem.config.js
```

## 🔧 بررسی و تست

بعد از اجرای دستورات، این موارد را بررسی کنید:

```bash
# بررسی نصب dependencies
ls node_modules/next && echo "✓ Next.js نصب شده"
ls node_modules/react && echo "✓ React نصب شده"

# بررسی build
ls .next && echo "✓ Build موفق بود"

# بررسی scripts
npm run | grep build && echo "✓ Script build وجود دارد"

# تست سرور
npm start
```

## ⚠️ نکات مهم

1. **Virtual Environment:** همیشه از virtual environment استفاده کنید
2. **Symlink:** `node_modules` باید symlink به venv باشد
3. **Memory:** برای build از `NODE_OPTIONS='--max-old-space-size=2048'` استفاده کنید
4. **Git:** اگر `server.js` محلی تغییراتی دارد، بعد از pull آن را restore کنید

## 🆘 در صورت خطا

اگر هنوز مشکل دارید:

```bash
# نصب مجدد با force
cd /home/shop1111/nodevenv/public_html/saded/20
npm install --force --legacy-peer-deps

# بررسی لاگ‌ها
npm start 2>&1 | tee deploy.log
```

