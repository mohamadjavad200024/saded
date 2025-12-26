@echo off
echo Building project...
call npx next build

if %ERRORLEVEL% NEQ 0 (
    echo Build failed!
    exit /b 1
)

echo Build successful! Committing and pushing...
git add -f .next/
git commit -m "Build: Production build ready for deployment"
git push origin main

echo Done!

