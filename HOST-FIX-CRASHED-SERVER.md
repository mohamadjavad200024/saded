# Fix Crashed Server

## مشکل:
- سرور crash کرده و connection refused می‌دهد
- باید server.js را از git pull کنیم

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی وضعیت PM2
pm2 status saded
pm2 logs saded --lines 50 --nostream | tail -50

# 2. بررسی error logs
tail -50 /home/shop1111/public_html/saded/logs/pm2-error-0.log

# 3. Pull از git برای آپدیت server.js
git pull origin master

# 4. بررسی اینکه server.js آپدیت شده
grep -c "\[DEBUG\]" server.js && echo "✓ [DEBUG] found" || echo "✗ [DEBUG] NOT found"

# 5. اگر server.js آپدیت نشد، restore از backup
if ! grep -q "\[DEBUG\]" server.js; then
  echo "Restoring from backup..."
  cp server.js.backup server.js
  echo "Backup restored. Please update server.js manually."
fi

# 6. Restart PM2
pm2 restart saded

# 7. Wait for server to start
sleep 5

# 8. بررسی وضعیت
pm2 status saded

# 9. تست
curl -v http://localhost:3001/ 2>&1 | head -40

# 10. بررسی logs
tail -50 /home/shop1111/public_html/saded/logs/pm2-out-0.log | grep -E "\[DEBUG\]|ERROR|Error|Failed"
```

## اگر server.js هنوز آپدیت نشد:

باید مستقیماً فایل را ویرایش کنیم. از nano یا vi استفاده کنید:

```bash
nano server.js
# یا
vi server.js
```

سپس خطوط 61-157 را با محتوای جدید جایگزین کنید.

