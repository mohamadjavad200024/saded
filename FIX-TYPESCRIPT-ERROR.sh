#!/bin/bash
# رفع خطای TypeScript

echo "=== رفع خطای TypeScript ==="

echo ""
echo "=== مشکل: خطای TypeScript در .next/dev/types/routes.d.ts ==="
echo "این فایل auto-generated است و ممکن است corrupt شده باشد"

echo ""
echo "=== راه حل: پاک کردن .next و build مجدد ==="

# در Windows PowerShell:
echo "در PowerShell این دستورات را اجرا کن:"
echo ""
echo "# 1. پاک کردن .next"
echo "Remove-Item -Recurse -Force .next"
echo ""
echo "# 2. Build مجدد"
echo "npm run build"
echo ""

# یا در Linux:
echo "در Linux/Terminal:"
echo "rm -rf .next"
echo "npm run build"
echo ""

echo "=== اگر هنوز خطا داد ==="
echo "ممکن است مشکل از route handler ها باشد"
echo "بررسی فایل‌های route.ts در app directory"

