# Build و Push در محلی

## دستورات:

### 1. نصب dependencies (اگر نیاز است):
```bash
npm install
npm install tailwindcss@3.4.19 autoprefixer@10.4.23 --save-dev
```

### 2. Build:
```bash
npx next build --webpack
```

### 3. Commit و Push:
```bash
git add -f .next/
git add package.json package-lock.json
git commit -m "Build: Production build ready - includes tailwindcss and autoprefixer"
git push origin main
```

## در هاست - فقط Pull و Run:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# Pull تغییرات (شامل .next build شده)
git pull origin main

# فقط Run (بدون Build)
pm2 restart saded
pm2 logs saded --lines 20
```

