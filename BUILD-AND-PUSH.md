# Build و Push برای هاست

## دستورات:

### 1. Build در محلی:
```bash
npm run build
```

### 2. Commit و Push .next:
```bash
git add -f .next/
git commit -m "Build: Production build ready for deployment"
git push origin main
```

### 3. در هاست - فقط Pull و Run:
```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (شامل .next)
git pull origin main

# فقط Run (بدون Build)
pm2 restart saded
pm2 logs saded --lines 20
```

