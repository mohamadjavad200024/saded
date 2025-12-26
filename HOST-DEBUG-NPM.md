# Debug npm install issue

## دستورات برای debug:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull فایل debug script
git pull origin main

# 2. اجرای debug script
node debug-npm-install.js

# 3. بررسی log
cat .cursor/debug.log | tail -20
```

این script اطلاعات دقیق درباره npm install و symlink را جمع‌آوری می‌کند.

