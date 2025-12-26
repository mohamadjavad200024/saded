# Build مستقیم با --webpack (بدون نیاز به pull)

## دستور مستقیم:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Build با Webpack (بدون نیاز به تغییر package.json)
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
```

## بعد از Build موفق:

```bash
# راه‌اندازی PM2
npm install -g pm2
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
pm2 save
pm2 status
```

## نکات:

- `--webpack` flag باعث می‌شود Next.js از Webpack به جای Turbopack استفاده کند
- این flag در Next.js 16.0.3 پشتیبانی می‌شود
- Webpack با symlink‌های CloudLinux سازگار است

