-- ============================================
-- MySQL Database Permissions Fix Script
-- ============================================
-- این فایل برای رفع مشکل دسترسی دیتابیس استفاده می‌شود
-- 
-- استفاده:
-- mysql -u root -p < fix-db-permissions.sql
-- 
-- یا در MySQL:
-- source fix-db-permissions.sql
-- ============================================

-- 1. ایجاد دیتابیس (اگر وجود ندارد)
CREATE DATABASE IF NOT EXISTS `shop1111_saded` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- 2. حذف کاربر قبلی (اگر وجود دارد) - برای اطمینان از پاک بودن
DROP USER IF EXISTS 'shop1111_saded_user'@'localhost';
DROP USER IF EXISTS 'shop1111_saded_user'@'%';

-- 3. ایجاد کاربر جدید
CREATE USER 'shop1111_saded_user'@'localhost' 
  IDENTIFIED BY 'goul77191336';

CREATE USER 'shop1111_saded_user'@'%' 
  IDENTIFIED BY 'goul77191336';

-- 4. دادن دسترسی کامل به دیتابیس
GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'localhost';

GRANT ALL PRIVILEGES ON `shop1111_saded`.* 
  TO 'shop1111_saded_user'@'%';

-- 5. اعمال تغییرات
FLUSH PRIVILEGES;

-- 6. بررسی دسترسی‌ها
SELECT 'Checking grants for localhost...' AS '';
SHOW GRANTS FOR 'shop1111_saded_user'@'localhost';

SELECT 'Checking grants for %...' AS '';
SHOW GRANTS FOR 'shop1111_saded_user'@'%';

-- 7. تست اتصال
SELECT 'Testing connection...' AS '';
SELECT DATABASE() AS current_database, USER() AS current_user;

SELECT '✅ Database permissions fixed successfully!' AS '';

