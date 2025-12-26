# Commit app folder در Local

## مشکل:
- PowerShell نمی‌تواند مسیر فارسی را handle کند
- باید دستی انجام دهید

## دستورات برای اجرا در PowerShell یا CMD:

```powershell
# 1. رفتن به مسیر پروژه
cd "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# 2. بررسی git status
git status

# 3. Add کردن فایل‌ها
git add app/
git add components/
git add lib/
git add public/

# 4. بررسی status
git status --short

# 5. Commit
git commit -m "Add source code files (app, components, lib, public)"

# 6. Push
git push origin master
```

## یا استفاده از Git GUI:
- Git GUI را باز کنید
- Repository > Add
- app/, components/, lib/, public/ را انتخاب کنید
- Commit
- Push

