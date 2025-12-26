# رفع مشکل Git Cache

## مشکل:
فایل `.next/cache/webpack/server-production/0.pack` 191.63 MB است و از حد GitHub (100 MB) بیشتر است.

## راه حل:

### 1. حذف cache از .next (فیزیکی):
```bash
# در PowerShell
Remove-Item -Recurse -Force .next\cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next\dev -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next\diagnostics -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next\turbopack -ErrorAction SilentlyContinue
```

### 2. Commit فقط فایل‌های ضروری:
```bash
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json
git add -f .next/*.js
git add package.json package-lock.json
git commit -m "Build: Production build ready - essential files only (no cache)"
git push origin main
```

### 3. اگر هنوز خطا داد، از git filter-branch استفاده کنید:
```bash
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .next/cache/webpack/server-production/0.pack" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

**نکته:** cache نباید commit شود. `.gitignore` درست است و cache را ignore می‌کند.

