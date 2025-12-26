# بررسی فایل‌های پروژه

## مشکل:
- Next.js می‌گوید `pages` یا `app` directory پیدا نمی‌کند
- این یعنی فایل‌های پروژه در هاست نیستند یا git pull کامل نشده

## دستورات:

```bash
source /home/shop1111/nodevenv/public_html/saded/20/bin/activate
cd /home/shop1111/public_html/saded

# 1. بررسی اینکه آیا app folder وجود دارد
echo "=== Checking app folder ==="
ls -la app/ 2>/dev/null | head -10 || echo "✗ app folder NOT found"

# 2. بررسی اینکه آیا pages folder وجود دارد
echo "=== Checking pages folder ==="
ls -la pages/ 2>/dev/null | head -10 || echo "✗ pages folder NOT found"

# 3. بررسی فایل‌های اصلی پروژه
echo "=== Checking project files ==="
ls -la | grep -E "app|pages|components|lib|package.json|next.config"

# 4. بررسی اینکه آیا در مسیر درست هستیم
echo "=== Current directory ==="
pwd
ls -la | head -20

# 5. اگر app folder وجود ندارد، pull کامل از git
echo "=== Pulling from git ==="
git pull origin master

# 6. بررسی بعد از pull
ls -la app/ 2>/dev/null | head -10 || echo "✗ app folder still NOT found"

# 7. اگر app folder وجود دارد، build کنیم
if [ -d "app" ] || [ -d "pages" ]; then
  echo "=== Building... ==="
  NODE_OPTIONS='--max-old-space-size=2048' npx next build --webpack
else
  echo "✗ Cannot build: app or pages folder not found"
fi

# 8. بررسی بعد از build
ls -la .next/server/app/page.js 2>/dev/null && echo "✓ page.js exists" || echo "✗ page.js NOT found"
```

## نکات:

1. **اگر `app` folder وجود ندارد:** باید git pull کنیم
2. **اگر git pull کار نکرد:** باید بررسی کنیم که آیا فایل‌ها در git هستند
3. **اگر فایل‌ها وجود دارند:** باید build کنیم

