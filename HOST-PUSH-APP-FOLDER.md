# Push app folder to Git

## مشکل:
- `app` folder در local وجود دارد اما در هاست نیست
- باید commit و push کنیم

## دستورات در LOCAL (نه هاست):

```bash
# در local machine:
cd "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"

# 1. بررسی git status
git status app/ | head -20

# 2. بررسی اینکه آیا app folder در git است
git ls-files | grep "^app/" | wc -l

# 3. اگر app folder در git نیست، add کنیم
git add app/

# 4. Commit
git commit -m "Add app folder to repository"

# 5. Push
git push origin master
```

## سپس در هاست:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. Pull
git pull origin master

# 2. بررسی
ls -la app/ | head -10

# 3. Build
NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack

# 4. Restart PM2
pm2 restart saded
```

