# اجرای Debug Script

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull فایل debug script (اگر push شده)
git pull origin main

# 2. اجرای debug script
node debug-npm-install.js

# 3. بررسی log
cat .cursor/debug.log
```

بعد از اجرا، خروجی log را برای من بفرستید تا مشکل را پیدا کنم.

