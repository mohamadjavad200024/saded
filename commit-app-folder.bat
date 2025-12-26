@echo off
chcp 65001 >nul
cd /d "d:\سدیی انلاین بدون دیتا بیس\saded - Copy (4)"
echo Adding app folder...
git add app/
echo Adding components folder...
git add components/
echo Adding lib folder...
git add lib/
echo Adding public folder...
git add public/
echo.
echo Checking status...
git status --short | findstr /C:"A " | findstr /C:"app" /C:"components" /C:"lib" /C:"public"
echo.
echo Committing...
git commit -m "Add source code files (app, components, lib, public)"
echo.
echo Pushing to origin master...
git push origin master
echo.
echo Done!
pause

