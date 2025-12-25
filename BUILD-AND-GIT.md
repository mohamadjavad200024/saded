# دستورات Build و Git

لطفاً این دستورات را در ترمینال PowerShell یا CMD در مسیر پروژه اجرا کنید:

```powershell
# رفتن به مسیر پروژه
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# Build پروژه
npm run build

# اضافه کردن تغییرات
git add .

# Commit
git commit -m "Clean up: Remove temporary files, add low-resource build config"

# Push
git push origin main
```

یا می‌توانید فایل `build-and-commit.bat` را اجرا کنید که همه این کارها را به صورت خودکار انجام می‌دهد.

