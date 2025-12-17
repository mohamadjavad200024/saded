@echo off
REM اسکریپت Windows برای بیلد، commit و push کردن فولدر .next به Git

echo ==========================================
echo 🔨 Building Next.js project...
echo ==========================================
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before committing.
    exit /b 1
)

echo.
echo ==========================================
echo 📦 Adding .next build files to Git...
echo ==========================================

REM اضافه کردن فولدرهای ضروری
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json 2>nul
git add -f .next/*.js 2>nul
git add -f .next/app-paths-manifest.json 2>nul
git add -f .next/functions-config-manifest.json 2>nul
git add -f .next/middleware-manifest.json 2>nul
git add -f .next/pages-manifest.json 2>nul
git add -f .next/required-server-files.json 2>nul
git add -f .next/routes-manifest.json 2>nul
git add -f .next/images-manifest.json 2>nul
git add -f .next/prerender-manifest.json 2>nul
git add -f .next/fallback-build-manifest.json 2>nul
git add -f .next/build-manifest.json 2>nul
git add -f .next/export-marker.json 2>nul

echo.
echo 📝 Checking what will be committed...
git status --short .next/

echo.
echo ==========================================
echo 💾 Committing changes...
echo ==========================================

REM ایجاد commit با timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set BUILD_DATE=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%:%datetime:~12,2%

git commit -m "Build: Update .next files for deployment - %BUILD_DATE%"

if %errorlevel% neq 0 (
    echo ❌ Commit failed!
    exit /b 1
)

echo.
echo ==========================================
echo 🚀 Pushing to Git repository...
echo ==========================================

REM تشخیص branch فعلی
for /f "tokens=2" %%b in ('git rev-parse --abbrev-ref HEAD') do set CURRENT_BRANCH=%%b
if "%CURRENT_BRANCH%"=="" set CURRENT_BRANCH=main
echo Current branch: %CURRENT_BRANCH%

REM Push به remote
git push origin %CURRENT_BRANCH%

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully pushed build files to Git!
    echo.
    echo 📥 Now you can pull on the host with:
    echo    git pull origin %CURRENT_BRANCH%
) else (
    echo.
    echo ❌ Push failed! Please check your Git configuration.
    echo    You can push manually with: git push origin %CURRENT_BRANCH%
    exit /b 1
)


