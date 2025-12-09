# 📋 دستورات PM2 برای هاست

## 🎯 دستورات اصلی

### مشاهده وضعیت:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 status
```

### مشاهده لاگ‌ها:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded
```

### راه‌اندازی مجدد:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
```

### توقف:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 stop saded
```

### شروع مجدد:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 start saded
```

### حذف از PM2:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 delete saded
```

### ذخیره تنظیمات:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 save
```

---

## 💡 ایجاد Alias (برای ساده‌تر شدن)

برای اینکه مجبور نباشید مسیر کامل را تایپ کنید، می‌توانید alias ایجاد کنید:

```bash
# اضافه کردن به ~/.bashrc
echo "alias pm2='/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2'" >> ~/.bashrc
echo "export PATH=/opt/alt/alt-nodejs20/root/usr/bin:\$PATH" >> ~/.bashrc
source ~/.bashrc
```

سپس می‌توانید از `pm2` به صورت عادی استفاده کنید:
```bash
pm2 status
pm2 logs saded
pm2 restart saded
```

---

## 🔍 بررسی سایت

### تست محلی:
```bash
curl http://localhost:3001
```

### تست از خارج:
```bash
curl https://77191336.shop
```

### بررسی API:
```bash
curl http://localhost:3001/api/health/db
curl http://localhost:3001/api/products
```

---

## 📊 مانیتورینگ

### مشاهده اطلاعات جزئی:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 info saded
```

### مشاهده لاگ‌های real-time:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 50
```

### پاک کردن لاگ‌ها:
```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 flush
```

---

## 🚀 راه‌اندازی خودکار پس از restart سرور

```bash
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 startup
# دستور خروجی را کپی و اجرا کنید
```

---

## 📝 نکات مهم

1. **مسیر PM2:** `/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2`
2. **مسیر Node.js:** `/opt/alt/alt-nodejs20/root/usr/bin/node`
3. **پورت:** `3001` (در ecosystem.config.js تنظیم شده)
4. **لاگ‌ها:** در `~/public_html/saded/logs/` ذخیره می‌شوند

---

## ✅ وضعیت فعلی

- ✅ پروژه با PM2 راه‌اندازی شده
- ✅ Status: online
- ✅ Port: 3001
- ✅ Memory: ~65MB

**موفق باشید! 🎉**

