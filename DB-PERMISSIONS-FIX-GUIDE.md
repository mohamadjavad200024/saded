# 🔧 راهنمای رفع مشکل دسترسی دیتابیس MySQL

## مشکل
خطای `ER_ACCESS_DENIED_ERROR` نشان می‌دهد که کاربر دیتابیس دسترسی لازم را ندارد.

## راه حل‌ها

### روش 1: استفاده از اسکریپت خودکار (پیشنهادی)

#### روی هاست:

```bash
cd ~/public_html/saded

# 1. Pull اسکریپت‌های جدید
git pull origin main

# 2. اجرای اسکریپت رفع مشکل
chmod +x HOST-FIX-DB-PERMISSIONS.sh
./HOST-FIX-DB-PERMISSIONS.sh
```

#### یا با Node.js:

```bash
cd ~/public_html/saded

# اجرای اسکریپت (اگر root password دارید)
DB_ROOT_PASSWORD=your_root_password node scripts/fix-mysql-permissions.js

# یا بدون root password (فقط تست)
node scripts/test-mysql-connection.js
```

### روش 2: رفع دستی در MySQL

#### مرحله 1: اتصال به MySQL با root

```bash
mysql -u root -p
```

#### مرحله 2: بررسی اطلاعات از ecosystem.config.js

اطلاعات دیتابیس:
- **Database**: `shop1111_saded`
- **User**: `shop1111_saded_user`
- **Password**: `goul77191336`

#### مرحله 3: اجرای دستورات زیر در MySQL

```sql
-- 1. ایجاد دیتابیس (اگر وجود ندارد)
CREATE DATABASE IF NOT EXISTS `shop1111_saded` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 2. ایجاد کاربر (اگر وجود ندارد)
CREATE USER IF NOT EXISTS 'shop1111_saded_user'@'localhost' 
  IDENTIFIED BY 'goul77191336';

CREATE USER IF NOT EXISTS 'shop1111_saded_user'@'%' 
  IDENTIFIED BY 'goul77191336';

-- 3. دادن دسترسی کامل
GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'localhost';

GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'%';

-- 4. اعمال تغییرات
FLUSH PRIVILEGES;

-- 5. بررسی دسترسی‌ها
SHOW GRANTS FOR 'shop1111_saded_user'@'localhost';
SHOW GRANTS FOR 'shop1111_saded_user'@'%';

-- 6. خروج
EXIT;
```

### روش 3: بررسی و رفع مشکل گام به گام

#### 1. بررسی وجود کاربر

```sql
SELECT User, Host FROM mysql.user WHERE User = 'shop1111_saded_user';
```

اگر کاربر وجود ندارد، آن را ایجاد کنید (دستورات بالا).

#### 2. بررسی دسترسی‌ها

```sql
SHOW GRANTS FOR 'shop1111_saded_user'@'localhost';
```

باید دسترسی `ALL PRIVILEGES` روی دیتابیس `shop1111_saded` را ببینید.

#### 3. تست اتصال

```bash
mysql -u shop1111_saded_user -p'goul77191336' -h localhost shop1111_saded -e "SELECT 1"
```

اگر موفق بود، اتصال درست است.

#### 4. بررسی رمز عبور

اگر هنوز خطا دارید، ممکن است رمز عبور اشتباه باشد:

```sql
-- تغییر رمز عبور
ALTER USER 'shop1111_saded_user'@'localhost' IDENTIFIED BY 'goul77191336';
ALTER USER 'shop1111_saded_user'@'%' IDENTIFIED BY 'goul77191336';
FLUSH PRIVILEGES;
```

## تست نهایی

بعد از رفع مشکل، تست کنید:

```bash
# 1. تست اتصال
node scripts/test-mysql-connection.js

# 2. تست API
curl -s http://localhost:3001/api/categories | head -c 200

# 3. Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
```

## نکات مهم

1. ✅ همیشه از `FLUSH PRIVILEGES` بعد از تغییر دسترسی‌ها استفاده کنید
2. ✅ کاربر را هم برای `localhost` و هم برای `%` ایجاد کنید
3. ✅ از `utf8mb4` برای دیتابیس استفاده کنید
4. ✅ رمز عبور را در `ecosystem.config.js` بررسی کنید
5. ✅ بعد از تغییرات، PM2 را restart کنید

## مشکلات رایج

### مشکل 1: کاربر وجود دارد اما دسترسی ندارد

```sql
GRANT ALL PRIVILEGES ON `shop1111_saded`.* TO 'shop1111_saded_user'@'localhost';
FLUSH PRIVILEGES;
```

### مشکل 2: رمز عبور اشتباه است

```sql
ALTER USER 'shop1111_saded_user'@'localhost' IDENTIFIED BY 'goul77191336';
FLUSH PRIVILEGES;
```

### مشکل 3: دیتابیس وجود ندارد

```sql
CREATE DATABASE `shop1111_saded` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## پشتیبانی

اگر مشکل حل نشد:
1. لاگ‌های PM2 را بررسی کنید: `pm2 logs saded --lines 50`
2. خطای دقیق را در لاگ‌ها پیدا کنید
3. دستورات MySQL را دوباره بررسی کنید

