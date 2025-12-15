@echo off
REM اسکریپت Windows برای commit کردن فولدر .next به Git

echo 🔨 Building project...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before committing.
    exit /b 1
)

echo.
echo 📦 Adding .next folder to Git...

REM اضافه کردن فولدرهای ضروری
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json
git add -f .next/*.js
git add -f .next/app-paths-manifest.json
git add -f .next/functions-config-manifest.json
git add -f .next/middleware-manifest.json
git add -f .next/pages-manifest.json
git add -f .next/required-server-files.json
git add -f .next/routes-manifest.json
git add -f .next/images-manifest.json
git add -f .next/prerender-manifest.json
git add -f .next/fallback-build-manifest.json
git add -f .next/build-manifest.json
git add -f .next/export-marker.json

echo.
echo 📝 Checking what will be committed...
git status --short .next/ | more

echo.
set /p confirm="Do you want to commit these changes? (y/n): "

if /i "%confirm%"=="y" (
    git commit -m "Add .next build files for host deployment"
    echo.
    echo ✅ Committed! Now push with: git push origin main
) else (
    echo ❌ Cancelled. Changes are staged but not committed.
    echo    To unstage: git reset HEAD .next/
)


