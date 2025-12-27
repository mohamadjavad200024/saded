# Git Pull و Push

## مشکل:
Branch local شما behind است (تغییراتی در remote وجود دارد که در local نیست).

## راه حل:

### روش 1: Pull و Merge (توصیه می‌شود)

```powershell
# 1. Pull تغییرات remote
git pull origin main

# اگر conflict داشت، حل کن و سپس:
git add .
git commit -m "Merge remote changes"

# 2. Push
git push origin main
```

### روش 2: Pull با Rebase (اگر می‌خواهی history تمیز بماند)

```powershell
# 1. Pull با rebase
git pull --rebase origin main

# اگر conflict داشت، حل کن و سپس:
git add .
git rebase --continue

# 2. Push
git push origin main
```

### روش 3: Force Push (⚠️ فقط اگر مطمئنی که می‌خواهی remote را overwrite کنی)

```powershell
# ⚠️ خطرناک - فقط اگر مطمئنی
git push --force origin main
```

---

## توصیه:

از **روش 1** استفاده کن (Pull و Merge). این روش امن‌تر است.

