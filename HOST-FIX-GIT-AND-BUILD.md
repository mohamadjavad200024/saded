# رفع مشکل Git Pull و Build

## مشکل 1: Git Pull خطا می‌دهد (فایل‌های .next)

فایل‌های `.next` باید در `.gitignore` باشند و نباید commit شوند. اما اگر روی سرور تغییر کرده‌اند:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# حذف فایل‌های .next محلی (build مجدد می‌شوند)
rm -rf .next

# Pull تغییرات
git pull origin main
```

## مشکل 2: Build هنوز از Turbopack استفاده می‌کند

`NEXT_PRIVATE_SKIP_TURBO=1` کار نکرده. باید از روش دیگری استفاده کنیم:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# استفاده از npx با flag
npx next build --no-turbo

# یا استفاده از npm run build:low-resource (اگر در package.json اضافه شده)
npm run build:low-resource
```

## دستورات کامل:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. حذف .next برای حل مشکل Git
rm -rf .next

# 2. Pull تغییرات
git pull origin main

# 3. Build بدون Turbopack
npx next build --no-turbo

# یا اگر --no-turbo کار نکرد:
NODE_OPTIONS='--max-old-space-size=2048' npx next build
```

## راه حل جایگزین: استفاده از Webpack به جای Turbopack

اگر `--no-turbo` کار نکرد، باید در `next.config.js` تنظیم شود. اما می‌توانید از متغیر محیطی استفاده کنید:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# تنظیم متغیر محیطی قبل از build
export NEXT_PRIVATE_SKIP_TURBO=1
export NODE_OPTIONS='--max-old-space-size=2048'

# Build
npm run build
```

## یا به صورت یک خط:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate && cd /home/shop1111/public_html/saded && rm -rf .next && git pull origin main && export NEXT_PRIVATE_SKIP_TURBO=1 && export NODE_OPTIONS='--max-old-space-size=2048' && npm run build
```

