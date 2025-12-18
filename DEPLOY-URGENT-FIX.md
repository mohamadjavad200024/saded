# 🚨 راهنمای اعمال فوری تغییرات

## مشکل فعلی
- خطای 403 Forbidden در chat API
- سفارشات بعد از refresh حذف می‌شوند
- تغییرات روی سرور اعمال نشده

## راه حل

### مرحله 1: Pull تغییرات از Git

```bash
cd ~/public_html/saded
git pull origin main
```

اگر خطای "Resource temporarily unavailable" دیدید:
```bash
# صبر کنید 30 ثانیه و دوباره تلاش کنید
sleep 30
git pull origin main
```

### مرحله 2: Restart PM2

```bash
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env
```

### مرحله 3: بررسی وضعیت

```bash
# بررسی وضعیت PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status

# بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 50
```

## تغییرات اعمال شده

### 1. Chat Access Control
- ✅ Auto-claim برای chatهای قدیمی که userId ندارند
- ✅ بهبود phone number normalization
- ✅ Logging بهتر برای debugging

### 2. Orders Persistence
- ✅ سفارشات همیشه به userId کاربر لینک می‌شوند
- ✅ فقط سفارشات کاربر مربوطه نمایش داده می‌شوند
- ✅ بهبود logging برای order creation

## تست بعد از اعمال

1. **Hard Refresh مرورگر**: `Ctrl+Shift+R`
2. **تست Chat**: باید بدون خطای 403 کار کند
3. **تست Orders**: 
   - یک سفارش ثبت کنید
   - صفحه را refresh کنید
   - سفارش باید باقی بماند

## اگر هنوز مشکل دارید

### بررسی لاگ‌های Chat:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 100 | grep -i "chat access"
```

### بررسی لاگ‌های Orders:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 logs saded --lines 100 | grep -i "order"
```

