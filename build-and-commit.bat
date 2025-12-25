@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Building project...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)
echo.
echo Adding changes to git...
git add .
echo.
echo Committing changes...
git commit -m "Clean up: Remove temporary files, add low-resource build config"
echo.
echo Pushing to remote...
git push origin main
if %errorlevel% neq 0 (
    echo Push failed, trying master branch...
    git push origin master
)
echo.
echo Done!
pause

