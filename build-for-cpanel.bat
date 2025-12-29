@echo off
echo ========================================
echo Build Project for cPanel Deployment
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.

echo [2/3] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo.

echo [3/3] Checking build files...
if not exist ".next" (
    echo ERROR: .next folder not found!
    pause
    exit /b 1
)

if not exist ".next\server" (
    echo ERROR: .next\server folder not found!
    pause
    exit /b 1
)

if not exist ".next\static" (
    echo ERROR: .next\static folder not found!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Upload the .next folder to your host
echo 2. Upload all other files (except node_modules)
echo 3. Follow CPANEL_SETUP.md for deployment
echo.
pause

