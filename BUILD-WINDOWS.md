# Build در Windows

## مشکل:
`NEXT_PRIVATE_SKIP_TURBO=1` در Windows PowerShell کار نمی‌کند.

## راه حل:

### روش 1: نصب cross-env (توصیه می‌شود)

```powershell
npm install --save-dev cross-env
```

سپس:
```powershell
npm run build
```

### روش 2: استفاده از build:low-resource (بدون NEXT_PRIVATE_SKIP_TURBO)

```powershell
npm run build:low-resource
```

### روش 3: استفاده مستقیم از next (بدون environment variable)

```powershell
npx next build --webpack
```

---

## بعد از Build موفق:

1. Commit و Push:
```powershell
git add .next/
git commit -m "Build: Add production build"
git push origin main
```

2. در هاست:
```bash
cd /home/shop1111/repositories/saded
git pull origin main
```

3. در cPanel → Node.js App Manager → Restart App

