# 🔧 راهنمای Fix کردن بخش چت

## مشکل
بخش چت به دلیل اینکه `.next/server` folder روی هاست قدیمی است، کار نمی‌کند.

## راه حل

### مرحله 1: Rebuild روی کامپیوتر محلی

```bash
# در ترمینال کامپیوتر محلی
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# Build پروژه
npm run build
```

### مرحله 2: آپلود فولدر `.next/server`

بعد از build موفق، فولدر `.next/server` را به هاست آپلود کنید:

**مسیر روی هاست:** `~/public_html/saded/.next/server`

⚠️ **مهم:** فقط فولدر `server` را آپلود کنید، نه کل `.next`

### مرحله 3: Restart PM2 روی هاست

```bash
# روی هاست
cd ~/public_html/saded

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded --update-env

# بررسی وضعیت
sleep 3
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
```

### مرحله 4: تست API چت

```bash
# اجرای اسکریپت تست
chmod +x HOST-TEST-CHAT.sh
./HOST-TEST-CHAT.sh
```

یا تست دستی:

```bash
# تست Unread Count
curl -s "http://localhost:3001/api/chat/unread-count?all=true" | head -c 300

# تست Chat List
curl -s "http://localhost:3001/api/chat" | head -c 300
```

## نکات مهم

1. ✅ خطاهای `ECONNRESET` طبیعی هستند و در کد handle شده‌اند
2. ✅ مشکل اصلی `WebAssembly.instantiate(): Out of memory` است که با rebuild حل می‌شود
3. ✅ بعد از rebuild، PM2 را حتماً restart کنید
4. ✅ اگر بعد از rebuild هنوز خطا دارید، لاگ‌های PM2 را بررسی کنید


