#!/bin/bash

# اسکریپت برای commit کردن فولدر .next به Git

echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before committing."
    exit 1
fi

echo ""
echo "📦 Adding .next folder to Git..."

# اضافه کردن فولدرهای ضروری
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json 2>/dev/null
git add -f .next/*.js 2>/dev/null
git add -f .next/app-paths-manifest.json 2>/dev/null
git add -f .next/functions-config-manifest.json 2>/dev/null
git add -f .next/middleware-manifest.json 2>/dev/null
git add -f .next/pages-manifest.json 2>/dev/null
git add -f .next/required-server-files.json 2>/dev/null
git add -f .next/routes-manifest.json 2>/dev/null
git add -f .next/images-manifest.json 2>/dev/null
git add -f .next/prerender-manifest.json 2>/dev/null
git add -f .next/fallback-build-manifest.json 2>/dev/null
git add -f .next/build-manifest.json 2>/dev/null
git add -f .next/export-marker.json 2>/dev/null

echo ""
echo "📝 Checking what will be committed..."
git status --short .next/ | head -20

echo ""
read -p "Do you want to commit these changes? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git commit -m "Add .next build files for host deployment"
    echo ""
    echo "✅ Committed! Now push with: git push origin main"
else
    echo "❌ Cancelled. Changes are staged but not committed."
    echo "   To unstage: git reset HEAD .next/"
fi

