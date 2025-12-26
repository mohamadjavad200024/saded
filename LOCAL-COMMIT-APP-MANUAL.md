# Commit app folder به صورت دستی

## مشکل:
- PowerShell نمی‌تواند مسیر فارسی را handle کند
- `app` folder در git نیست

## راه حل 1: استفاده از Git GUI

1. Git GUI را باز کنید
2. Repository > Open Existing Repository
3. مسیر پروژه را انتخاب کنید: `d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)`
4. در بخش "Unstaged Changes" یا "Untracked files":
   - `app/` folder را انتخاب کنید
   - Right-click > Stage to Commit
5. Commit message: "Add app folder source files"
6. Commit
7. Push > origin > master

## راه حل 2: استفاده از CMD (نه PowerShell)

```cmd
cd /d "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
git add app/
git add components/
git add lib/
git add public/
git commit -m "Add source code files (app, components, lib, public)"
git push origin master
```

## راه حل 3: بررسی اینکه آیا app در git است

اگر `app` folder قبلاً در git commit شده است، نیازی به add نیست. فقط push کنید:

```cmd
cd /d "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
git push origin master
```

## بعد از push در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded
git pull origin master
ls -la app/ | head -10
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
pm2 restart saded
```

