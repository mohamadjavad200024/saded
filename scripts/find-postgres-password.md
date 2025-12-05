# راهنمای پیدا کردن یا تنظیم رمز PostgreSQL

## روش 1: استفاده از pgAdmin (ساده‌ترین روش)

1. pgAdmin را باز کنید (با نصب PostgreSQL نصب می‌شود)
2. به Server → PostgreSQL → Properties → Connection بروید
3. رمز را ببینید یا تغییر دهید

## روش 2: Reset کردن رمز از طریق فایل pg_hba.conf

1. فایل `pg_hba.conf` را پیدا کنید:
   - معمولاً در: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - یا: `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`

2. خط زیر را پیدا کنید:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

3. آن را به این تغییر دهید (موقتاً):
   ```
   host    all             all             127.0.0.1/32            trust
   ```

4. PostgreSQL service را restart کنید:
   - Services → PostgreSQL → Restart

5. حالا می‌توانید بدون رمز متصل شوید:
   ```bash
   psql -U postgres
   ```

6. رمز را تغییر دهید:
   ```sql
   ALTER USER postgres PASSWORD 'saded';
   ```

7. فایل `pg_hba.conf` را به حالت قبل برگردانید:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```

8. PostgreSQL service را دوباره restart کنید

## روش 3: استفاده از Windows Authentication

اگر PostgreSQL با Windows Authentication نصب شده:
- از user فعلی Windows استفاده کنید
- یا user جدید ایجاد کنید

## روش 4: نصب مجدد PostgreSQL

اگر هیچکدام کار نکرد:
1. PostgreSQL را uninstall کنید
2. دوباره نصب کنید
3. هنگام نصب، رمز را `saded` تنظیم کنید

## بعد از پیدا کردن رمز

بعد از اینکه رمز را پیدا کردید، این دستور را اجرا کنید:

```bash
DB_PASSWORD=your_password_here node scripts/setup-postgres-interactive.js
```

یا در PowerShell:
```powershell
$env:DB_PASSWORD="your_password_here"; node scripts/setup-postgres-interactive.js
```

