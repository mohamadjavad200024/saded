#!/bin/bash
# رفع Merge Conflicts

echo "=== رفع Merge Conflicts ==="

# 1. Cancel merge
echo ""
echo "1. Canceling merge..."
git merge --abort

# 2. بررسی .gitignore
echo ""
echo "2. بررسی .gitignore..."
if ! grep -q "^\.next/" .gitignore 2>/dev/null; then
    echo ".next/" >> .gitignore
    echo "✓ .next/ به .gitignore اضافه شد"
else
    echo "✓ .next/ قبلاً در .gitignore موجود است"
fi

# 3. حذف .next از git
echo ""
echo "3. حذف .next از git tracking..."
git rm -r --cached .next 2>/dev/null || echo "⚠ .next در git tracking نیست"

# 4. استفاده از local version برای source files
echo ""
echo "4. استفاده از local version برای source files..."
git checkout --ours app/api/debug/orders/route.ts
git checkout --ours components/admin/vehicle-form.tsx
git checkout --ours components/home/category-grid.tsx
git checkout --ours components/home/hero-canvas.tsx
git checkout --ours components/product/product-detail.tsx
git checkout --ours components/product/product-search.tsx
git checkout --ours components/ui/safe-image.tsx
git checkout --ours lib/auth/session.ts
git checkout --ours next.config.js
git checkout --ours package.json
git checkout --ours server.js

echo ""
echo "✓ همه source files از local version استفاده می‌کنند"

echo ""
echo "=== آماده برای commit ==="
echo "حالا می‌توانی commit و push کنی:"
echo "  git add ."
echo "  git commit -m 'Fix: Resolve TypeScript errors and remove .next from git'"
echo "  git push origin main"

