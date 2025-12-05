# راهنمای سریع راه‌اندازی PostgreSQL

## وضعیت فعلی

PostgreSQL نصب است اما رمز را نمی‌دانیم. برای راه‌اندازی، یکی از روش‌های زیر را انتخاب کنید:

## 🚀 روش سریع (توصیه می‌شود)

### گزینه 1: استفاده از pgAdmin

1. **pgAdmin را باز کنید** (با PostgreSQL نصب می‌شود)
2. Server → PostgreSQL → راست کلیک → Properties
3. Connection tab → رمز را ببینید یا تغییر دهید
4. اگر رمز را تغییر دادید، آن را `saded` تنظیم کنید

### گزینه 2: Reset کردن رمز

1. **فایل `pg_hba.conf` را باز کنید:**
   - مسیر: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - یا: `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`

2. **خط زیر را پیدا کنید:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

3. **به این تغییر دهید (موقتاً):**
   ```
   host    all             all             127.0.0.1/32            trust
   ```

4. **PostgreSQL را restart کنید:**
   - Services → PostgreSQL → Restart
   - یا از Command Prompt: `net stop postgresql-x64-16` سپس `net start postgresql-x64-16`

5. **رمز را تغییر دهید:**
   ```bash
   psql -U postgres
   ```
   سپس در PostgreSQL:
   ```sql
   ALTER USER postgres PASSWORD 'saded';
   \q
   ```

6. **فایل `pg_hba.conf` را به حالت قبل برگردانید:**
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

7. **PostgreSQL را دوباره restart کنید**

## ✅ بعد از تنظیم رمز

بعد از اینکه رمز را `saded` تنظیم کردید، این دستور را اجرا کنید:

```bash
pnpm setup-postgres
```

یا اگر می‌خواهید با رمز دیگری کار کنید:

```bash
DB_PASSWORD=your_password pnpm migrate-postgres
```

## 🔍 پیدا کردن رمز فعلی

اگر نمی‌خواهید رمز را تغییر دهید، می‌توانید رمز فعلی را پیدا کنید:

1. از pgAdmin استفاده کنید
2. یا از فایل تنظیمات PostgreSQL
3. یا از مدیر سیستم بپرسید

سپس با رمز فعلی:

```bash
DB_PASSWORD=your_current_password pnpm migrate-postgres
```

## 📝 ایجاد فایل .env

بعد از راه‌اندازی، یک فایل `.env` در ریشه پروژه ایجاد کنید:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saded
DB_USER=postgres
DB_PASSWORD=saded
```

## 🆘 اگر هیچکدام کار نکرد

می‌توانید PostgreSQL را uninstall و دوباره نصب کنید:
1. PostgreSQL را uninstall کنید
2. دوباره نصب کنید: https://www.postgresql.org/download/windows/
3. هنگام نصب، رمز را `saded` تنظیم کنید
4. سپس `pnpm setup-postgres` را اجرا کنید

