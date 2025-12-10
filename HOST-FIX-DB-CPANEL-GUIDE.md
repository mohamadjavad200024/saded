# 🔧 راهنمای رفع مشکل دسترسی دیتابیس در cPanel

## مشکل
در cPanel معمولاً نمی‌توانید مستقیماً با `root` به MySQL متصل شوید. باید از cPanel یا کاربر دیگری استفاده کنید.

## راه حل‌ها

### روش 1: استفاده از cPanel (پیشنهادی)

#### مرحله 1: ورود به cPanel
1. وارد cPanel شوید
2. بخش **"MySQL Databases"** را پیدا کنید
3. روی آن کلیک کنید

#### مرحله 2: بررسی دیتابیس
1. در بخش **"Current Databases"** بررسی کنید که دیتابیس `shop1111_saded` وجود دارد
2. اگر وجود ندارد، آن را ایجاد کنید:
   - نام دیتابیس: `shop1111_saded`
   - روی **"Create Database"** کلیک کنید

#### مرحله 3: بررسی کاربر
1. در بخش **"Current Users"** بررسی کنید که کاربر `shop1111_saded_user` وجود دارد
2. اگر وجود ندارد، آن را ایجاد کنید:
   - نام کاربر: `shop1111_saded_user`
   - رمز عبور: `goul77191336`
   - روی **"Create User"** کلیک کنید

#### مرحله 4: اتصال کاربر به دیتابیس
1. در بخش **"Add User To Database"**:
   - کاربر: `shop1111_saded_user` را انتخاب کنید
   - دیتابیس: `shop1111_saded` را انتخاب کنید
   - روی **"Add"** کلیک کنید

2. در صفحه بعدی:
   - **"ALL PRIVILEGES"** را انتخاب کنید
   - روی **"Make Changes"** کلیک کنید

#### مرحله 5: تست
بعد از انجام مراحل بالا، تست کنید:

```bash
cd ~/public_html/saded

# تست اتصال
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node scripts/test-mysql-connection.js

# تست API
curl -s http://localhost:3001/api/categories | head -c 200

# Restart PM2
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded
```

### روش 2: استفاده از phpMyAdmin

#### مرحله 1: ورود به phpMyAdmin
1. در cPanel، بخش **"phpMyAdmin"** را پیدا کنید
2. روی آن کلیک کنید

#### مرحله 2: اجرای دستورات SQL
1. در phpMyAdmin، روی تب **"SQL"** کلیک کنید
2. دستورات زیر را کپی و پیست کنید:

```sql
-- بررسی وجود دیتابیس
CREATE DATABASE IF NOT EXISTS `shop1111_saded` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- حذف کاربر قبلی (اگر وجود دارد)
DROP USER IF EXISTS 'shop1111_saded_user'@'localhost';
DROP USER IF EXISTS 'shop1111_saded_user'@'%';

-- ایجاد کاربر جدید
CREATE USER 'shop1111_saded_user'@'localhost' 
  IDENTIFIED BY 'goul77191336';

CREATE USER 'shop1111_saded_user'@'%' 
  IDENTIFIED BY 'goul77191336';

-- دادن دسترسی کامل
GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'localhost';

GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'%';

-- اعمال تغییرات
FLUSH PRIVILEGES;
```

3. روی **"Go"** کلیک کنید

### روش 3: استفاده از Terminal با کاربر cPanel

اگر کاربر cPanel شما دسترسی دارد:

```bash
cd ~/public_html/saded

# اتصال با کاربر cPanel (shop1111)
mysql -u shop1111 -p < fix-db-permissions.sql
# (رمز cPanel را وارد کنید)
```

یا مستقیماً:

```bash
mysql -u shop1111 -p'your_cpanel_password' < fix-db-permissions.sql
```

### روش 4: بررسی و رفع دستی

اگر کاربر و دیتابیس از قبل وجود دارند اما دسترسی ندارند:

```bash
# اتصال به MySQL (با هر کاربری که دسترسی دارید)
mysql -u shop1111 -p

# سپس در MySQL:
```

```sql
-- بررسی کاربر
SELECT User, Host FROM mysql.user WHERE User = 'shop1111_saded_user';

-- بررسی دیتابیس
SHOW DATABASES LIKE 'shop1111_saded';

-- دادن دسترسی (اگر کاربر وجود دارد)
GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'localhost';

GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'%';

FLUSH PRIVILEGES;

EXIT;
```

## نکات مهم

1. ✅ در cPanel، نام کاربر و دیتابیس معمولاً با پیشوند نام کاربری cPanel شروع می‌شود
2. ✅ اگر کاربر از قبل وجود دارد، فقط باید دسترسی‌ها را بدهید
3. ✅ همیشه `FLUSH PRIVILEGES` را بعد از تغییر دسترسی‌ها اجرا کنید
4. ✅ بعد از تغییرات، PM2 را restart کنید

## تست نهایی

```bash
cd ~/public_html/saded

# 1. تست اتصال
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node scripts/test-mysql-connection.js

# 2. تست API
curl -s http://localhost:3001/api/categories | head -c 200

# 3. بررسی لاگ‌ها
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 logs saded --lines 20
```

