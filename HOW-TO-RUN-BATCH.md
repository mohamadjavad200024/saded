# نحوه اجرای Batch File

## مشکل:
CMD نمی‌تواند مسیر فارسی را handle کند.

## راه حل 1: دوبار کلیک روی فایل (ساده‌ترین روش)

1. File Explorer را باز کنید
2. به مسیر پروژه بروید: `d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)`
3. فایل `RUN-GIT-COMMIT.bat` را پیدا کنید
4. **دوبار کلیک** کنید
5. پنجره CMD باز می‌شود و دستورات اجرا می‌شوند

## راه حل 2: از File Explorer با Right-click

1. File Explorer را باز کنید
2. به مسیر پروژه بروید
3. فایل `RUN-GIT-COMMIT.bat` را پیدا کنید
4. **Right-click** > **Run as administrator** (اگر نیاز باشد)

## راه حل 3: از CMD با استفاده از Short Path

اگر می‌خواهید از CMD استفاده کنید، ابتدا Short Path را پیدا کنید:

```cmd
for /f "tokens=*" %i in ('dir /x "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"') do @echo %i
```

سپس از Short Path استفاده کنید (مثلاً `D:\SADED~1`).

## راه حل 4: استفاده از Git GUI

1. Git GUI را باز کنید
2. Repository > Open Existing Repository
3. مسیر پروژه را انتخاب کنید
4. در بخش "Untracked files"، `app/` folder را انتخاب کنید
5. Right-click > Stage to Commit
6. Commit message: "Add app folder source files"
7. Commit
8. Push > origin > master

## بعد از push در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded
git pull origin master
ls -la app/ | head -10
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
pm2 restart saded
```

