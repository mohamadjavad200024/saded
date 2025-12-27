# رفع Merge Conflicts

## مشکل:
اکثر conflict ها در فایل‌های `.next` هستند که فایل‌های build شده‌اند.

## راه حل:

### روش 1: استفاده از Local Version (توصیه می‌شود)

```powershell
# 1. Cancel merge فعلی
git merge --abort

# 2. حذف .next از git (اگر در .gitignore نیست)
# بررسی .gitignore
cat .gitignore | grep -i ".next"

# 3. اگر .next در .gitignore نیست، اضافه کن:
echo ".next/" >> .gitignore

# 4. حذف .next از git tracking
git rm -r --cached .next

# 5. فقط source code را commit و push کن
git add .
git commit -m "Fix: Resolve TypeScript errors and remove .next from git"
git push origin main
```

### روش 2: استفاده از Remote Version (اگر می‌خواهی build را در هاست انجام دهی)

```powershell
# 1. Cancel merge
git merge --abort

# 2. حذف local .next
Remove-Item -Recurse -Force .next

# 3. Pull و استفاده از remote
git pull origin main

# 4. فقط source code را commit و push کن
git add .
git commit -m "Fix: Resolve TypeScript errors"
git push origin main
```

### روش 3: Force Push (⚠️ فقط اگر مطمئنی)

```powershell
# ⚠️ خطرناک - فقط اگر مطمئنی که می‌خواهی remote را overwrite کنی
git merge --abort
git push --force origin main
```

---

## توصیه:

از **روش 1** استفاده کن:
1. `.next` را از git حذف کن
2. فقط source code را push کن
3. در هاست build کن

