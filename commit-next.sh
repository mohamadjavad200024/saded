#!/bin/bash

# اسکریپت برای بیلد، commit و push کردن فولدر .next به Git

echo "=========================================="
echo "🔨 Building Next.js project..."
echo "=========================================="
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before committing."
    exit 1
fi

echo ""
echo "=========================================="
echo "📦 Adding .next build files to Git..."
echo "=========================================="

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

# بررسی اینکه آیا تغییری برای commit وجود دارد
if git diff --staged --quiet .next/; then
    echo ""
    echo "ℹ️  No changes to commit. Build files are already up to date."
    exit 0
fi

echo ""
echo "=========================================="
echo "💾 Committing changes..."
echo "=========================================="

# ایجاد commit با timestamp
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Build: Update .next files for deployment - $BUILD_DATE"

if [ $? -ne 0 ]; then
    echo "❌ Commit failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "🚀 Pushing to Git repository..."
echo "=========================================="

# تشخیص branch فعلی
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

# Push به remote
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed build files to Git!"
    echo ""
    echo "📥 Now you can pull on the host with:"
    echo "   git pull origin $CURRENT_BRANCH"
else
    echo ""
    echo "❌ Push failed! Please check your Git configuration."
    echo "   You can push manually with: git push origin $CURRENT_BRANCH"
    exit 1
fi


