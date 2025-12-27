# آپلود دستی .next به هاست

## روش 1: Zip کردن و آپلود (توصیه می‌شود)

### در Local (Windows):

```powershell
# 1. Zip کردن .next
Compress-Archive -Path ".next" -DestinationPath "next-build.zip" -Force

# 2. فایل next-build.zip را از طریق cPanel File Manager آپلود کن
# مسیر: /home/shop1111/repositories/saded/
```

### در هاست (cPanel):

1. **File Manager** را باز کن
2. به مسیر `/home/shop1111/repositories/saded/` برو
3. فایل `next-build.zip` را آپلود کن
4. روی فایل راست کلیک کن → **Extract**
5. فایل `.next` باید در همان مسیر extract شود

---

## روش 2: استفاده از FTP/SFTP

### در Local:

```powershell
# Zip کردن
Compress-Archive -Path ".next" -DestinationPath "next-build.zip" -Force
```

### با FTP Client (FileZilla, WinSCP):

1. به هاست متصل شو
2. به مسیر `/home/shop1111/repositories/saded/` برو
3. فایل `next-build.zip` را آپلود کن
4. Extract کن

---

## روش 3: استفاده از Terminal در هاست

### در Local:

```powershell
# Zip کردن
Compress-Archive -Path ".next" -DestinationPath "next-build.zip" -Force
```

### در هاست (Terminal):

```bash
cd /home/shop1111/repositories/saded

# آپلود فایل zip (از طریق cPanel File Manager یا FTP)

# Extract
unzip next-build.zip

# حذف zip
rm next-build.zip
```

---

## نکات مهم:

1. **فقط source code را push کن:**
   ```powershell
   git add .
   git commit -m "Fix: Resolve TypeScript errors"
   git push origin main
   ```

2. **بعد از آپلود `.next`:**
   - در cPanel → Node.js App Manager
   - **Restart App** را بزن
   - 30 ثانیه صبر کن
   - سایت را باز کن

3. **اگر `.next` را آپلود کردی:**
   - دیگر نیازی به build در هاست نیست
   - فقط Restart App را بزن

---

## اگر می‌خواهی در هاست build کنی (بدون آپلود .next):

```bash
cd /home/shop1111/repositories/saded
git pull origin main

# سپس در cPanel → Node.js App Manager → Run JS script → build:low-resource
```

---

## توصیه:

- اگر حجم `.next` زیاد است → Zip کن و آپلود کن
- اگر می‌خواهی سریع‌تر باشد → در هاست build کن (build:low-resource)

