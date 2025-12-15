# دستورات استقرار در هاست

## دستورات ترمینال برای اعمال تغییرات در پروژه آنلاین:

### روش 1: استفاده از اسکریپت موجود
```bash
cd ~/public_html/saded
chmod +x HOST-DEPLOY-COMPLETE.sh
./HOST-DEPLOY-COMPLETE.sh
```

### روش 2: دستورات دستی (گام به گام)

```bash
# 1. رفتن به دایرکتوری پروژه
cd ~/public_html/saded

# 2. دریافت تغییرات از Git
git fetch origin main
git reset --hard origin/main

# 3. بررسی BUILD_ID جدید
cat .next/BUILD_ID

# 4. دریافت فایل‌های static جدید (در صورت نیاز)
BUILD_ID=$(cat .next/BUILD_ID)
git checkout HEAD -- .next/static/$BUILD_ID/ 2>/dev/null || true

# 5. Restart کردن PM2
export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env

# 6. بررسی وضعیت
sleep 5
/opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

### روش 3: دستورات یک خطی (سریع)
```bash
cd ~/public_html/saded && git fetch origin main && git reset --hard origin/main && export PATH=/opt/alt/alt-nodejs20/root/usr/bin:$PATH && /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 restart saded --update-env && sleep 5 && /opt/alt/alt-nodejs20/root/usr/bin/node ~/.npm-global/bin/pm2 status
```

## نکات مهم:
- ✅ تغییرات در Git کامیت و پوش شده‌اند
- ✅ BUILD_ID جدید: `K2aLCT4gyp2YIxBrCWZsx`
- ✅ تمام فایل‌های بیلد به‌روزرسانی شده‌اند
- ⚠️ بعد از pull، PM2 باید restart شود تا تغییرات اعمال شوند

