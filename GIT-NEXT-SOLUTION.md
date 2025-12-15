# 🔄 راه حل: Commit کردن فولدر `.next` در Git

## چرا معمولاً `.next` در `.gitignore` است؟

1. **حجم زیاد**: فولدر `.next` معمولاً چند صد مگابایت حجم دارد
2. **تغییرات مداوم**: با هر build تغییر می‌کند
3. **وابسته به محیط**: ممکن است در سیستم‌های مختلف متفاوت باشد
4. **Best Practice**: معمولاً هر محیط باید خودش build کند

## اما در این مورد خاص...

چون هاست شما نمی‌تواند build کند (مشکل `WebAssembly.instantiate(): Out of memory`)، می‌توانید `.next` را commit کنید.

## راه حل: Commit کردن `.next`

### مرحله 1: حذف `.next` از `.gitignore`

در فایل `.gitignore`، خط زیر را comment کنید یا حذف کنید:

```gitignore
# next.js
# /.next/    # <-- این خط را comment کنید
/out/
```

یا می‌توانید فقط فولدرهای خاص را ignore کنید:

```gitignore
# next.js
/.next/cache/    # فقط cache را ignore کنید
/.next/trace     # فقط trace را ignore کنید
/out/
```

### مرحله 2: اضافه کردن `.next` به Git

```bash
# روی کامپیوتر محلی
cd "D:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# Build پروژه
npm run build

# اضافه کردن .next به Git (با force)
git add -f .next/

# Commit
git commit -m "Add .next folder to git for host deployment"

# Push
git push origin main
```

### مرحله 3: روی هاست - Pull تغییرات

```bash
cd ~/public_html/saded
git pull origin main

# Restart PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/lib/node_modules/pm2/bin/pm2 restart saded --update-env
```

## ⚠️ نکات مهم

### مزایا:
- ✅ نیازی به آپلود دستی نیست
- ✅ با `git pull` همه چیز به‌روز می‌شود
- ✅ مشکل WebAssembly memory حل می‌شود

### معایب:
- ❌ حجم repository زیاد می‌شود
- ❌ هر commit حجم زیادی دارد
- ❌ ممکن است merge conflict ایجاد شود

## راه حل بهتر: فقط فولدرهای ضروری

به جای commit کردن کل `.next`، می‌توانید فقط فولدرهای ضروری را commit کنید:

```gitignore
# next.js
/.next/cache/     # ignore cache
/.next/trace      # ignore trace
/.next/dev/       # ignore dev
/.next/diagnostics/  # ignore diagnostics
# بقیه .next commit می‌شود
/out/
```

سپس:

```bash
# فقط فولدرهای ضروری را اضافه کنید
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json
git add -f .next/*.js

git commit -m "Add essential .next files for deployment"
git push origin main
```

## توصیه نهایی

برای این پروژه، چون هاست نمی‌تواند build کند، **commit کردن `.next` قابل قبول است**. اما:

1. ✅ فقط فولدرهای ضروری را commit کنید (server, static, manifest files)
2. ✅ cache و trace را ignore کنید
3. ✅ بعد از هر تغییر مهم، rebuild و commit کنید


